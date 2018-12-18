<template>
<div class="pay">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">选择支付方式</h2>
    </div>
    <div class="payDl">
        <h2>您需要支付<span>{{memberCost}}</span>元</h2>
        <dl>
            <dt>
                <img src="../../../static/images/pay/dl1.png">
            </dt>
            <dd>
                <h3>微信支付</h3>
                <h4>亿万用户的选择，更快更安全</h4>
            </dd>
            <h5 :class="{'on':tab===0}" @click="tab=0">
                <!-- <img src="../../../static/images/pay/coil.png"> -->
            </h5>
        </dl>
        <dl>
            <dt>
                <img src="../../../static/images/pay/dl2.png">
            </dt>
            <dd>
                <h3>支付宝支付</h3>
                <h4>数亿用户都在用，安全可托付全</h4>
            </dd>
            <h5 :class="{'on':tab===1}" @click="tab=1">
                <!-- <img src="../../../static/images/pay/coil1.png"> -->
            </h5>
        </dl>
        <dl class="hideDl">
            <dt>
                <img src="../../../static/images/pay/dl3.png">
            </dt>
            <dd>
                <h6>线下支付</h6>
            </dd>
            <h5 :class="{'on':tab===2}" @click="tab=2">
                <!-- <img src="../../../static/images/pay/coil.png"> -->
            </h5>
        </dl>
    </div>
    <div class="submitBtn" @click="payBtn()">确认</div>
    <!-- 弹窗提示 -->
    <div class="promptWrap" v-if="showPromptWrap">
        <div class="promptBox">
            <h3>确定要放弃支付吗？</h3>
            <p>您与活动只差一步之遥，更多精彩尽在活动中</p>
            <ul>
                <li class="li1" @click="goLeave()">确认离开</li>
                <li class="li2" @click="showPromptWrap = false">继续支付</li>
            </ul>
        </div>
    </div>

    <!-- 支付确认 -->
    <div class="promptWrap1" v-if="showPayPromptWrap">
        <div class="payPromptBox">
            <h3>支付确认</h3>
            <h5>1. 如果您已完成支付，请点击「支付完成」</h5>
            <h5>2. 如果您还未完成支付，请点击「重新支付」</h5>
            <ul>
                <li class="li1" @click="payAccomplish();">重新支付</li>
                <li class="li2" @click="payAccomplish1()">支付完成</li>
            </ul>
        </div>
    </div>

    <div class="zhifubao"></div>
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
  export default {
    name: 'pay',
    data () {
      return {
        tab: 0,
        memberCost: "",
        showPromptWrap: false,
        showPayPromptWrap: false,
        orderId: "",
        ip:"",
        code: "",
        orderType1: ""
      }
    },
    methods: {
        // 点击返回按钮
        navBack(){
            this.showPromptWrap = true;
            // this.$router.go(-1);
            // this.$router.push({path: '/allianceOne'});
            // this.$router.push({path: '/allianceOne',query:{id: id}});
        },
        // 确定离开
        goLeave(){
            if(isWeiXin()){
                this.$router.go(-2);
            }else{
                this.$router.go(-1);
            }

            // this.$router.go(-1);

        },
        // 去支付
        payBtn(){
            // alert("1");
            let _this = this;
            var data = {
                orderNo: this.orderId
            }
            console.log(this.orderId);
            if(this.tab == 0){
                // alert("微信");
                //判断是不是微信浏览器
                if(isWeiXin()){
                    this.payFun();
                }else{
                    this.$http({
                        url:this.changeData() + "/weChat/auth/h5WeChatPay",
                        method: 'post',
                        params: {
                            orderNo: this.orderId,
                            ip: this.ip
                        }
                    }).then(res => {
                        console.log(res)
                        if(res.data.code == 101){
                            window.location.href = res.data.data;
                            // _this.showPayPromptWrap = true;
                        }else{
                            Toast({
                                message: 'res.data.data.message',
                                duration: 3000
                            });
                        }
                    }).catch(err => {
                      console.log(err)
                    });
                }
            }else if(this.tab == 1){
                // alert("支付宝");
                this.$http({
                    url: this.changeData() + "/aliPay/auth/h5Pay",
                    method: 'post',
                    params: data
                }).then(res => {
                console.log(res)
                if(res.data.code == 101){
                    $(".zhifubao").html(res.data.data)
                    document.forms[0].submit()
                }
                }).catch(err => {
                    console.log(err)
                });
            }else{
                // alert("线下支付");
                this.$http({
                    url: this.changeData() + "/memberOrder/auth/createOfflinePay",
                    method: 'post',
                    params: data
                }).then(res => {
                    console.log(res)
                    if(res.data.code == 101){
                        Toast({
                            message: '您的申请已提交，请等待审核',
                            duration: 3000
                        });
                        this.$router.push({path: '/join'});
                    }else{
                        Toast({
                            message: res.data.message,
                            duration: 3000
                        });
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
        },
        // 公众号支付
        init(){
            // alert(1)
            var appId = 'wxdedc704fb4045c29';
            var oauth_url = encodeURIComponent(window.location.href.split('#')[0]);
            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + oauth_url + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
            this.code = getUrlId("code");
            if (!this.code) {
                window.location = url;
            }
        },
        // 公众号支付
        payFun(){
            var that = this;
            // alert(this.code);
            var data = {
                orderNo: this.orderId,
                code: this.code
            }
            this.$http({
                url:this.changeData() + '/weChat/auth/weChatPay',
                method: 'post',
                params: data
            }).then(function(res){
                console.log(res)
                if(res.data.code == 101){
                    function onBridgeReady(){
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                            "appId":res.data.data.appid, //公众号名称，由商户传入
                            "timeStamp":res.data.data.timestamp,  //时间戳，自1970年以来的秒数
                            "nonceStr":res.data.data.noncestr, //随机串
                            "package":res.data.data.package, //统一订单号
                            "signType":res.data.data.signType, //微信签名方式：
                            "paySign":res.data.data.sign //微信签名
                        },
                        function(res1){
                            WeixinJSBridge.log(res1.err_msg)
                            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证 它绝对可靠。
                            if(res1.err_msg == "get_brand_wcpay_request:ok" ) {
                                // that.showPayPromptWrap = true;
                                that.$router.push({path:"/order"});
                            } else{
                                // that.$router.push({path:"/myMember"})
                                // alert(res1.err_msg)
                                // history.back();
                                that.showPayPromptWrap = true;
                            }
                        }
                      );
                    }
                    if (typeof WeixinJSBridge == "undefined"){
                        if( document.addEventListener ){
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        }else if (document.attachEvent){
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    }else{
                        onBridgeReady();
                    }
                }else{
                    Toast(res.data.message)
                }
            }).catch(function(err){
                console.log("商店详情页面错误：",err)
            });
        },
        // 获取订单信息
        orderNoData(){
            let url = this.changeData() + '/memberOrder/auth/selectOrderAmout'
            axios(url,{
                method: 'post',
                params: {
                    orderNo: this.orderId  //订单编号
                }
            }).then(data => {
                console.log(data);
                this.memberCost = data.data.orderAmount;
            }).catch(err => {
                console.log(err)
            });
        },

        // 支付确认
        payConfirm1(){
            let url = this.changeData() + '/memberOrder/auth/selectOrderAmout'
            axios(url,{
                method: 'post',
                params: {
                    orderNo: this.orderId //订单编号
                }
            }).then(data => {
                console.log(data);
                if(data.data.code == "101"){

                    if(data.data.payStatus == "1"){
                        Toast({
                            message: "您的申请未支付完成，请重新支付",
                            duration: 3000
                        });
                        this.showPayPromptWrap = false;
                    }
                    if(data.data.payStatus == "0"){
                        Toast({
                            message: "您的申请已提交，请等待审核",
                            duration: 3000
                        });
                        this.this.$router.push({path: '/order'}); 
                        this.showPayPromptWrap = false;
                    }
                }else{
                    Toast({
                        message: data.data.message,
                        duration: 3000
                    });
                }
            }).catch(err => {
                console.log(err)
            });
        },

        payAccomplish(){
            // alert(1);
            this.payConfirm1();
        },

        payAccomplish1(){
            // alert(2);
            this.payConfirm1();
        }
    },
    mounted(){
        //截取Url里面的参数
        // function GetRequest() {
        //     var url = location.search; //获取url中"?"符后的字串
        //     var theRequest = new Object();
        //     if (url.indexOf("?") != -1) {
        //         var str = url.substr(1);
        //         var strs = str.split("&");
        //         for (var i = 0; i < strs.length; i++) {
        //             theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        //         }
        //     }
        //     return theRequest;
        // }
        // var request = new Object();
        // request = GetRequest();

        // this.orderId = request['orderNo'];
        // var orderType1 = request['orderType'];

      this.orderId =  this.$route.query.orderNo;
      this.orderType1 =  this.$route.query.orderType;
      if(this.orderType1){
         $(".hideDl").hide();
      };
        // if(orderType1 == 1){
        //     $(".hideDl").hide();
        // };

        // 获取ip
        this.ip = returnCitySN["cip"];
        //如果是微信浏览器，获取code
        if(isWeiXin()){
            this.init();
        };

        // 获取订单信息
        this.orderNoData();

    },
    created() {

    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.pay{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.payDl{
    padding: 1rem .3rem;
    h2{
        color: #333;
        font-size: .34rem;
        line-height: 1.8rem;
        border-bottom: 1px solid #eaeaea;
        span{
            color: #f65e35;
        }
    }
    dl{
        height: .7rem;
        padding: .2rem 0;
        border-bottom: 1px solid #eaeaea;
        position: relative;
        dt{
            width: .7rem;
            height: .7rem;
            float: left;
            margin-right: .2rem;
            img{
                width: .7rem;
                height: .7rem;
            }
        }
        dd{
            float: left;
            h3{
                color: #333;
                font-size: .28rem;
            }
            h4{
                color: #898989;
                font-size: .24rem;
            }
            h6{
                color: #333;
                font-size: .28rem;
                line-height: .7rem;
            }
        }
        h5{
            width: .4rem;
            height: .4rem;
            position: absolute;
            right: 0;
            top: .4rem;
            background: url(../../../static/images/pay/coil.png);
            background-repeat: no-repeat;
            background-size: .4rem .4rem;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            img{
                width: .4rem;
                height: .4rem;
            }
            &.on{
                width: .4rem;
                height: .4rem;
                position: absolute;
                right: 0;
                top: .4rem;
                background: url(../../../static/images/pay/coil1.png);
                background-repeat: no-repeat;
                background-size: .4rem .4rem;
                img{
                    width: .4rem;
                    height: .4rem;
                }
            }
        }
    }
}
</style>
