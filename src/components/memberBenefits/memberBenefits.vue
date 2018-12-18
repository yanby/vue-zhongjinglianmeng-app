<template>
<div class="memberBenefits">
    <div class="memberBenefitsTop">
        <img src="../../../static/images/common/backWhite.png" class="backNav" @click="navBack()">
        <h3>会员权益</h3>
        <img src="../../../static/images/member/memberBgTxt.png" class="memberBgTxt">
    </div>
    <div class="memberBenefitsWrap">
        <dl>
            <dt><img src="../../../static/images/member/member1.png" class="member1"></dt>
            <dd>优先参加联盟活动</dd>
        </dl>
        <dl>
            <dt><img src="../../../static/images/member/member2.png" class="member2"></dt>
            <dd>活动不收费</dd>
        </dl>
        <dl>
            <dt class="member3"><img src="../../../static/images/member/member3.png" class="member3"></dt>
            <dd>会员需求联盟专职团队8小时响应</dd>
        </dl>
        <dl>
            <dt class="member4"><img src="../../../static/images/member/member4.png" class="member4"></dt>
            <dd>可以选择加入一个专委会和一个兴趣俱乐部，与常务理事进行深度交流</dd>
        </dl>
    </div>
    <div class="submitBtn" @click="submitBtn()">我要成为常务理事</div>
    <!-- 弹窗提示 -->
    <div class="promptWrap" v-if="showPromptWrap">
        <div class="promptBox">
            <h5>您还不是联盟会员，请先加入联盟会员再申请常务理事</h5>
            <ul>
                <li class="li1" @click="showPromptWrap = false">暂不加入</li>
                <li class="li2" @click="goJoinAlliance()">加入联盟</li>
            </ul>
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
    name: 'memberBenefits',
    data () {
      return {
        showPromptWrap: false,
        userDataObj: {},

        userLevel: "",

        audit: "1",
        level: "2"
      }
    },
    mounted(){

    },
    methods: {
        // 点击返回按钮
        navBack(){        
            this.$router.push({path: '/home'});            
        },

        // 成为会员 跳转加入联盟页面
        goJoinAlliance(){
            this.$router.push({path: '/joinAlliance'});
        },
        // 我要成为常务理事
        submitBtn(){
            if(this.userDataObj.level == "2"){
                Toast({
                    message: '您已经是企业级会员，即享受常务理事的权益',
                    duration: 3000
                });
            }else if(this.userDataObj.auditStatus == "0" && this.userDataObj.level == "0"){
                Toast({
                    message: '您申请加入联盟正在审核中，请审核通过再次申请常务理事',
                    duration: 3000
                });
            }else if(this.userDataObj.auditStatus == "0" && this.userDataObj.level == "1"){
                Toast({
                    message: '您申请成为常务理事正在审核中，请耐心等待',
                    duration: 3000
                });
            }else if(this.userDataObj.level == "0" || this.userDataObj.level == "0" && this.userDataObj.auditStatus == "2"){
                this.showPromptWrap = true;
            }else{
                this.$router.push({path: '/joinExecutiveDirector'});
            }

            
            // if(this.level == "2"){
            //     Toast({
            //         message: '您已经是企业级会员，即享受常务理事的权益',
            //         duration: 3000
            //     });
            // }else if(this.audit == "0" && this.level == "0"){
            //     Toast({
            //         message: '您申请加入联盟正在审核中，请审核通过再次申请常务理事',
            //         duration: 3000
            //     });
            // }else if(this.audit == "0" && this.level == "1"){
            //     Toast({
            //         message: '您申请成为常务理事正在审核中，请耐心等待',
            //         duration: 3000
            //     });
            // }else if(this.level == "0" || this.level == "0" && this.audit== "2"){
            //     this.showPromptWrap = true;
            // }else{
            //     this.$router.push({path: '/joinExecutiveDirector'});
            // }
        },
        // 获取用户信息
        userData(){
            let url = this.changeData() + '/member/auth/getMemberInfo'
            axios(url,{
                method: 'post',
            }).then(data => {
                // console.log(data);
                this.userDataObj = data.data.memberInfo;
                this.userLevel = data.data.memberInfo.level;
                // console.log(this.userDataObj);
            }).catch(err => {
                console.log(err)
            });
        }

    },
    mounted() {

        this.userData();

        // if(this.level == "3"){
        //     $(".submitBtn").hide();
        // } 

        // if(this.userLevel == "3"){
        //     $(".submitBtn").hide();
        // }  

        if(this.$route.query.url){
            $(".submitBtn").hide();
        }
        
    },
    created() {
        // this.userData();
        // if(this.level == "3"){
        //     $(".submitBtn").hide();
        // } 
        
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.memberBenefits{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.memberBenefitsTop{
    width: 7.5rem;
    height: 3.6rem;
    background: url(../../../static/images/member/memberBg.png);
    background-repeat: no-repeat;
    background-size: 7.5rem 3.6rem;
    text-align: center;
    position: relative;
    h3{
        font-size: .34rem;
        font-weight:400;
        color: #fff;
        line-height: 1.1rem;
    }
    .backNav{
        width: .3rem;
        height: .3rem;
        position: absolute;
        left: .3rem;
        top: .35rem;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    .memberBgTxt{
        width: 4.28rem;
        height: .52rem;
        margin: 1rem auto 0;
    }
}
.memberBenefitsWrap{
    width: 5.9rem;
    padding: .5rem .8rem 0;
    dl{
        width: 5.9rem;
        height: 1rem;
        dt{
            width: .7rem;
            float: left;
            img{
                width: .4rem;
                height: .36rem;
                position: relative;
                top: .04rem;
            }
            .member2{
                width: .38rem;
                height: .4rem;
                position: relative;
                top: .02rem;
            }
        }
        dd{
            width: 5.2rem;
            float: left;
            color: #666;
            font-size: .32rem;
            line-height: .5rem;
        }
    }
}
</style>
