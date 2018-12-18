<template>
<div class="findProject">
    <div class="navTop1">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">找项目</h2>
    </div>
    <div>
        <ul class="findProjectUl">
            <li>
                <p>*联系人姓名</p>
                <input type="" name="" placeholder="请输入联系人姓名" v-model="linkmanName">
            </li>
            <li>
                <p>*联系人电话</p>
                <input type="tel" name=""  placeholder="请输入联系人电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11" v-model="linkmanTel">
            </li>
            <li>
                <p>*所在公司</p>
                <input type="" name="" placeholder="请输入所在公司" v-model="organization">
            </li>
            <li>
                <p>*职位</p>
                <input type="" name="" placeholder="请输入职位" v-model="jobTitle">
            </li>
            <li class="lastLi">
                <p>*需求简述</p>
                <textarea maxlength="200" placeholder="请输入需求简述..." v-model="needs"></textarea>
            </li>
        </ul>
        <div class="submitBtn" @click="submitBtn">提交</div>
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
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
name: "findProject",
    data () {
        return {
            showPromptWrap: false, // 弹窗提示
            linkmanName: "", // 联系人姓名
            linkmanTel: "", // 联系人电话
            organization: "", // 所在公司
            jobTitle: "", // 职位
            needs: "" // 需求
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
            if(this.linkmanName == "" || this.linkmanTel == "" || this.organization == "" || this.jobTitle == "" || this.needs == ""){
                Toast({
                    message: '请输入相关信息',
                    duration: 3000
                });
            }else if(!reg.test(this.linkmanTel)){
                Toast({
                    message: '请输入正确手机号',
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
                        type: 0,    //string  是   会员需求类型 0 找项目 1 找工作 2 找资金
                        contactName: this.linkmanName,  //string  是   联系人姓名
                        contactPhone: this.linkmanTel,  //string  是   联系人手机号
                        email: "",  //string  否   邮箱
                        company: this.organization,  //string  否   所在公司
                        position: this.jobTitle,   //string  否   职位
                        description: this.needs //string  否   需求简述
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
                this.organization = data.data.memberInfo.company;
                this.jobTitle = data.data.memberInfo.position;
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
.findProject{
	width: 7.5rem;
}	
.findProjectUl{
    width: 6.9rem;
    height: 7rem;
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
        textarea{
            width: 6.5rem;
            height: 1.54rem;
            background: #fff;
            border: 1px solid #eaeaea;
            resize:none;
            -webkit-appearance: none;
            outline: none;
            font-size: .3rem;
            padding: .2rem;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
    }
    .lastLi{
        border-bottom: none;
    }
}
</style>
