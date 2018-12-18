<template>
<div class="news" ref="box">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">新闻资讯</h2>
    </div>
    <div class="newsListWrap">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     ref="loadmore" :bottom-all-loaded="allLoaded" :auto-fill="false">
            <div class="newsList" v-for="(item,index) in newsList" @click="goNewsInfo(item.id)">
                <dl>
                    <dt v-if="item.img_path != ''">{{item.title}}</dt>
                    <dt v-else class="newsListDt2">{{item.title}}</dt>
                    <dd v-show="item.img_path != ''"><img :src="item.img_path" :onerror="defaultImg"></dd>
                    <p>{{item.createTime}}</p>
                </dl>
            </div>
            <div class="noInner" v-if="more">暂无更多内容！</div>
        </mt-loadmore>
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
    name: 'news',
    data () {
        return {
            pageSize: 10,
            pageNum: 1,
            listIndex: 1,
            newsList: [],
            defaultImg: 'this.src="' + require('../../../static/images/common/err.png') + '"', //默认图片
            more: false,  //有没有更多数据
            allLoaded: false
        }
    },
    methods:{
        // 点击返回按钮
        navBack(){        
            this.$router.push({path: '/home'});            
        },
        // 点击进入详情
        goNewsInfo(id){
            this.$router.push({path: '/newsInfo',query:{id: id, url:"news"}});
        },
        // 列表展示
        listData(){
            let _this = this
            let url = this.changeData() + '/information/selectInformationList'
            axios(url,{
                method: 'post',
                params: {
                    pageSize: this.pageSize, //每页数据量
                    pageNum: this.pageNum, //页码从1开始
                    type: 0 //0 资讯 1 公告
                }
            }).then(data => {
                // console.log(data);
                Indicator.close();
                this.newsList = data.data.informationList; // 新闻列表
            }).catch(err => {
                console.log(err)
            });
        },
        loadTop(){ //下拉刷新
            var _this = this;
            let url = this.changeData() + '/information/selectInformationList'
            var data = {
                pageSize: this.pageSize, //每页数据量
                pageNum: this.pageNum, //页码从1开始
                type: 0 //0 资讯 1 公告
            }
            setTimeout(function () {
                axios(url,{
                    method: 'post',
                    params: data
                }).then(data => {
                    _this.newsList = data.data.informationList; // 新闻列表
                    _this.$refs.loadmore.onTopLoaded();
                }).catch(err => {
                    console.log(err)
                });
            },1000)
        },

        loadBottom() { //上拉加载     
            let _this = this;
            this.listIndex++;
            this.allLoaded = false;
            let url = this.changeData() + '/information/selectInformationList' 
            var data = {
                pageSize: this.pageSize, //每页数据量
                pageNum: this.listIndex, //页码从1开始
                type: 0 //0 资讯 1 公告
            }
                               
            setTimeout(function () {
                axios(url,{
                    method: 'post',
                    params: data
                }).then(data => {
                    // _this.newsList = data.data.informationList; // 新闻列表
                    _this.newsList = _this.newsList.concat(data.data.informationList);
                    if(data.data.informationList <= 0){
                      _this.allLoaded = true;
                    }
                    _this.$refs.loadmore.onBottomLoaded();
                }).catch(err => {
                    console.log(err)
                });
            },1000)
        },
        handleBottomChange(){
            var _this = this;
            if(this.allLoaded == true){
                _this.more = true;
                setTimeout(function () {
                    _this.more = false;
                },2000)
            }
        },
    },
    mounted() {
        Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
        });
        this.listData();
    },
    created() {
        
    }
}
</script>
<style scoped lang="scss">
@import "../../../static/css/commonNav.css";
.news{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.newsListWrap{
    width: 6.9rem;
    padding-top: 1rem;
    padding-left: .3rem;
    padding-right: .3rem;
    background: #fff;
}
.newsList{
    width: 6.9rem;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    padding: .3rem 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
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
        .newsListDt2{
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
.noInner{
    text-align: center;
    line-height: 1rem;
}
</style>

