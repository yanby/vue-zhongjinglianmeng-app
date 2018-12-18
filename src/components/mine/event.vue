<template>
    <div class="event">
      <div class="nav" @click="back()"><span></span>我的活动</div>
      <div class="content">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
          <ul>
            <li @click="goFun(item)" v-for="item in activityAuditLis">
              <div class="msg">
                <h4 v-if="item.flag==2">活动报名 <b>{{item.status}}({{item.type}})</b></h4>
                <h4 v-else>活动报名 <b class="cur">{{item.status}}({{item.type}})</b></h4>
                <p>{{item.title}}</p>
              </div>
              <div class="time">
                <span>{{item.create_time}}</span><b>{{item.cost}} <i>报名费</i></b>
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
          allLoaded: false,//判断需不需要刷新
          more: false,//有没有更多数据,
          activityAuditLis:"",//列表
          nodata: false,//暂无数据
        }
    },
    computed:{

    },
    mounted() {
      this.init();
    },
    methods:{
      init(){
        this.$http({
          url: this.changeData() + "/member/auth/selectActivityAuditList",
          method: "post",
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.activityAuditLis = res.data.activityAuditLis;
            if(this.activityAuditLis.length == 0){
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
      loadTop(){//下拉刷新
        var that = this;
        var data = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectActivityAuditList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            that.activityAuditLis = res.data.activityAuditLis;
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
        setTimeout(function () {
          that.$http({
            url: that.changeData() + '/member/auth/selectActivityAuditList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            if(res.data.activityAuditLis.length <= 0){
              that.allLoaded = true;
            }else{
              that.activityAuditLis = that.activityAuditLis.concat(res.data.activityAuditLis)
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
      goFun(item){
        this.$router.push({path:"/applyDetail",query:{id:item.id}})
      }
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .event{
    .content{
      margin-top: 1rem;
      padding: .3rem;
      ul{
        li{
          padding: 0 .3rem;
          margin-bottom: .3rem;
          width: 6.3rem;
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
