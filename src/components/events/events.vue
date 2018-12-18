<template>
    <div class="events">
      <div class="nav">
         <ul>
           <li @click="applyFun()" :class="{'cur':tab==1}"><span></span>活动报名</li>
           <li @click="reviewFun()" :class="{'cur':tab==2}"><span></span>精彩回顾</li>
         </ul>
       </div>
      <div class="content">

          <mt-loadmore :top-method="loadTop1" :bottom-method="loadBottom1" @bottom-status-change="handleBottomChange1"
                       ref="loadmore1" :bottom-all-loaded="allLoaded1" :auto-fill="false">
            <ul v-if="tab==1">
              <li v-for="item in activityList">
                <router-link :to="{path:'/applyDetail',query:{id:item.id}}">
                  <div class="img">
                    <span v-if="item.status==0" class="icon1"></span>
                    <span v-if="item.status==1" class="icon2"></span>
                    <img :src="item.img_path" alt="" :onerror="defaultImg">
                  </div>
                  <div class="msg">
                    <h4>{{item.title}}</h4>
                    <p>{{item.create_time}}</p>
                  </div>
                </router-link>
              </li>
            </ul>
            <div class="noInner" v-if="more1">暂无更多内容喽！</div>
          </mt-loadmore>

          <mt-loadmore :top-method="loadTop2" :bottom-method="loadBottom2" @bottom-status-change="handleBottomChange2"
                       ref="loadmore2" :bottom-all-loaded="allLoaded2" :auto-fill="false">
            <ol v-if="tab==2">
              <li v-for="item in activityList">
                <router-link :to="{path:'/reviewDetail',query:{id:item.id,url:'reviewDetail'}}">
                  <div class="msg">
                    <h4>{{item.title}}</h4>
                    <p>{{item.create_time}}</p>
                  </div>
                  <div class="img"><img :src="item.img_path" alt="" :onerror="defaultImg"></div>
                </router-link>
              </li>
            </ol>
            <div class="noInner" v-if="more2">暂无更多内容喽！</div>
          </mt-loadmore>
        <div class="nodata" v-if="nodata">
          <div class="img"></div>
          <p>暂无数据</p>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        tab: 1,
        none: false,
        type : 1,//1是活动，2是回顾
        imgSrc: "../../../static/images/events/err.png",//活动图片
        activityList: "",//列表
        pageSize: 10,
        pageNum1: 1,
        pageNum2: 1,
        nodata: false,//暂无数据
        allLoaded1: false,//判断需不需要刷新
        allLoaded2: false,//判断需不需要刷新
        more1: false,//有没有更多数据
        more2: false,//有没有更多数据
        defaultImg: 'this.src="' + require('../../../static/images/common/err.png') + '"'
      }
    },
    beforeRouteLeave(to,from,next){
      let position = $(window).scrollTop();
      localStorage.setItem("scrollTop",position);
      if(to.path == "/reviewDetail" || to.path == "/applyDetail"){
        if(!from.meta.keepAlive){
          from.meta.keepAlive = true;
        }
        next();
      }else{
        from.meta.keepAlive = false;
        to.meta.keepAlive = false;
        next();
        // window.location.reload()
      }
    },
    mounted(){
      if(this.$route.query.url){
        this.tab = 2;
        this.type = 2;
      }else{
        if(this.tab == 1){
          this.type = 1;
        }else if(this.tab == 2){
          this.type = 2;
        }
      }
      this.init();
    },
    methods: {
      init(){
        if(this.tab == 1){
          var data = {
            type : this.type,
            pageSize: this.pageSize,
            pageNum: this.pageNum1,
          }
        }else{
          var data = {
            type : this.type,
            pageSize: this.pageSize,
            pageNum: this.pageNum2,
          }
        }
        this.$http({
          url: this.changeData() + "/activity/selectActivityList",
          method: "post",
          params: data
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.activityList = res.data.activityList;
            if(this.activityList.length==0){
              this.nodata = true;
            }
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      applyFun(){
        this.tab = 1;
        this.type = 1;
        this.init();
      },
      reviewFun(){
        this.tab = 2;
        this.type = 2;
        this.init();
      },
      loadTop1(){//下拉刷新
        var that = this;
        var data = {
          type : this.type,
          pageNum: this.pageNum1,
          pageSize: this.pageSize
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectCollectList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            that.collectList = res.data.collectList;
            that.$refs.loadmore1.onTopLoaded();
          }.bind(this)).catch(function(err){
            console.log("商店列表页面错误：",err)
          })
        },1000)
      },
      loadBottom1() {//上拉加载
        var that = this;
        this.pageNum1++;
        that.allLoaded1 = false;
        var data = {
          type : this.type,
          pageNum: this.pageNum1,
          pageSize: this.pageSize
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectCollectList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            if(res.data.code == 101){
              if(res.data.collectList.length <= 0){
                that.allLoaded1 = true;
              }else{
                that.collectList = that.collectList.concat(res.data.collectList)
              }
              that.$refs.loadmore1.onBottomLoaded();
            }else{
              Toast(res.data.message)
            }
          }.bind(this)).catch(function(err){
            console.log("商店列表页面错误：",err)
          })
        },1000)
      },
      handleBottomChange1(){
        var that = this;
        if(this.allLoaded1 == true){
          this.more1 = true;
          setTimeout(function () {
            that.more1 = false;
          },2000)
        }
      },
      loadTop2(){//下拉刷新
        var that = this;
        var data = {
          type : this.type,
          pageNum: this.pageNum1,
          pageSize: this.pageSize
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectCollectList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            that.collectList = res.data.collectList;
            that.$refs.loadmore2.onTopLoaded();
          }.bind(this)).catch(function(err){
            console.log("商店列表页面错误：",err)
          })
        },1000)
      },
      loadBottom2() {//上拉加载
        var that = this;
        this.pageNum2++;
        that.allLoaded2 = false;
        var data = {
          type : this.type,
          pageNum: this.pageNum2,
          pageSize: this.pageSize
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectCollectList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            if(res.data.code == 101){
              if(res.data.collectList.length <= 0){
                that.allLoaded2 = true;
              }else{
                that.collectList = that.collectList.concat(res.data.collectList)
              }
              that.$refs.loadmore2.onBottomLoaded();
            }else{
              Toast(res.data.message)
            }
          }.bind(this)).catch(function(err){
            console.log("商店列表页面错误：",err)
          })
        },1000)
      },
      handleBottomChange2(){
        var that = this;
        if(this.allLoaded2 == true){
          this.more2 = true;
          setTimeout(function () {
            that.more2 = false;
          },2000)
        }
      },
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .events{
    background: #fff;
    height: 100vh;
    .nav{
      position: fixed;
      left: 0;
      top: 0;
      width: 7.5rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      font-size: .34rem;
      background: url("../../../static/images/mine/nav-bg.png") no-repeat;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;
      z-index: 999;
      ul{
        overflow: hidden;
        li{
          width: 50%;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          float: left;
          position: relative;
          &.cur{
           span{
             display: block;
           }
          }
          span{
            display: none;
            position: absolute;
            left: 50%;
            bottom: .1rem;
            margin-left: -0.55rem;
            width:1.1rem;
            height:.04rem;
            background:rgba(255,255,255,1);
          }
        }
      }
    }
    .content{
      background: #fff;
      margin-top: 1rem;
      padding: 0 .3rem 1.5rem;
      ul{
        padding-top: .3rem;
        li{
          width: 6.88rem;
          background: #fff;
          margin-bottom: .3rem;
          a{
            display: inline-block;
            width: 100%;
            height: 100%;
          }
          .img{
            position: relative;
            span{
              position: absolute;
              right: -.14rem;
              top: .3rem;
              width: 1.48rem;
              height: 0.76rem;
              &.icon1{
                background: url("../../../static/images/events/jinxing.png") no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
              }
              &.icon2{
                width: 1.22rem;
                height: 0.5rem;
                background: url("../../../static/images/events/jieshu.png") no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
              }
            }
            img{
              width: 6.88rem;
              height: 3.4rem;
              border-radius:.2rem .2rem 0 0;
            }
          }
          .msg{
            padding: .2rem .3rem;
            border: 0.01rem solid #EAEAEA;
            border-top: none;
            border-radius:0 0 .2rem .2rem;
            h4{
              font-size: .32rem;
              line-height: .45rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            p{
              text-align: right;
              font-size: .24rem;
              color: #ccc;
            }
          }
        }
      }
      ol{
        li{
          padding-top: .3rem;
          border-bottom: 0.01rem solid #EAEAEA;
          overflow: hidden;
          padding-bottom: .2rem;
          a{
            display: inline-block;
            width: 100%;
            height: 100%;
          }
          .msg{
            float: left;
            width: 4.3rem;
            margin-right: .3rem;
            h4{
              font-size: .32rem;
              line-height: .6rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            p{
              margin-top: .3rem;
              font-size: .24rem;
              color: #898989;
            }
          }
          .img{
            float: left;
            width: 2.26rem;
            height: 1.7rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .none{
        width: 1.68rem;
        height: 1.68rem;
        margin: 2rem auto 0;
        div{
          width: 1.68rem;
          height: 1.68rem;
          background: url("../../../static/images/common/none.png") no-repeat;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
        }
        p{
          text-align: center;
          font-size: .3rem;
          margin-top: .2rem;
        }
      }
    }
  }
</style>
