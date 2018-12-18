<template>
    <div class="collect">
      <div class="nav" @click="back()"><span></span>我的收藏 <b v-if="bianji" @click.stop="bianjiFun()">编辑</b></div>
      <div class="content">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
          <ul>
            <li @click="goFun(item)" v-for="item in collectList">
              <span v-if="select" @click.stop="selectFun($event,item)"></span>
              <div>{{item.title}}</div>
              <p>{{item.createTime}}</p>
            </li>
          </ul>
          <div class="noInner" v-if="more">暂无更多内容喽！</div>
        </mt-loadmore>
      </div>
      <div class="operation" v-if="select">
        <span @click="cancelFun()">取消</span><span @click="removeFun()">删除</span>
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
          arr: [],
          ids: "",
          bianji: true,
          select: false,
          pageNum: 1,//页码
          pageSize: 10,//条数
          collectList: "",//收藏列表
          list: "",//单个列表
          nodata: false,//暂无数据
          allLoaded: false,//判断需不需要刷新
          more: false,//有没有更多数据
          collect_type: "", //0 新闻和公告 1 活动 2回顾
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
          url: this.changeData() + "/member/auth/selectCollectList",
          method: "post",
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.collectList = res.data.collectList;
            if(this.collectList.length == 0){
              this.nodata = true;
              this.bianji = false;
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
          var obj = this.arr.indexOf(this.list);
          this.arr.splice(obj, 1);
        }else{
          $(e.srcElement).addClass("cur")
          this.list = item.collect_id + "-" + item.collect_type;
          this.arr.push(this.list);
        }
      },
      removeFun(){
        this.$http({
          url: this.changeData() + "/member/auth/cancelCollect",
          method: "post",
          params: {
            id: this.arr.join(",")
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            Toast("删除成功！")
            this.select = false;
            this.init();
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      bianjiFun(){
        this.select = true;
        $(".content ul li").css({"padding":"0 .3rem 0 .6rem"})
      },
      cancelFun(){
        this.select = false;
        $(".content ul li").css({"padding":"0 .3rem"})
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
            params:data
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
            if(res.data.collectList.length <= 0){
              that.allLoaded = true;
            }else{
              that.collectList = that.collectList.concat(res.data.collectList)
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
        //0 新闻和公告 1 活动 2回顾
        if(item.collect_type == 0){
          this.$router.push({path:"/newsInfo",query:{id:item.collect_id,url:"collect"}})
        }else if(item.collect_type == 1){
          this.$router.push({path:"/applyDetail",query:{id:item.collect_id,url:"collect"}})
        }else{
          this.$router.push({path:"/reviewDetail",query:{id:item.collect_id,url:"collect"}})
        }
      }
    },

}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .collect{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
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
      background: #fff;
      ul{
         li{
           margin: 0 .3rem;
           border-bottom: 0.01rem solid #EAEAEA;
           overflow: hidden;
           position: relative;
           span{
             position: absolute;
             left:0rem;
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
           }
           div{
             font-size: .3rem;
             margin: .3rem 0 .2rem;
             display: -webkit-box;
             -webkit-box-orient: vertical;
             -webkit-line-clamp: 2;
             overflow: hidden;
           }
           p{
             font-size: .3rem;
             color: #898989;
             padding-bottom: .2rem;
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
