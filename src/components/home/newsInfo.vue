<template>
<div class="newsInfo" ref="box">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <img src="../../../static/images/common/collect.png" class="collectIcon" @click="collectBtn()" v-if="collectId == 0">
        <img src="../../../static/images/common/collect1.png" class="collectIcon" @click="cancelCollectBtn()" v-else>
    </div>
    <div class="infoWrap">
        <h3 class="infoTitle">{{newsObj.title}}</h3>
        <h6 class="infoDate">{{newsObj.createTime}}</h6>
        <div class="infoContent" v-html="newsObj.content"></div>
    </div>
</div>
</template>
<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
    name: 'newsInfo',
    data () {
        return {
            urlId: "",
            move: "",
            newsObj: {},
            collectId: 0, // 0 未收藏 1 已收藏
        }
    },
    beforeRouteEnter (to, from, next) {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // XXX: 修复iOS版微信HTML5 History兼容性问题
        if (isiOS && to.path !== location.pathname) {
            // 此处不可使用location.replace
            location.assign(to.fullPath)
        } else {
            next()
        }
    },
    methods:{
        // 点击返回按钮
        navBack(){
            if(this.$route.query.url){
                this.$router.go(-1);
            }else{
                this.$router.push({path: '/home'});
            }
        },
        
        // 新闻展示
        newsData(){
            let url = this.changeData() + '/information/detail'
            axios(url,{
                method: 'post',
                params: {
                    id: this.urlId
                }
            }).then(data => {
                // console.log(data);
                this.newsObj = data.data.informationDetail;
                this.collectId = data.data.informationDetail.is_collect;
            }).catch(err => {
                console.log(err)
            });
        },

        // 点击收藏按钮
        collectBtn(){
            if(!localStorage.token){
                this.$router.push({path: '/login'});
            }else{
                let url = this.changeData() + '/member/auth/collect'
                axios(url,{
                    method: 'post',
                    params: {
                        type: "0", //新闻和公告都传 0 活动传1
                        id: this.urlId //收藏内容的id
                    }
                }).then(data => {
                    // console.log(data);
                    this.collectId = 1;
                    if(data.data.code == 101){
                        Toast({
                            message: '收藏成功',
                            duration: 3000
                        });
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
        // 点击取消收藏
        cancelCollectBtn(){
            if(!localStorage.token){
                this.$router.push({path: '/login'});
            }else{
                let url = this.changeData() + '/member/auth/cancelCollect'
                axios(url,{
                    method: 'post',
                    params: {
                        collectType: "0", //新闻和公告都传 0 活动传1
                        id: this.urlId //收藏内容的id
                    }
                }).then(data => {
                    // console.log(data);
                    if(data.data.code == 101){
                        this.collectId = 0;
                        Toast({
                            message: '取消收藏',
                            duration: 3000
                        });
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

        fenxiangFun(){//详情分享
            // console.log(window.location.href.split('#')[0])
            var that = this;
            this.$http({
                url:this.changeData() + '/member/weChatShare',
                method: "post",
                params: {
                    url: window.location.href.split('#')[0]
                }
            }).then(function(res){
                // console.log(res)
                wx.config({
                    //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.data.appId, // 必填，公众号的唯一标识
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                    signature: res.data.signature,// 必填，签名
                    jsApiList: ["onMenuShareAppMessage","onMenuShareTimeline"] // 必填，需要使用的JS接口列表
                });

                //分享给好友
                wx.ready(function(){
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: that.newsObj.title, // 分享标题
                        desc: '中经联盟', // 分享描述
                        link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: "https://up-static.oss-cn-beijing.aliyuncs.com/Config/11544678901_.pic_hd.jpg", // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                        }
                    });

                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: that.newsObj.title, // 分享标题
                        link: window.location.href.split('#')[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: "https://up-static.oss-cn-beijing.aliyuncs.com/Config/11544678901_.pic_hd.jpg", // 分享图标
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                        }
                    });
                });
                wx.error(function(res){
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
            }.bind(this)).catch(function(err){
              console.log("资讯详情页面错误：",err)
            });
        },

    },
    mounted() {
        // alert(window.location.href.split('#')[0]);
        //截取Url里面的参数
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
        var request = new Object();
        request = GetRequest();

        this.urlId = request['id'];
        this.move = request['move'];
        if(this.move == "ios"){
            $(".navTop").hide();
        }else if(this.move == "android"){
            $(".navTop").hide();
            $(".infoWrap").css({"padding":".3rem .2rem .3rem .2rem"});
        }
        this.newsData()
    },
    created() {

    },
    updated(){
        // 分享
        this.fenxiangFun();
    }
}
</script>

<style scoped lang="scss">
@import "../../../static/css/commonNav.css";
.newsInfo{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.infoWrap{
    background: #fff;
    padding: 1.4rem .2rem .3rem .2rem;
    .infoTitle{
        color: #333;
        font-size: .36rem;
        text-align: justify;
        line-height: .5rem;
        /*text-align: center;*/
    }
    .infoDate{
        font-size: .28rem;
        color: #898989;
        margin-top: .2rem;
        margin-bottom: .3rem;
    }
    .infoContent{
        width: 7.1rem;
        p{
            color: #666;
            font-size: .28rem;
            text-indent: 2em;
            line-height: .4rem;
        }
    }
}
</style>
<style scoped>
.infoContent >>> img{
    max-width: 7.1rem;
    max-height: 10rem;
}
</style>

