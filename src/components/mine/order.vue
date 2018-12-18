<template>
    <div class="order">
      <div class="nav" @click="back()"><span></span>我的订单</div>
      <div class="title">
        <span @click="noPayFun()" :class="{'cur':tab==1}"><b></b>未支付</span>
        <span @click="payFun()" :class="{'cur':tab==0}"><b></b>已支付</span>
      </div>
      <div class="content">
        <mt-loadmore :top-method="loadTop1" :bottom-method="loadBottom1" @bottom-status-change="handleBottomChange1"
                     ref="loadmore1" :bottom-all-loaded="allLoaded1" :auto-fill="false">
          <ul v-if="tab==1">
            <li v-for="item in orderList">
              <div class="msg">
                <h4>
                  <span v-if="item.orderType==0" class="icon1"></span>
                  <span v-else class="icon2"></span>
                  {{item.order_type}}
                  <b v-if="item.orderType==0">未支付会费</b>
                  <b v-else>未支付活动费用</b>
                </h4>
                <p>{{item.title}}</p>
              </div>
              <div class="time">
                <span>{{item.orderTime}}</span><b @click="goPayFun(item)">支付</b>
              </div>
            </li>
          </ul>
          <div class="noInner" v-if="more1">暂无更多内容喽！</div>
        </mt-loadmore>
        <mt-loadmore :top-method="loadTop2" :bottom-method="loadBottom2" @bottom-status-change="handleBottomChange2"
                     ref="loadmore2" :bottom-all-loaded="allLoaded2" :auto-fill="false">
          <ul v-if="tab==0">
            <li v-for="item in orderList">
              <div class="msg">
                <h4>
                  <span v-if="item.orderType==0" class="icon1"></span>
                  <span v-else class="icon2"></span>
                  {{item.order_type}}
                  <b v-if="item.pay_status==2">已退款（审核未通过）</b>
                </h4>
                <p>{{item.title}}</p>
              </div>
              <div class="time">
                <span>{{item.orderTime}}</span>
              </div>
            </li>
          </ul>
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
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
    data () {
        return {
          tab: 1,
          pageSize: 10,
          pageNum: 1,
          pageNum1: 1,
          pageNum2: 1,
          nodata: false,//暂无数据
          allLoaded1: false,//判断需不需要刷新
          allLoaded2: false,//判断需不需要刷新
          more1: false,//有没有更多数据
          more2: false,//有没有更多数据
          orderList: ""
        }
    },
    mounted() {
      this.init();
    },
    methods:{
      init(){
        this.$http({
          url: this.changeData() + "/memberOrder/auth/selectOrderList",
          method: "post",
          params: {
            type : this.tab,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.orderList = res.data.orderList;
            if(this.orderList.length==0){
              this.nodata = true;
            }
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log(err)
        })
      },
      back(){
        if(this.$route.query.url){
          this.$router.go(-1);
        }else{
          this.$router.push({path:"/mine"})
        }
      },
      payFun(){
        this.tab = 0;
        this.init();
      },
      noPayFun(){
        this.tab = 1;
        this.init();
      },
      goPayFun(item){
        if(item.orderType == 0){
          this.$router.push({path:"/pay",query:{orderNo:item.order_no}})
        }else{
          this.$router.push({path:"/pay",query:{orderNo:item.order_no,orderType:1}})
        }
      },
      loadTop1(){//下拉刷新
        var that = this;
        var data = {
          type : this.tab,
          pageSize: this.pageSize,
          pageNum: this.pageNum1
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/memberOrder/auth/selectOrderList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            that.orderList = res.data.orderList;
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
          type : this.tab,
          pageSize: this.pageSize,
          pageNum: this.pageNum1
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/memberOrder/auth/selectOrderList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            if(res.data.orderList.length <= 0){
              that.allLoaded1 = true;
            }else{
              that.orderList = that.collectList.concat(res.data.orderList)
            }
            that.$refs.loadmore1.onBottomLoaded();
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
          type : this.tab,
          pageSize: this.pageSize,
          pageNum: this.pageNum2
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/memberOrder/auth/selectOrderList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            that.orderList = res.data.orderList;
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
          type : this.tab,
          pageSize: this.pageSize,
          pageNum: this.pageNum1
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/memberOrder/auth/selectOrderList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            if(res.data.orderList.length <= 0){
              that.allLoaded2 = true;
            }else{
              that.orderList = that.orderList.concat(res.data.orderList)
            }
            that.$refs.loadmore2.onBottomLoaded();
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
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .order{
    .title{
      background: #fff;
      height: .8rem;
      line-height: .8rem;
      font-size: 0;
      text-align: center;
      margin-top: 1rem;
      border-bottom: .01rem solid #eaeaea;
      span{
        display: inline-block;
        width: 50%;
        height: .8rem;
        font-size: .3rem;
        position: relative;
        &.cur{
          b{
            display: block;
          }
        }
        b{
          display: none;
          position: absolute;
          width: .84rem;
          height: .04rem;
          left: 50%;
          margin-left: -.42rem;
          bottom: 0;
          background: #3C915C;
        }
      }
    }
    .content{
      margin-top: .2rem;
      ul{
        li{
          padding: 0 .3rem;
          margin-bottom: .2rem;
          width: 6.9rem;
          background:#fff;
          .msg{
            border-bottom: 0.01rem solid #EAEAEA;
            h4{
              font-size: .34rem;
              padding: .4rem 0 .3rem;
              span{
                display: inline-block;
                vertical-align: -.05rem;
                margin-right: .1rem;
                width: .4rem;
                height: .4rem;
                &.icon1{
                  background: url("../../../static/images/mine/zjlm.png") no-repeat;
                  -webkit-background-size: 100% 100%;
                  background-size: 100% 100%;
                }
                &.icon2{
                  background: url("../../../static/images/mine/hdhf.png") no-repeat;
                  -webkit-background-size: 100% 100%;
                  background-size: 100% 100%;
                }
              }
              b{
                float: right;
                font-size: .3rem;
                color: #E98452;
              }
            }
            p{
              font-size: .3rem;
              margin-bottom: .4rem;
            }
          }
          .time{
            height: 1rem;
            line-height: 1rem;
            font-size: .28rem;
            color: #898989;
            b{
              float: right;
              width: 1.84rem;
              height: .68rem;
              margin-top: .2rem;
              line-height: .68rem;
              text-align: center;
              color: #fff;
              background: #3C915C;
              border-radius: 1rem;
            }
          }
        }
      }
    }
  }
</style>
