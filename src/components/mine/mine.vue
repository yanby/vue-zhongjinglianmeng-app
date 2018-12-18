<template>
    <div class="mine">
      <div class="title">
        <h3><router-link :to="{path:'/message'}"><span v-if="memberInfo.pushStatus==1">{{memberInfo.pushCount}}</span></router-link></h3>
        <div class="user clearfix">
          <div class="msg">
            <router-link v-if="memberInfo.level==0" :to="{path:'/joinAlliance'}" class="icon1"></router-link>
            <router-link v-else-if="memberInfo.level==2" to=""></router-link>
            <router-link v-else-if="memberInfo.level==2 && memberInfo.isExpires==1" :to="{path:'/renew'}" class="icon3"></router-link>
            <router-link v-else-if="memberInfo.level==1 && memberInfo.isExpires==0" :to="{path:'/joinExecutiveDirector'}" class="icon2"></router-link>
            <router-link v-else-if="memberInfo.level==1 && memberInfo.isExpires==1" :to="{path:'/renew'}" class="icon3"></router-link>
            <router-link v-else-if="memberInfo.level==3 && memberInfo.isExpires==1" :to="{path:'/renew'}" class="icon3"></router-link>
          </div>
          <div class="img"><router-link :to="{path:'/user'}"><img :src="imgsrc" alt="" :onerror="defaultImg"></router-link></div>
          <div class="txt">
            <h4>{{memberInfo.name || iphone}}</h4>
            <div class="state" v-if="memberInfo.level==0"><b v-if="memberInfo.committeeText">{{memberInfo.committeeText}}</b>游客</div>
            <div class="state" v-if="memberInfo.level==1"><b v-if="memberInfo.committeeText">{{memberInfo.committeeText}}</b><span class="icon1"></span>普通会员</div>
            <div class="state" v-if="memberInfo.level==2"><b v-if="memberInfo.committeeText">{{memberInfo.committeeText}}</b><span class="icon1"></span>企业会员</div>
            <div class="state" v-if="memberInfo.level==3"><b v-if="memberInfo.committeeText">{{memberInfo.committeeText}}</b><span class="icon3"></span>常务理事</div>
          </div>
        </div>
      </div>
      <div class="content">
        <ul>
          <li><router-link :to="{path:'/order',query:{url:'mine'}}"><span class="icon1"></span>我的订单<b></b></router-link></li>
          <li><router-link :to="{path:'/join'}"><span class="icon2"></span>我的加盟<b></b></router-link></li>
          <li><router-link :to="{path:'/event'}"><span class="icon3"></span>我的活动<b></b></router-link></li>
          <li><router-link :to="{path:'/need'}"><span class="icon4"></span>会员需求<b></b></router-link></li>
          <li><router-link :to="{path:'/collect'}"><span class="icon5"></span>我的收藏<b></b></router-link></li>
          <li><router-link :to="{path:'/about'}"><span class="icon6"></span>关于联盟<b></b></router-link></li>
          <li><router-link to=""><span class="icon7"></span>版本号<i>V1.0.0</i></router-link></li>
        </ul>
      </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import axios from 'axios';
import qs from 'qs';
export default {
name: "mine",
    data () {
        return {
          imgsrc: "../../../static/images/mine/user.png",
          iphone: "",
          memberInfo:"",//用户信息
          defaultImg: 'this.src="' + require('../../../static/images/mine/user.png') + '"'
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
          url: this.changeData() + "/member/auth/getMemberInfo",
          method: "post",
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.memberInfo = res.data.memberInfo;
            this.imgsrc = this.memberInfo.iconPath;
            this.iphone = this.memberInfo.phone.substr(0,3)+"****"+this.memberInfo.phone.substr(7);
          }else if(res.data.code=="201"){
              Toast({
                  message: '请先登录',
                  duration: 3000
              });
              this.$router.push({path: '/login',query:{"url":"mine"}});
          }else{
            Toast(res.data.message);
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
.mine{
	width: 7.5rem;
  margin-bottom: 2rem;
  .title{
    height: 3.5rem;
    background: url("../../../static/images/mine/mine-bg.png") no-repeat;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    overflow: hidden;
    h3{
      width: .34rem;
      height: .31rem;
      margin: .5rem .15rem .3rem;
      background: url("../../../static/images/mine/xiaoxi.png") no-repeat;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;
      a{
        display: inline-block;
        width: 100%;
        height: 1005px;
        position: relative;
        span{
          position: absolute;
          right: -.3rem;
          top: -.2rem;
          width: .44rem;
          height: .3rem;
          line-height: .35rem;
          background: #F86054;
          font-size: .2rem;
          border-radius: .2rem;
          color: #fff;
          text-align: center;
        }
      }
    }
    .user{
      padding: .25rem .2rem 0;
      position: relative;
      .msg{
        position: absolute;
        right: 0;
        top: 0;
        width: 1.87rem;
        height: .62rem;
        a{
          display: inline-block;
          width: 100%;
          height: 100%;
          &.icon1{
            background: url("../../../static/images/mine/lianmeng.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon2{
            background: url("../../../static/images/mine/lishi.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon3{
            background: url("../../../static/images/mine/xufei.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
        }
      }
      .img{
        float: left;
        a{
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        img{
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;
        }
      }
      .txt{
        float: left;
        padding: .24rem .3rem 0 .15rem;
        margin: 0 .3rem 0 .15rem;
        h4{
          font-size: .34rem;
          margin-bottom: .2rem;
        }
        p{
          font-size: .3rem;
        }
        .state{
          font-size: .3rem;
          span{
            display: inline-block;
            width: .36rem;
            height: .36rem;
            vertical-align: -.05rem;
            margin-right: .1rem;
            margin-left: .4rem;
            &.icon1{
              background: url("../../../static/images/mine/putong.png") no-repeat;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
            &.icon3{
              background: url("../../../static/images/mine/changwu.png") no-repeat;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
  }
  .content{
    margin-top: .2rem;
    background: #fff;
    ul{
      padding: 0 .3rem;
      li{
        height: .96rem;
        line-height: .96rem;
        font-size: .3rem;
        border-bottom: 0.01rem solid #EAEAEA;
        a{
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        span{
          display: inline-block;
          width: .4rem;
          height: .4rem;
          vertical-align: -.05rem;
          margin-right: .4rem;
          background: url("../../../static/images/mine/dingdan.png") no-repeat;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
          &.icon2{
            background: url("../../../static/images/mine/jiameng.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon3{
            background: url("../../../static/images/mine/huodong.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon4{
            background: url("../../../static/images/mine/xuqiu.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon5{
            background: url("../../../static/images/mine/shoucang.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon6{
            background: url("../../../static/images/mine/guanyu.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          &.icon7{
            background: url("../../../static/images/mine/banben.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
        }
        b{
          float: right;
          margin-top: .35rem;
          width: .15rem;
          height: .24rem;
          background: url("../../../static/images/mine/you.png") no-repeat;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
        }
        i{
          float: right;
          font-size: .24rem;
        }
      }
    }
  }
}
</style>
