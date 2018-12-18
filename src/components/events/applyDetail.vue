<template>
    <div class="applyDetail">
      <div class="nav" @click="back()"><span></span>活动详情</div>
      <div class="content">
        <h3>{{activityDetail.title}}</h3>
        <div class="img"><img :src="activityDetail.img_path" alt="" :onerror="defaultImg"></div>
        <div class="time">
          <p><b>票&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种：</b><i>{{activityDetail.cost}}</i> </p>
          <p><b>活动时间：</b><i>{{activityDetail.create_time}}</i></p>
          <p><b>活动地点：</b><i>{{activityDetail.location}}</i></p>
        </div>
        <div class="map" id="allmap"></div>
        <div class="msg">
          <h4>活动详情 <span></span></h4>
          <div v-html="activityDetail.content"></div>
        </div>
        <div class="notice">
          <h4>活动须知 <span></span></h4>
          <div v-html="activityDetail.instructions"></div>
        </div>
        <div class="apply" v-if="activityList.length!=0">
          <h4>已报名({{totalCount}}) <span></span></h4>
          <ul class="clearfix">
            <li v-for="item in activityList">
              <div class="icon"><img :src="item.img_path" alt="" :onerror="defaultImg1"></div>
              <div class="name">{{item.memberName}}</div>
              <p>{{item.create_time}}</p>
            </li>
          </ul>
          <div v-if="more" class="switch" @click="loadBottom()">点开更多报名 ∨</div>
          <div v-if="shouqi" class="switch" @click="loadTop()">收起 ∧</div>
        </div>
      </div>
      <div class="footer">
        <div class="cang">
          <dl>
            <dt class="myshou" @click="shoucang($event)"></dt>
            <dd>关注</dd>
          </dl>
        </div>
        <div v-if="activityDetail.status == 0" class="tel" @click="baomingFun()">
          <b>活动报名</b>  <!-- <a :href="tel">直拨店主</a> -->
        </div>
        <div v-if="activityDetail.status == 1" class="tel">
          <b>活动已结束</b>  <!-- <a :href="tel">直拨店主</a> -->
        </div>
      </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
    data () {
        return {
          id:"",//活动id
          activityDetail: "",//详情
          totalCount:"",//总数
          activityList:"",//报名列表
          pageNum: 1,//页码
          pageSize: 10,//条数
          shouqi: false,
          more: true,
          logo: "../../../static/images/mine/logo.png",
          defaultImg: 'this.src="' + require('../../../static/images/common/err.png') + '"',
          defaultImg1: 'this.src="' + require('../../../static/images/mine/user.png') + '"'
        }
    },
    computed:{

    },
    mounted() {
      this.id = this.$route.query.id;
      if(getUrlId("move")){
        $(".nav").hide();
        $(".footer").hide();
        $(".content").css({"margin": "0"})
      }
      this.init();
    },
    updated(){
      this.fenxiangFun();
    },
    beforeRouteEnter (to, from, next) {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // XXX: 修复iOS版微信HTML5 History兼容性问题
      if (isiOS && to.path !== location.pathname) {
        // 此处不可使用location.replace
        location.assign(to.fullPath)
      } else {
        next()
      }
    },
    methods:{
      init(){
        this.$http({
          url: this.changeData() + "/activity/selectActivityDetail",
          method: "post",
          params: {
            type :  1,//1是活动2是回顾
            id : this.id,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.activityDetail = res.data.activityDetail;
            this.totalCount = res.data.totalCount;
            this.activityList = res.data.activityList;
            if(this.activityDetail.is_collect == 1){
              $(".myshou").addClass("cur");
            }
            this.mapFun();
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      back(){
        if(this.$route.query.url){
          this.$router.go(-1);
        }else{
          this.$router.push({path:"/events"});
        }
      },
      mapFun(){// 百度地图API功能
        var that = this;
        var map = new BMap.Map("allmap");
        //var point = new BMap.Point(this.projectDetail.lng,this.projectDetail.lat);//经度、维度
        var point = new BMap.Point(this.activityDetail.lng, this.activityDetail.lat);
        map.centerAndZoom(point, 12);
        var marker = new BMap.Marker(point);  // 创建标注
        var opts = {
          width : 100,     // 信息窗口宽度
          height: 20,     // 信息窗口高度
        }
        var project_address = this.activityDetail.location+"";
        var infoWindow = new BMap.InfoWindow(project_address, opts);  // 次数还没用完
        map.openInfoWindow(infoWindow,point); //开启信息窗口
        map.addOverlay(marker);
        map.enableScrollWheelZoom(true);
        map.disableDragging();     //禁止拖拽
      },
      shoucang(e){// 点击收藏
        var that = this;
        if(localStorage.token){
          if($(e.srcElement).hasClass("cur")){//取消收藏
            this.$http({
              url: this.changeData() + '/member/auth/cancelCollect',
              method: 'post',
              params: {
                collectType: "1", //新闻和公告都传 0 活动传1
                id: this.id //收藏内容的id
              }
            }).then(res => {
              console.log(res);
              if(res.data.code == 101){
                $(".myshou").removeClass("cur");
                Toast('取消关注');
              }else{
                Toast(res.data.message);
              }
            }).catch(err => {
              console.log(err)
            });
          }else{
            this.$http({
              url: this.changeData() + '/member/auth/collect',
              method: 'post',
              params: {
                type: "1", //新闻和公告都传 0 活动传1
                id: this.id //收藏内容的id
              }
            }).then(res => {
              console.log(res);
              if(res.data.code == 101){
                Toast('关注成功');
                $(".myshou").addClass("cur");
              }else{
                Toast(res.data.message)
              }
            }).catch(err => {
              console.log(err)
            });
          }
        }else{
          this.$router.push({path:"/login"})
        }
      },
      fenxiangFun(){//详情分享
        var that = this;
        this.$http({
          url:this.changeData() + '/member/weChatShare',
          method: "post",
          params: {
            url : window.location.href.split('#')[0]
          }
        }).then(function(res){
          // console.log(res)
          wx.config({
            //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature,// 必填，签名
            jsApiList: ["onMenuShareAppMessage","onMenuShareTimeline"] // 必填，需要使用的JS接口列表
          });

          wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            //分享给朋友
            wx.onMenuShareAppMessage({
              title: that.activityDetail.title, // 分享标题
              desc: '中经联盟', // 分享描述
              link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: "https://up-static.oss-cn-beijing.aliyuncs.com/Config/11544678901_.pic_hd.jpg", // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户点击了分享后执行的回调函数
              }
            });

            //分享到朋友圈
            wx.onMenuShareTimeline({
              title: that.activityDetail.title, // 分享标题
              link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: "https://up-static.oss-cn-beijing.aliyuncs.com/Config/11544678901_.pic_hd.jpg", // 分享图标
              success: function () {
                // 用户点击了分享后执行的回调函数
              }
            });
          });
          wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          });
        }.bind(this)).catch(function(err){
          console.log("商店详情页面错误：",err)
        });
      },
      baomingFun(){
        if(localStorage.token){
          this.$http({
            url: this.changeData() + "/memberOrder/auth/isSignUp",
            method: "post",
            params: {
              id : this.id,
            }
          }).then(function(res){
            console.log(res);
            if(res.data.code=="101"){
              if(res.data.flag == 0){
                this.$router.push({path:"/apply",query:{id:this.id}})
              }else{
                Toast("您已经成功报名，不可再次报名")
              }
            }else{
              Toast(res.data.message)
            }
          }.bind(this)).catch(function(err){
            console.log("收藏页面错误：",err)
          })
        }else{
          Toast("请先登录")
          this.$router.push({path:"/login"})
        }
      },
      loadBottom() {//上拉加载
        this.pageNum++;
        this.$http({
          url: this.changeData() + '/activity/selectActivityDetail',
          method: "post",
          params: {
            type :  1,//1是活动2是回顾
            id : this.id,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res)
          if(res.data.code == 101){
            this.activityList = this.activityList.concat(res.data.activityList)
            if(res.data.activityList.length == 0){
              this.shouqi = true;
              this.more = false;
              Toast("没有更多数据了")
            }else{
              Toast(res.data.message)
            }
          }
        }.bind(this)).catch(function(err){
          console.log("商店列表页面错误：",err)
        })
      },
      loadTop(){
        this.pageNum = 1;
        this.$http({
          url: this.changeData() + "/activity/selectActivityDetail",
          method: "post",
          params: {
            type :  1,//1是活动2是回顾
            id : this.id,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.activityList = res.data.activityList;
            this.shouqi = false;
            this.more = true;
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      }
    },

}
</script>

<style scoped>
  .msg,.notice{
    overflow: hidden;
  }
  .msg >>> img,.notice >>> img{
    max-width: 6.9rem;
  }
</style>
<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .applyDetail{
    background: #fff;
    .content{
      margin-top: 1rem;
      padding: .7rem .3rem 1.5rem;
      h3{
        font-weight: bold;
        font-size: .36rem;
        line-height: .6rem;
      }
      .img{
        margin: .7rem 0;
        img{
          width: 6.9rem;
          height: 3.45rem;
          border-radius:.04rem;
        }
      }
      .time{
        p{
          font-size: .28rem;
          margin-bottom: .1rem;
          overflow: hidden;
          b{
            float: left;
            line-height: .45rem;
          }
          i{
            float: left;
            width: 5.3rem;
            line-height: .45rem;
          }
        }
      }
      .map{
        width: 6.9rem;
        height: 3.45rem;
        margin: .4rem 0 .8rem;
      }
      .msg{
        h4{
          font-size: .36rem;
          font-weight: bold;
          margin-bottom: .3rem;
          position: relative;
          span{
            position: absolute;
            left: 0rem;
            bottom: -.1rem;
            width:1.5rem;
            height:0.16rem;
            background:rgba(156,207,169,.8);
          }
        }
        div{
          max-width: 6.9rem;
        }
      }
      .notice{
        margin: .7rem 0 .4rem;
        h4{
          font-size: .36rem;
          font-weight: bold;
          margin-bottom: .3rem;
          position: relative;
          span{
            position: absolute;
            left: 0rem;
            bottom: -.1rem;
            width:1.5rem;
            height:0.16rem;
            background:rgba(156,207,169,.8);
          }
        }
        div{
          max-width: 6.9rem;
        }
      }
      .apply{
        h4{
          font-size: .36rem;
          font-weight: bold;
          margin-bottom: .3rem;
          position: relative;
          span{
            position: absolute;
            left: 0rem;
            bottom: -.1rem;
            width:1.6rem;
            height:0.16rem;
            background:rgba(156,207,169,.8);
          }
        }
        ul{
          li{
            width: 1.2rem;
            float: left;
            margin: 0 .25rem;
            text-align: center;
            .icon{
              img{
                width: .98rem;
                height: .98rem;
                border-radius: 50%;
              }
            }
            .name{
              font-size: .28rem;
              margin: .2rem 0 .1rem;
            }
            p{
              font-size: .28rem;
              color: #999;
            }
          }
        }
        .switch{
          width: 6.9rem;
          height: 0.88rem;
          line-height: 0.88rem;
          text-align: center;
          color: #3C915C;
          background: #EAEAEA;
          margin: .3rem 0 .6rem;
        }
      }
    }
    .footer{
      width: 7.5rem;
      position: fixed;
      bottom: 0;
      //left: 0;
      height: 1.1rem;
      line-height: 1.1rem;
      display: flex;
      z-index: 9999;
      .cang{
        background: #fff;
        width: 2.1rem;
        dl{
          width: 2.1rem;
          margin: .2rem 0;
          box-sizing: border-box;
          border-right: 1px solid #f5f5f5;
          dt{
            cursor: pointer;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            margin-left: .8rem;
            width: .42rem;
            height: .40rem;
            margin-bottom: .1rem;
            background: url("../../../static/images/common/shoucang.png") no-repeat;
            background-size: .42rem .40rem;
            &.cur{
              background-image: url("../../../static/images/common/shoucang-bg.png");
            }
          }
          dd{
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            height: .2rem;
            line-height: .2rem;
            font-size: .2rem;
            text-align: center;
          }
        }
      }
      .tel{
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        text-align: center;
        background: #3C915C;
        width:5.4rem;
        height: 1.1rem;
        position: relative;
        .tel-msg{
          width: 5rem;
          height: .6rem;
          line-height: .6rem;
          color: #fff;
          font-size: .22rem;
          background: #93C5FF;
          position: absolute;
          right: .55rem;
          top: -.8rem;
          border-radius: .05rem;
          .jiao{
            position: absolute;
            top: .6rem;
            left: 50%;
            margin-left: -.1rem;
            width: 0;
            height: 0;
            border: .15rem solid #93C5FF;
            border-left-color: transparent;
            border-right-color: transparent;
            border-bottom-color: transparent;
          }
        }
        span{
          display: inline-block;
          width: .36rem;
          height: .38rem;

          background-size: .36rem .38rem;
          vertical-align: -.1rem;
          margin-right: .2rem;
        }
        b{
          color: #fff;
          font-size: .34rem;
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        a{
          font-size: .32rem;
          color: #fff;
        }
      }
    }
  }
</style>
