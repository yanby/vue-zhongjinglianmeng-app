<template>
<div class="memberNeeds">
    <div class="navTop1">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">会员需求</h2>
    </div>
    <div class="memberNeedsTabBar">
        <dl>
            <dt @click="tab=0">找项目</dt>
            <dd :class="{'on':tab===0}"></dd> 
        </dl>
        <dl>
            <dt @click="tab=1">找资金</dt>
            <dd :class="{'on':tab===1}"></dd>
        </dl>
        <dl>
            <dt @click="tab=2">找工作</dt>
            <dd :class="{'on':tab===2}"></dd>
        </dl>
    </div>
    <!-- 找项目 -->
    <div class="seekProject" v-show="tab===0">
        <ul class="memberNeedsUl">
            <li>
                <p>*联系人姓名</p>
                <input type="" name="" placeholder="请输入联系人姓名">
            </li>
            <li>
                <p>*联系人电话</p>
                <input type="tel" name=""  placeholder="请输入联系人电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11">
            </li>
            <li>
                <p>*所在公司</p>
                <input type="" name="" placeholder="请输入所在公司">
            </li>
            <li>
                <p>*职位</p>
                <input type="" name="" placeholder="请输入职位">
            </li>
            <li class="lastLi">
                <p>*需求简述</p>
                <textarea maxlength="200" v-model="describe" placeholder="请输入需求简述..."></textarea>
            </li>
        </ul>
        <div class="submitBtn">提交</div>
    </div>
    <!-- 找资金 -->
    <div class="seekFunds" v-show="tab===1">
        <ul class="memberNeedsUl">
            <li>
                <p>*联系人姓名</p>
                <input type="" name="" placeholder="请输入联系人姓名">
            </li>
            <li>
                <p>*联系人电话</p>
                <input type="tel" name=""  placeholder="请输入联系人电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11">
            </li>
            <li>
                <p>*所在公司</p>
                <input type="" name="" placeholder="请输入所在公司">
            </li>
            <li>
                <p>*职位</p>
                <input type="" name="" placeholder="请输入职位">
            </li>
            <li class="lastLi">
                <p>*需求简述</p>
                <textarea maxlength="200" v-model="describe" placeholder="请输入需求简述..."></textarea>
            </li>
        </ul>
        <div class="submitBtn">提交</div>
    </div>
    <!-- 找工作 -->
    <div class="seekJob" v-show="tab===2">
        <ul class="memberNeedsUl memberNeedsUl1">
            <li>
                <p>*联系人姓名</p>
                <input type="" name="" placeholder="请输入联系人姓名">
            </li>
            <li>
                <p>*联系人电话</p>
                <input type="tel" name=""  placeholder="请输入联系人电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11">
            </li>
            <li class="lastLi">
                <p>*电子邮箱</p>
                <input type="" name="" placeholder="请输入发邮件的电子邮箱">
            </li>
        </ul>
        <span>注：简历请发送到邮箱：zjlmhyb@vip.163.com</span>
        <div class="submitBtn">提交</div>
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
        
    },
    mounted() {
    	
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.memberNeeds{
	width: 7.5rem;
}	
.memberNeedsTabBar{
    width: 7.5rem;
    height: .8rem;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    dl{
        width: 2.5rem;
        line-height: .8rem;
        float: left;
        text-align: center;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        dt{
            color: #333;
            font-size: .3rem;
        }
        dd{
            width: .84rem;
            height: .04rem;
            background: #3c915c;
            border-radius: 2px;
            margin: -1px auto 0;
            display: none;
            &.on{
                display: block;
            }
        }   
    }
}
.memberNeedsUl{
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
.seekJob{
    .memberNeedsUl1{
        height: 2.7rem;
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
