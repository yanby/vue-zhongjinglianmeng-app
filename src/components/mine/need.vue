<template>
    <div class="need">
      <div class="nav" @click="back()"><span></span>会员需求</div>
      <div class="content">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
          <ul>
           <li v-for="item in demandInfoList">
             <div class="msg">
               <p>联系人姓名：{{item.contact_name }}</p>
               <p>联系人电话：{{item.contact_phone }}</p>
               <p>公司名称：{{item.company }}</p>
               <p>职位：{{item.position}}</p>
               <p>需求简述</p>
               <div>{{item.description}}
               </div>
             </div>
             <!--0 找项目 1 找工作 2 找资金-->
             <div class="time">
               {{item.create_time}}
               <div class="next" v-if="item.image_type==0">
                 <span class="icon1"></span>{{item.type}}
               </div>
               <div class="next" v-if="item.image_type==1">
                 <span class="icon2"></span>{{item.type}}
               </div>
               <div class="next" v-if="item.image_type==2">
                 <span class="icon3"></span>{{item.type}}
               </div>
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
          demandInfoList: "",//需求列表
          nodata: false,//暂无数据
          allLoaded: false,//判断需不需要刷新
          more: false,//有没有更多数据
          pageNum: 1,
          pageSize: 10,
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
          url: this.changeData() + "/member/auth/selectDemandInfoList",
          method: "post",
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.demandInfoList = res.data.demandInfoList;
            if(this.demandInfoList.length == 0){
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
            url: that.changeData() + '/member/auth/selectDemandInfoList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            that.demandInfoList = res.data.demandInfoList;
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
            url: that.changeData() + '/member/auth/selectDemandInfoList',
            method: "post",
            params: data
          }).then(function(res){
            console.log(res)
            if(res.data.demandInfoList.length <= 0){
              that.allLoaded = true;
            }else{
              that.demandInfoList = that.demandInfoList.concat(res.data.demandInfoList)
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
    },

}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .need{
    width: 7.5rem;
    height: 100vh;
    .content{
      margin-top: 1rem;
      padding: .2rem .3rem;
      ul{
        li{
          background: #fff;
          font-size: .3rem;
          margin-bottom: .2rem;
          .msg{
            border-bottom: 0.01rem solid #eaeaea;
            padding: .3rem;
            p{
              margin-bottom: .2rem;
            }
            div{
              padding: .3rem;
              background:rgba(234,234,234,1);
              border-radius:10px;
              line-height: .45rem;
            }
          }
          .time{
            position: relative;
            padding: .3rem;
            color: #898989;
            font-size: .3rem;
            .next{
              position: absolute;
              right: .3rem;
              top: .3rem;
              a{
                color: #3C915C;
              }
              span{
                display: inline-block;
                width: .4rem;
                height: .4rem;
                vertical-align: -.1rem;
                margin-right: .1rem;
                background: url("../../../static/images/mine/xiangmu.png") no-repeat;
                -webkit-background-size: 100% 100%;
                background-size: 100% 100%;
                &.icon2{
                  background: url("../../../static/images/mine/gongzuo.png") no-repeat;
                  -webkit-background-size: 100% 100%;
                  background-size: 100% 100%;
                }
                &.icon3{
                  background: url("../../../static/images/mine/zijing.png") no-repeat;
                  -webkit-background-size: 100% 100%;
                  background-size: 100% 100%;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
