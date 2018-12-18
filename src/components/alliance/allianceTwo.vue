<template>
<div class="allianceTwo">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">{{ListObj.committee_name}}</h2>
    </div>

    <div class="dataNull" v-show="ListObj.description == ''">
        <img src="../../../static/images/common/none.png">
        <h6>暂无介绍</h6>
    </div>

    <div class="allianceTwoInfo">
        <!-- <p></p> -->
        <div v-html="ListObj.description"></div>
    </div>
</div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
  export default {
    name: 'allianceTwo',
    data () {
      return {
        urlId: "",
        move: "",
        ListObj: {}
      }
    },
    methods: {
        // 点击返回按钮
        navBack(){ 
            this.$router.go(-1);
            // this.$router.push({path: '/allianceOne'});  
            // this.$router.push({path: '/allianceOne',query:{id: id}});          
        },
        ListData(){
            let url = this.changeData() + '/show/selectCommitteeDetail'
            axios(url,{
                method: 'post',
                params: {
                    id: this.urlId
                }
            }).then(data => {
                // console.log(data);
                this.ListObj = data.data.committeeDetail;

            }).catch(err => {
                console.log(err)
            });
        }
      
    },
    mounted(){
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
            $(".allianceTwoInfo").css({"padding":".3rem .2rem .3rem .2rem"});
        }
        this.ListData();
    },
    created() {
        
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.allianceTwo{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
}
.allianceTwoInfo{
    width: 6.9rem;
    padding: 1.3rem .3rem .6rem;
    background: #fff;
    p{
        color: #333;
        font-size: .3rem;
        text-indent: 2em;
        line-height: .5rem;
    }
    h5{
        color: #333;
        font-size: .3rem;
        margin-top: .5rem;
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