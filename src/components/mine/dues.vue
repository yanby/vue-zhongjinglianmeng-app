<template>
    <div class="project">
      <div class="nav" @click="back()"><span></span>会费标准</div>
      <div class="content">

      </div>
    </div>
</template>

<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
    data () {
        return {
          model:false
        }
    },
    methods:{
      back(){
        this.$router.go(-1);
      },
    },
    mounted() {
      if(getUrlId("move")){
        $(".nav").hide();
        $(".content").css({"margin": "0 auto"})
      }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .project{
    width: 7.5rem;
    height: 100vh;
    position: relative;
    .content{
      width: 6.89rem;
      height: 10.16rem;
      margin: 1.3rem auto 0;
      background: url("../../../static/images/mine/huifei.png") no-repeat;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;
    }
  }
</style>
