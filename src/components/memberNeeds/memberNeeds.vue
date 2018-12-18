<template>
<div class="memberNeeds">
    <div class="navTop1">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">会员需求</h2>
    </div>
    <div class="memberMain">
        <dl @click="goFindProject">
            <dt><img src="../../../static/images/member/findProject.png"></dt>
            <dd>找项目</dd>
        </dl>
        <dl @click="goFindFund">
            <dt><img src="../../../static/images/member/findFund.png"></dt>
            <dd>找资金</dd>
        </dl>
        <dl @click="goFindJob">
            <dt><img src="../../../static/images/member/findJob.png"></dt>
            <dd>找工作</dd>
        </dl>
    </div>
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
name: "memberNeeds",
    data () {
        return {
            tab: 0
            
        }
    },
    computed:{

    },
    methods:{
        // 点击返回按钮
        navBack(){        
            this.$router.push({path: '/home'});            
        },
        goFindProject(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }else{
                this.$router.push({path: '/findProject'});
            }
        },
        goFindFund(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }else{
                this.$router.push({path: '/findFund'});
            }
        },
        goFindJob(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }else{
                this.$router.push({path: '/findJob'});
            }
        }
    },
    mounted() {
    	
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.memberNeeds{
	width: 7.5rem;
    height: 100vh;
    background: #fff;
}	
.memberMain{
    dl{
        width: 7.5rem;
        height: 1rem;
        padding-top: .2rem;
        padding-bottom: .2rem;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        dt{
            width: 1rem;
            height: 1rem;
            margin-left: .3rem;
            margin-right: .38rem;
            float: left;
            img{
                width: 1rem;
                height: 1rem;
            }
        }
        dd{
            float: left;
            line-height: 1rem;
            color: #111;
            font-size: .3rem;
            width: 5.8rem;
            padding-bottom: .2rem;
            border-bottom: 1px solid #eaeaea;
        }
    }
}
</style>
