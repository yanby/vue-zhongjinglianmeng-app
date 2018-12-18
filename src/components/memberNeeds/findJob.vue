<template>
<div class="findJob">
    <div class="navTop1">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">找工作</h2>
    </div>
    <div class="findJobUl">
        <ul>
            <li>
                <p>*联系人姓名</p>
                <input type="" name="" placeholder="请输入联系人姓名" v-model="linkmanName">
            </li>
            <li>
                <p>*联系人电话</p>
                <input type="tel" name=""  placeholder="请输入联系人电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11" v-model="linkmanTel">
            </li>
            <li class="lastLi">
                <p>*电子邮箱</p>
                <input type="" name="" placeholder="请输入发邮件的电子邮箱" v-model="linkmanEmail">
            </li>
        </ul>
        <span>注：简历请发送到邮箱：zjlmhyb@vip.163.com</span>
    </div>
    <div class="submitBtn" @click="submitBtn()">提交</div>
    <!-- 弹窗提示 -->
    <div class="promptWrap" v-if="showPromptWrap">
        <div class="promptBox">
            <h5>确定要取消发布会员需求吗？</h5>
            <ul>
                <li class="li1" @click="goLeave()">是</li>
                <li class="li2" @click="showPromptWrap = false">否</li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
name: "findJob",
    data () {
        return {
            showPromptWrap: false, //弹窗提示
            linkmanName: "", //联系人姓名
            linkmanTel: "", //联系人电话
            linkmanEmail: "" //电子邮箱
        }
    },
    computed:{

    },
    methods:{
        // 点击返回按钮
        navBack(){ 
            this.showPromptWrap = true;   
        },
        goLeave(){
            this.$router.push({path: '/memberNeeds'}); 
        },
        // 点击提交按钮
        submitBtn(){
            let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            var regEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
            if(this.linkmanName == "" || this.linkmanTel == "" || this.linkmanEmail == ""){
                Toast({
                    message: '请输入相关信息',
                    duration: 3000
                });
            }else if(!reg.test(this.linkmanTel)){
                Toast({
                    message: '请输入正确手机号',
                    duration: 3000
                });
            }else if(!regEmail.test(this.linkmanEmail)){
                Toast({
                    message: '请输入正确邮箱',
                    duration: 3000
                });
            }else{
                Indicator.open({
                    text: '上传中...',
                    spinnerType: 'fading-circle'
                });
                let url = this.changeData() + '/member/auth/saveDemandInfo'
                axios(url,{
                    method: 'post',
                    params: {
                        type: 1,    //string  是   会员需求类型 0 找项目 1 找工作 2 找资金
                        contactName: this.linkmanName,  //string  是   联系人姓名
                        contactPhone: this.linkmanTel,  //string  是   联系人手机号
                        email: this.linkmanEmail  //string  否   邮箱
                    }
                }).then(data => {
                    // console.log(data);
                    if(data.data.code == 101){
                        Indicator.close();
                        Toast({
                            message: '提交成功',
                            duration: 3000
                        });
                        this.$router.push({path: '/home'}); 
                    }else{
                        Toast({
                            message: data.data.message,
                            duration: 3000
                        });
                    }
                }).catch(err => {
                    console.log(err)
                });

            }
        },
        // 获取用户信息
        userData(){
            let url = this.changeData() + '/member/auth/getMemberInfo'
            axios(url,{
                method: 'post',
            }).then(data => {
                // console.log(data);
                // this.userDataObj = data.data.memberInfo;
                this.linkmanName = data.data.memberInfo.name;
                this.linkmanTel = data.data.memberInfo.phone;
                console.log(this.userDataObj);
            }).catch(err => {
                console.log(err)
            });
        }
    },
    mounted() {
        this.userData();
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.findJob{
	width: 7.5rem;
}
.findJobUl{
    width: 6.9rem;
    height: 2.7rem;
    padding: 0 .3rem 0 .3rem;
    background: #fff;
    li{
        width: 6.9rem;
        height: .9rem;
        border-bottom: 1px solid #eaeaea;
        line-height: .9rem;
        box-sizing: border-box;
        p{
            width: 2.1rem;
            float: left;
            color: #333;
            font-size: .3rem;
        }
        input{
            width: 4.8rem;
            line-height: .4rem;
            background: transparent;
            font-size: .28rem;
            color: #333;
        }
    }
    .lastLi{
        border-bottom: none;
    }
    span{
        display: inline-block;
        color: #4aa462;
        font-size: .24rem;
        margin-left: .3rem;
        padding-top: .2rem;
    }
}
</style>
