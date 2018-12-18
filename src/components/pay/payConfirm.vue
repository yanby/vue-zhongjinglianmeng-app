<template>
<div class="payConfirm">
    <div class="navTop">
        <!-- <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()"> -->
        <h2 class="navTopH2">支付订单</h2>
    </div>
    <div class="main">
        <ul>
            <li>1. 如果您已完成支付，请点击「支付完成」；</li>
            <li>2. 如果您还未完成支付，请点击「重新支付」；</li>
        </ul>
        <span class="backPay" @click="backPay()">重新支付</span>
        <span class="payAccomplish" @click="payAccomplish()">支付完成</span>
    </div>
           
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
  export default {
    name: 'payConfirm',
    data () {
      return {
        tab: 0,
        sessionOrderId: "",
        showPromptWrap: false
      }
    },
    methods: {
        // 点击返回按钮
        navBack(){ 
            // this.showPromptWrap = true;
            this.$router.go(-1);
            // this.$router.push({path: '/allianceOne'});  
            // this.$router.push({path: '/allianceOne',query:{id: id}});          
        },
        // 重新支付
        backPay(){
            this.payBtn();
        },
        // 支付完成
        payAccomplish(){
            this.payBtn();
        },

        // 支付确认
        payBtn(){
            let url = this.changeData() + '/memberOrder/auth/selectOrderAmout'
            axios(url,{
                method: 'post',
                params: {
                    orderNo: this.sessionOrderId  //订单编号
                }
            }).then(data => {
                console.log(data);
                this.memberCost = data.data.orderAmount;
            }).catch(err => {
                console.log(err)
            });
        }
    },
    mounted(){
        this.sessionOrderId = sessionStorage.sessionOrderId;

    },
    created() {
        
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.payConfirm{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.main{
    width: 6.9rem;
    padding: 2rem .3rem 0;
    ul{
        li{
            color: #666;
            font-size: .3rem;
            line-height: .6rem;
        }
    }
    span{
        display: inline-block;
        width: 3rem;
        height: .8rem;
        border: 1px solid #898989;
        line-height: .8rem;
        color: #898989;
        font-size: .3rem;
        text-align: center;
        border-radius: 4px;
        margin-top: .6rem;
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    .payAccomplish{
        color: #3C915C;
        border: 1px solid #3C915C;
        margin-left: .8rem;
    }
}
</style>