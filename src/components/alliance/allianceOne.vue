<template>
<div class="allianceOne">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">{{titleName}}</h2>
    </div>
    <div class="dataNull" v-show="ListArr == ''">
        <img src="../../../static/images/common/none.png">
        <h6>暂无数据</h6>
    </div>
    <div class="allianceOneList">
        <ul>
            <li v-for="(item,index) in ListArr" @click="goAllianceTwo(item.id)">
                <i></i>{{item.committee_name}}
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
  export default {
    name: 'allianceOne',
    data () {
      return {
        urlId: "",
        titleName: "",
        ListArr: []
      }
    },
    methods: {
        // 点击返回按钮
        navBack(){        
            this.$router.push({path: '/alliance'});            
        },
        // 点击返回按钮
        goAllianceTwo(id){
            this.$router.push({path: '/allianceTwo',query:{id: id}});
        },
        ListData(){
            let url = this.changeData() + '/show/selectCommitteeList'
            axios(url,{
                method: 'post',
                params: {
                    id: this.urlId
                }
            }).then(data => {
                // console.log(data);
                this.ListArr = data.data.committeeList;
            }).catch(err => {
                console.log(err)
            });
        }
    },
    mounted(){

    },
    created() {
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
        this.titleName = request['name'];
        this.urlId = request['id'];
        this.ListData();
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.allianceOne{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.allianceOneList{
    width: 6.9rem;
    padding: 1.3rem .3rem;
    background: #fff;
    ul{
        li{
            color: #333;
            font-size: .3rem;
            height: .6rem;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
    }
    i{
        display: inline-block;
        width: .1rem;
        height: .1rem;
        background: #3e925e;
        margin-right: .2rem;
        position: relative;
        top: -.05rem;
    }
}
/*无数据*/
.dataNull{
    width: 7.5rem;
    text-align: center;
    padding-top: 3rem;
    img{
        width: 1.68rem;
        height: 1.68rem;
    }
    h6{
        color: #333333;
        font-size: .3rem;
        margin-top: .3rem;
    }
}
</style>
