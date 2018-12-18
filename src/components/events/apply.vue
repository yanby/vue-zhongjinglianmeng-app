<template>
    <div class="project">
      <div class="nav" @click="back()"><span></span>活动报名</div>
      <div class="content">
        <ul>
          <li><span>*真实姓名</span><input type="text" placeholder="请输入真实姓名" v-model="userName"></li>
          <li><span>*所在公司</span><input type="text" placeholder="请输入所在公司" v-model="company"></li>
          <li><span>*职位</span><input type="text" placeholder="请输入职位" v-model="userduty"></li>
          <li><span>*手机号</span><b>{{iphone}}</b></li>
        </ul>
      </div>
      <div class="next" @click="submit()">确认报名</div>
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
          memberInfo: "",
          userName: "",
          company: "",
          userduty: "",
          iphone: "",
          orderStatus: ""
        }
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
            this.iphone = this.memberInfo.phone.substr(0,3)+"****"+this.memberInfo.phone.substr(7);
            this.userName = this.memberInfo.name;
            this.company = this.memberInfo.company;
            this.userduty = this.memberInfo.position;
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log(err)
        })
      },
      back(){
        this.$router.go(-1);
      },
      submit(){
        if(this.userName == "" || this.company == "" || this.userduty == ""){
          Toast("请输入必填项")
        }else{
          this.$http({
            url: this.changeData() + "/memberOrder/auth/createActivityOrder",
            method: "post",
            params: {
              id: this.$route.query.id,
              orderSource: 4,
              name: this.userName,
              position: this.userduty,
              company: this.company,
            }
          }).then(function(res){
            console.log(res);
            if(res.data.code=="101"){
              // 0 首次创建未支付订单 1 已有未支付订单 跳转到未支付订单页面支付 2 活动免费
              this.orderStatus = res.data.activityOrder.orderStatus;
              if(this.orderStatus == 0){
                this.$router.push({path:"/pay",query:{orderNo:res.data.activityOrder.orderNo,orderType:1}})
              }else if(this.orderStatus == 1){
                Toast("您报名的本活动还有未支付的订单，请先支付");
                this.$router.push({path:"/order",url:"apply"})
              }else if(this.orderStatus == 2){
                Toast("您的申请已提交，请等待审核");
                this.$router.push({path:"/event"})
              }
            }else{
              Toast(res.data.message)
            }
          }.bind(this)).catch(function(err){
            console.log(err)
          })
        }
      }
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .project{
    width: 7.5rem;
    height: 100vh;
    position: relative;
    .wrap{
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0,.5);
      z-index: 99;
      .inner{
        position: absolute;
        width: 7.5rem;
        left: 0;
        bottom: 0;
        ul{
          float: left;
          height: 3rem;
          width: 2.5rem;
          overflow: auto;
          background: #fff;
          li{
            width: 2.5rem;
            text-align: center;
            height: .9rem;
            font-size: .3rem;
            line-height: .9rem;
            &.cur{
              background: #3C915C;
            }
          }
        }
        ol{
          float: left;
          width: 5rem;
          height: 3rem;
          overflow: auto;
          background: #f8f8f8;
          li{
            width: 5rem;
            text-align: center;
            height: .9rem;
            font-size: .3rem;
            line-height: .9rem;
            &.cur{
              background: #3C915C;
            }
          }
        }
        .cancle{
          margin-top: .1rem;
          width: 7.5rem;
          height: .9rem;
          line-height: .9rem;
          background: #fff;
          text-align: center;
          font-size: .3rem;
          color: #898989;
        }
      }

    }
    .nav{
      a{
        position: absolute;
        top: 0rem;
        right: .2rem;
        color: #fff;
      }
    }
    .content{
      background: #fff;
      margin-top: 1rem;
      ul{
        padding:0 .3rem;
        li{
           line-height: .9rem;
           font-size: .3rem;
           border-bottom: 0.01rem solid #EAEAEA;
           span{
             vertical-align: middle;
             display: inline-block;
             width: 1.6rem;
             margin-right: .4rem;
           }
          input{
            width: 2rem;
            line-height: .88rem;
            font-size: .3rem;
          }
         }
        div{
          textarea{
            padding: .3rem;
            width: 6.3rem;
            height: 1rem;
            font-size: .28rem;
            border: 0.01rem solid #EAEAEA;
          }
        }
      }
    }
    .txt{
      font-size: .24rem;
      color: #4AA462;
      padding: .3rem;
    }
    .next{
      width: 7.5rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      font-size: .34rem;
      background: #3C915C;
      position: fixed;
      left: 0;
      bottom: 0;
    }
  }
</style>
