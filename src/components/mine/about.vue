<template>
    <div class="collect">
      <div class="nav" @click="back()"><span></span>关于联盟 <b  @click.stop="logoutFun()">退出登录</b></div>
      <div class="content">
        <div class="msg">
          <div class="img"></div>
          <div class="name">中经联盟</div>
          <div class="tel">010-57116916</div>
          <div class="txt">
            <p>中经联盟，全称中国房地产经理人联盟，定位于主体是开发商的社群组织。成立于2008年，注册会员总数近3000人，其中包括开发商集团公司董事长、总裁、总经理96位，开发商副总裁级别以上常务理事会员581位，担任俱乐部或专委会主席副主席职务的执委会成员285位，秘书处工作人员109位，下设28个专业委员会和俱乐部，囊括了中国房地产领域TOP200房企的近70%从业者、50%开发商企业。</p>

            <p>成立10年来，始终定位于“公益公信、专业团体、学习园地、交流平台、友情家园、人才宝库”，致力于打造5大平台---事业平台、健康平台、资本平台、舆论平台、人才平台，房地产从业者都以能够加入中经联盟为荣，国内主流房地产企业的董事长、总经理、副总经理、总监、乃至经理，品牌商家，知名学者、投融资机构成为联盟的主力人群。</p>

            <p>作为中国房地产业行业最具影响力的主流社团之一，中经联盟始终推动着行业发展和进步，充满着正能量！高举公益、公信、专业、健康的大旗，以丰富多彩的活动，搭建了有价值的行业平台，以“走正道、聚好人、做好事”享誉业内！</p>

            <p>中经联盟始终号召以公益目标，开放的胸怀，发展的眼光，包容的心态，专业的精神，规范化运行，实行轮值主席制度，打造行业内最具生命力的组织团体。现已落地天津、上海，今年开始计划在全国各省市开设地方分支机构，河南、浙江及粤港澳大湾区分盟正在筹措搭建中，欢迎各地房地产企业老总加入我们！</p>

            <p>机构定位：【公益公信】、【专业团体】、【学习园地】、【交流平台】、【友情家园】、【人才宝库】</p>
          </div>
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
    data () {
        return {

        }
    },
    mounted() {
      if(getUrlId("move")){
        $(".nav").hide();
        $(".content").css({"margin": "0"})
      }
    },
    methods:{
      back(){
        this.$router.go(-1);
      },
      logoutFun(){
        localStorage.clear();
        this.$router.push({path:"/home"})
        Toast("退出成功")
      },
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .collect{
    width: 7.5rem;
    height: 100vh;
    background: #fff;
    position: relative;
    .nav{
      b{
        position: absolute;
        top: 0rem;
        right: .2rem;
      }
    }
    .content{
      margin-top: 1rem;
      width: 7.5rem;
      height: 21.41rem;
      background: url("../../../static/images/mine/about-bg.png") no-repeat;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;
      .msg{
        padding: .7rem .3rem 1rem;
        .img{
          width: 1.48rem;
          height: 1.48rem;
          margin: 0 auto;
          background: url("../../../static/images/mine/logo.png") no-repeat;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
        }
        .name{
          text-align: center;
          font-size: .34rem;
          padding: .3rem 0 .2rem;
        }
        .tel{
          text-align: center;
          font-size: .3rem;
        }
        .txt{
          margin-top: .3rem;
          width: 6.3rem;
          background: #fff;
          padding: .3rem;
          p{
            font-size: .3rem;
            line-height: .5rem;
            text-indent: 2em;
          }
        }
      }
    }
  }
</style>
