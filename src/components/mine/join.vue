<template>
    <div class="join">
      <div class="nav" @click="back()"><span></span>我的加盟</div>
      <div class="content">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
          <ul>
            <li v-for="item in memberJoinList">
              <div class="msg">
                <h4>{{item.levelName}} <b v-if="item.audit_status==2">{{item.statusText}}</b><b v-else class="cur">{{item.statusText}}</b></h4>
                <p>{{item.service_name}}</p>
              </div>
              <div class="time">
                <span>{{item.apply_time}}</span><b>{{item.fee}}元 <i>联盟会费</i></b>
              </div>
            </li>
          </ul>
          <div class="noInner" v-if="more">暂无更多内容喽！</div>
        </mt-loadmore>
      </div>
      <div class="nodata" v-if="nodata">
        <div class="img"></div>
        <p>暂无数据</p>
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
          pageNum: 1,
          pageSize: 10,
          more: false,
          nodata: false,
          allLoaded: false,
          memberJoinList:""
        }
    },
    mounted() {
      this.init();
    },
    methods:{
      init(){
        this.$http({
          url: this.changeData() + "/memberOrder/auth/memberJoin",
          method: "post",
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.memberJoinList = res.data.memberJoinList;
            if(this.memberJoinList.length==0){
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
      }
    },
    loadTop(){//下拉刷新
      var that = this;
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      setTimeout(function () {
        that.$http({
          url: that.changeData() + '/member/auth/selectCollectList',
          method: "post",
          params: data
        }).then(function(res){
          console.log(res)
          that.memberJoinList = res.data.memberJoinList;
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
      var data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      alert(this.pageNum)
      setTimeout(function () {
        that.$http({
          url: that.changeData() + '/member/auth/selectCollectList',
          method: "post",
          params: data
        }).then(function(res){
          console.log(res)
          if(res.data.memberJoinList.length <= 0){
            that.allLoaded = true;
          }else{
            that.memberJoinList = that.memberJoinList.concat(res.data.memberJoinList)
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
    },

}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .join{
    .content{
      margin-top: 1rem;
      padding: .3rem;
      ul{
        li{
          padding: 0 .3rem;
          margin-bottom: .3rem;
          width: 6.3rem;
          height: 2.88rem;
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
                background: url("../../../static/images/mine/zjlm.png") no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
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
                &.cur{
                  color: #3C915C;
                }
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
              font-size: .34rem;
              color: #3C915C;
              i{
                font-size: .28rem;
                color: #898989;
                margin-left: .1rem;
              }
            }
          }
        }
      }
    }
  }
</style>
