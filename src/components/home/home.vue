<template>
<div class="home" ref="box">
    <!-- APP下载页 -->
    <div class="appDownload">
        <dl>
            <dt><img src="../../../static/images/common/logo.png"></dt>
            <dd>
                <h3>中经联盟</h3>
                <h4>走正道&nbsp;聚好人&nbsp;做好事</h4>
            </dd>
            <!-- <p><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.youpu">立即下载</a></p> -->
            <p><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.appbyme.app194772">立即下载</a></p>
        </dl>
    </div>
    <div class="homeTop">
        <!-- 轮播图 -->
        <mt-swipe :auto="4000">
            <mt-swipe-item style="width: 100%; height: 100%;" v-for="(item,index) in picArr">
                <div style="width: 100%; height: 100%;">
                    <img :src="item.img_path" @click="goNewInfo(item.type,item.id,item.banner_url)" style="width: 100%; height: 100%;" :onerror="defaultImg1">
                </div>
            </mt-swipe-item>
        </mt-swipe>
    </div>
    <div class="homeIcon">
        <dl @click="goJoinAlliance()">
            <dt><img src="../../../static/images/home/icon1.png"></dt>
            <dd>加入联盟</dd>
        </dl>
        <dl>
            <router-link to='/announcement'>
                <dt><img src="../../../static/images/home/icon2.png"></dt>
                <dd>联盟公告</dd>
            </router-link>
        </dl>
        <dl>
            <router-link to='/events'>
                <dt><img src="../../../static/images/home/icon3.png"></dt>
                <dd>活动报名</dd>
            </router-link>
        </dl>
        <dl @click="goBuyHouse()">
            <dt><img src="../../../static/images/home/icon4.png"></dt>
            <dd>团购买房</dd>
        </dl>
        <dl>
            <router-link to='/news'>
                <dt><img src="../../../static/images/home/icon5.png"></dt>
                <dd>新闻资讯</dd>
            </router-link>
        </dl>
        <dl @click="goMemberBenefits">
            <dt><img src="../../../static/images/home/icon6.png"></dt>
            <dd>会员权益</dd>
        </dl>
        <dl @click="goMemberNeeds">
            <dt><img src="../../../static/images/home/icon7.png"></dt>
            <dd>会员需求</dd>
        </dl>
        <dl>
            <router-link to='/alliance'>
                <dt><img src="../../../static/images/home/icon8.png"></dt>
                <dd>分支机构</dd>
            </router-link>
        </dl>
    </div>
    <div class="homeListWrap">
        <div class="homeList" v-for="(item,index) in newsList" @click="goNewsInfo(item.id)">
            <dl>
                <dt v-if="item.img_path != ''">{{item.title}}</dt>
                <dt v-else class="homeListDt2">{{item.title}}</dt>
                <dd v-show="item.img_path != ''"><img :src="item.img_path" :onerror="defaultImg"></dd>
                <p>{{item.createTime}}</p>
            </dl>
        </div>
    </div>
    <!-- 弹窗提示 -->
    <div class="promptWrap" v-if="showPromptWrap">
        <div class="promptBox">
            <h5>您已经加入联盟，是否要成为常务理事？</h5>
            <ul>
                <li class="li1" @click="showPromptWrap = false">否</li>
                <li class="li2" @click="goJoinExecutiveDirector()">是</li>
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
    name: 'home',
    data () {
        return {
            picArr: [], //轮播图
            newsList: [],
            userDataObj: {}, // 用户数据
            showPromptWrap: false,
            defaultImg: 'this.src="' + require('../../../static/images/common/err.png') + '"', //默认图片
            defaultImg1: 'this.src="' + require('../../../static/images/common/err1.png') + '"', //默认图片

            audit: "1",  // 审核状态
            level: "3" // 等级
        }
    },
    methods:{
        // 跳转URL
        goNewInfo(type,id,url1){
            // alert(url1);
            if(type == "1" || type == "2"){
                this.$router.push({path: '/newsInfo',query:{id: url1, url: "home"}});
            }else if(type == "3"){
                this.$router.push({path: '/applyDetail',query:{id: url1, url: "home"}});
            }else if(type == "4"){
                this.$router.push({path: '/reviewDetail',query:{id: url1, url: "home"}});
            }else{
                window.location.href = url;
            }
        },

        // 点击团购买房
        goBuyHouse(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }if(this.userDataObj.level == "0"){
                Toast({
                    message: '您还不是联盟会员，请先加入联盟再进行团购买房',
                    duration: 3000
                });
            }else{
                this.$router.push({path: '/buyHouse'}); 
            }
        },
        // 点击加入联盟
        goJoinAlliance(){
            let _this = this;
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }else if(this.userDataObj.auditStatus == "0"){
                Toast({
                    message: '您的申请正在审核中，请等待审核',
                    duration: 3000
                });
            }else if(this.userDataObj.level == "1"){
                // 成为理事 跳转申请理事页面
                this.showPromptWrap = true;
            }else if(this.userDataObj.level == "2"){
                Toast({
                    message: '您已经是企业级会员，即享受常务理事的权益',
                    duration: 3000
                });
            }else if(this.userDataObj.level == "3"){
                Toast({
                    message: '您已经是常务理事',
                    duration: 3000
                });
                setTimeout(function(){
                    // 已是常务理事 跳转常务理事页面
                    _this.$router.push({path: '/memberBenefits',query:{url: "home"}});     
                }, 3000);
            }else{
                // 成为会员 跳转加入联盟页面
                this.$router.push({path: '/joinAlliance'});
            } 

            // if(!localStorage.token){
            //     Toast({
            //         message: '请先登录',
            //         duration: 2000
            //     });
            //     this.$router.push({path: '/login'}); 
            // }else if(this.audit == "0"){
            //     Toast({
            //         message: '您的申请正在审核中，请等待审核',
            //         duration: 3000
            //     });
            // }else if(this.level == "1"){
            //     // 成为理事 跳转申请理事页面
            //     this.showPromptWrap = true;
            // }else if(this.level == "2"){
            //     Toast({
            //         message: '您已经是企业级会员，即享受常务理事的权益',
            //         duration: 3000
            //     });
            // }else if(this.level == "3"){
            //     Toast({
            //         message: '您已经是常务理事',
            //         duration: 3000
            //     });
            //     setTimeout(function(){
            //         // 已是常务理事 跳转常务理事页面
            //         _this.$router.push({path: '/memberBenefits'});     
            //     }, 3000);
            // }else{
            //     // 成为会员 跳转加入联盟页面
            //     this.$router.push({path: '/joinAlliance'});
            // }
        },
        // 点击弹窗“是” 跳转申请理事
        goJoinExecutiveDirector(){
            this.$router.push({path: '/joinExecutiveDirector'});
        },

        // 点击会员权益
        goMemberBenefits(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }else {
                if(this.userDataObj.level == "3"){
                    // 成为会员 跳转加入联盟页面
                    this.$router.push({path: '/memberBenefits',query:{url: "home"}});
                }else{
                    this.$router.push({path: '/memberBenefits'});
                }
            }  
        },
        // 跳转会员需求
        goMemberNeeds(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login'}); 
            }else if(this.userDataObj.level == "0"){
                Toast({
                    message: '您还不是联盟会员，请先加入联盟再进行会员需求',
                    duration: 3000
                });
            }else{
                this.$router.push({path: '/memberNeeds'}); 
            }
        },
        
        // 首页展示
        listData() {
            let _this = this
            let url = this.changeData() + '/show/showInfo'
            axios(url,{
                method: 'post',
            }).then(data => {
                // console.log(data);
                this.picArr = data.data.data.bannerList; //轮播图
                this.newsList = data.data.data.informationList; //新闻列表
            }).catch(err => {
                console.log(err)
            });
        },

        // 点击进入详情
        goNewsInfo(id){
            this.$router.push({path: '/newsInfo',query:{id: id, url: "home"}});
        },
        
        // 获取用户信息
        userData(){
            let url = this.changeData() + '/member/auth/getMemberInfo'
            axios(url,{
                method: 'post',
            }).then(data => {
                // console.log(data);
                this.userDataObj = data.data.memberInfo;
                // console.log(this.userDataObj);
            }).catch(err => {
                console.log(err)
            });
        }
    },
    mounted() {
        
    },
    created() {
        // 首页展示
        this.listData();
        if(localStorage.token){
            this.userData();
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../../static/css/commonNav.css";
.home{
    width: 7.5rem;
}
/*app下载页*/
.appDownload{
    width: 6.9rem;
    height: 1rem;
    background: #fff;
    padding: .2rem .3rem;
    dl{
        width: 6.9rem;
        height: 1rem;
        padding: .1rem .2rem;
        box-shadow:0px 0px 4px rgba(0,0,0,0.18);
        box-sizing: border-box;
        border-radius: 6px;
        dt{
            width: .8rem;
            height: .8rem;
            float: left;
            img{
                width: .8rem;
                height: .8rem;
            }
        }
        dd{
            float: left;
            margin-top: .05rem;
            margin-left: .14rem;
            h3{
                width: #111;
                font-size: .3rem;
                margin-bottom: .02rem;
            }
            h4{
                width: #111;
                font-size: .26rem;
            }
        }
        p{
            width: 1.58rem;
            height: .66rem;
            line-height: .66rem;
            background: #3c915c;
            text-align: center;
            font-size: .26rem;
            float: right;
            color: #fff;
            margin-top: .06rem;
            border-radius: 4px;
            a{
                color: #fff;
            }
        }
    }
}
.homeTop{
    width: 7.5rem;
    height: 4.1rem;
}
.homeIcon{
    width: 7.5rem;
    height: 4rem;
    background: #fff;
    dl{
        width: 25%;
        float: left;
        margin-top: .6rem;
        text-align: center;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        dt{
            width: .6rem;
            height: .6rem;
            margin: 0 auto .1rem;
            img{
                width: .6rem;
                height: .6rem;
            }
        }
        dd{
            color: #333;
            font-size: .26rem;
        }
    }
}
.homeListWrap{
    width: 6.9rem;
    padding-left: .3rem;
    padding-right: .3rem;
    padding-bottom: 1rem;
    background: #fff;
}
.homeList{
    width: 6.9rem;
    background: #fff;
    border-top: 1px solid #eaeaea;
    padding: .3rem 0;
    dl{
        height: 1.7rem;
        position: relative;
        dt{
            width: 4.4rem;
            float: left;
            color: #333;
            font-size: .32rem;
            line-height: .5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .homeListDt2{
            width: 6.9rem;       
        }
        dd{
            float: right;
            img{
                width: 2.26rem;
                height: 1.7rem;
            }
        }
        p{
            position: absolute;
            bottom: 0;
            color: #898989;
            font-size: .24rem;
        }
    }
}
</style>
<style type="text/css">
.mint-swipe-indicator{
    width: 15px;
    height: 2px;
    opacity: 1;
    border-radius: 0;
    background: #fff;
}
.is-active{
    background: #3c915c!important;
}
.mint-swipe-indicators{
    width: 100%;
    text-align: center;
}
</style>

