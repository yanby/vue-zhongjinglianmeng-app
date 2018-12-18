<template>
    <div class="message">
      <div class="nav" @click="back()"><span></span>消息 <b @click.stop="bianjiFun()">编辑</b></div>
      <div class="content">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
          <ul>
            <li v-for="item in selectPushList" @click="goFun($event,item)">
              <h3>{{item.create_time}}</h3>
              <div class="msg">
                <b class="look" v-if="item.status==0"></b>
                <span v-if="select" @click.stop="selectFun($event,item)"></span>
                <h4>系统消息</h4>
                <p>{{item.title}}</p>
              </div>
            </li>
          </ul>
          <div class="noInner" v-if="more">暂无更多内容喽！</div>
        </mt-loadmore>
        <div class="nodata" v-if="nodata">
          <div class="img"></div>
          <p>暂无数据</p>
        </div>
      </div>
      <div class="operation" v-if="select">
        <span @click="cancelFun()">取消</span><span @click="removeFun()">删除</span>
      </div>
    </div>
</template>

<script>
import { Toast,Actionsheet  } from 'mint-ui';
import axios from 'axios';
import qs from 'qs';
export default {
    data () {
        return {
          arr: [],
          ids: "",
          select: false,
          pageSize: 10,
          pageNum: 1,
          nodata: false,//暂无数据
          allLoaded: false,//判断需不需要刷新
          more: false,//有没有更多数据
          selectPushList: "",//消息列表
        }
    },
    computed:{

    },
    mounted() {
      this.init();
    },
    methods: {
      init(){
        this.$http({
          url: this.changeData() + "/member/auth/selectPushList",
          method: "post",
          params: {
            pageSize :  this.pageSize,
            pageNum : this.pageNum
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.selectPushList = res.data.selectPushList;
            if(this.selectPushList.length == 0){
              this.nodata = true;
            }
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      back(){
        this.$router.go(-1);
      },
      selectFun(e,item){
        if($(e.srcElement).hasClass("cur")){
          $(e.srcElement).removeClass("cur")
          var obj = this.arr.indexOf(item.updateId);
          this.arr.splice(obj, 1);
        }else{
          $(e.srcElement).addClass("cur")
          this.arr.push(item.updateId);
          this.ids = this.arr.join(",")
        }
      },
      bianjiFun(){
        this.select = true;
        $(".msg").css({"padding":".2rem .6rem .3rem .8rem"})
      },
      cancelFun(){
        this.select = false;
        $(".msg").css({"padding":".2rem .6rem .3rem"})
      },
      removeFun(){
        this.$http({
          url: this.changeData() + "/member/auth/delPush",
          method: "post",
          params: {
            id: this.arr.join(",")
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            Toast("删除成功！")
            this.init();
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      goFun(e,item){
        this.$http({
          url: this.changeData() + "/member/auth/updatePushStatus",
          method: "post",
          params: {
            id: item.updateId
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            $(e.srcElement).children(".look").hide();
            //0 新闻和公告 1 活动 2回顾
            if(item.message_id == 0){
              this.$router.push({path:"/newsInfo",query:{id:item.message_id,url:"collect"}})
            }else if(item.message_id == 1){
              this.$router.push({path:"/applyDetail",query:{id:item.message_id,url:"collect"}})
            }else{
              this.$router.push({path:"/reviewDetail",query:{id:item.message_id,url:"collect"}})
            }
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      loadTop(){//下拉刷新
        var that = this;
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectCollectList',
            method: "post",
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }
          }).then(function(res){
            console.log(res)
            that.collectList = res.data.collectList;
            that.$refs.loadmore.onTopLoaded();
          }.bind(this)).catch(function(err){
            console.log("商店列表页面错误：",err)
          })
        },1000)
      },
      loadBottom() {//上拉加载
        var that = this;
        this.pageNum++;
        that.allLoaded = false;
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectCollectList',
            method: "post",
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize
            }
          }).then(function(res){
            console.log(res)
            that.collectList = that.collectList.concat(res.data.collectList)
            if(res.data.collectList.length <= 0){
              that.allLoaded = true;
            }
            that.$refs.loadmore.onBottomLoaded();
          }.bind(this)).catch(function(err){
            console.log("商店列表页面错误：",err)
          })
        },1000)
      },
      handleBottomChange(){
        var that = this;
        if(this.allLoaded == true){
          this.more = true;
          setTimeout(function () {
            that.more = false;
          },2000)
        }
      }
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .message{
    position: relative;
    .nav{
      b{
        position: absolute;
        top: 0rem;
        right: .2rem;
      }
    }
    .content{
      margin-top: 1rem;
      ul{
        li{
          h3{
            height: 1.1rem;
            line-height: 1.1rem;
            text-align: center;
            font-size: .28rem;
            color: #898989;
          }
          .msg{
            padding: .2rem .6rem .3rem;
            background: #fff;
            position: relative;
            b{
              position: absolute;
              right: .3rem;
              top: .15rem;
              width: .2rem;
              height: .2rem;
              background: #f00;
              border-radius: 50%;
            }
            span{
              position: absolute;
              left:.3rem;
              top: 50%;
              margin-top: -.15rem;
              width: .3rem;
              height: .3rem;
              background: url("../../../static/images/mine/kuang.png") no-repeat;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
              &.cur{
                background: url("../../../static/images/mine/kuang-bg.png") no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
              }
              b{
                display: none;
                position: absolute;
                left: .05rem;
                top: .05rem;
                width: .22rem;
                height: .16rem;
                background: url("../../../static/images/mine/dui.png") no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
              }
            }
            h4{
              margin-bottom: .24rem;
              font-size: .3rem;
            }
            p{
              line-height: .45rem;
              font-size: .28rem;
            }
          }
        }
      }
    }
    .operation{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 7.5rem;
      height: 1rem;
      line-height: 1rem;
      font-size: 0;
      span{
        display: inline-block;
        width: 50%;
        font-size: .34rem;
        text-align: center;
        background: #CBCFCC;
        color: #fff;
        &:nth-of-type(2){
          background: #3C915C;
        }
      }
    }
  }
</style>
