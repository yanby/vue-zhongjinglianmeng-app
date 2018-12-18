<template>
<div class="announcementInfo" ref="box">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <img src="../../../static/images/common/collect.png" class="collectIcon">
        <!-- <img src="../../../static/images/common/collect1.png" class="collectIcon"> -->
    </div>
    <div class="infoWrap">
        <h3 class="infoTitle">关于中经联盟地产杰出人物志《10年100人》的相关通告武汉分盟正式成立！</h3>
        <h6 class="infoDate">2018-10-10</h6>
        <div class="infoContent">
            <p>中美重启谈判，3个信号必须注意信号1：这次备受瞩目的磋商，是美方发出邀请正如很多网友所说的：新闻越短，事情越大。这100多字的新闻稿，显然暗藏玄美方为什么邀请？应该也是在调整立场。因为现实是残酷的，贸易战确实就是两败俱伤。这次史无前例的贸易摩擦，已经对中美一些企业和产业带来了严重冲击；如果贸易战继续升级，双方都将蒙受重大损失。</p>
            <p>回到谈判桌前，通过对话沟通解决问题，就成了唯一正确的选择。从美方之前释放的一些信息来看，中美此前应该已进行了多轮工作层面的接触，包括电话的沟通。所以，才有了这次定于8月下旬的副部长级磋商。信号2：双方都很小心，先派出副部级官员接触按照商务部发布的信息，这次贸易磋商，中方领衔的是商务部副部长兼国际贸易谈判副代表王受文，美方则是财政部副部长马尔帕斯。要知道，在前三轮磋商中，中美都派出了众多部长级乃至更高层级官员。</p>
            <p>结果，大家也都很清楚，中美虽然达成了停战的共识，美国财长姆努钦也明确向媒体表示，双方贸易战不打了。但最终，白宫撕毁了共识，发动了贸易战。对话和沟通的基础，只能是这三个关键词：对等、平等、诚信。对等和平等，就不用多说了。但这个“诚信”，应该是深意藏焉，极具针对性。</p>
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
    name: 'announcementInfo',
    data () {
        return {

        }
    },
    methods:{
        // 点击返回按钮
        navBack(){        
            this.$router.push({path: '/announcement'});            
        },
    },
    mounted(){
        
    },
    created(){
        
    }
}
</script>
<style scoped lang="scss">
@import "../../../static/css/commonNav.css";
.announcementInfo{
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
    }
    .infoDate{
        font-size: .28rem;
        color: #898989;
        margin-top: .2rem;
        margin-bottom: .3rem;
    }
    .infoContent{
        p{
            color: #666;
            font-size: .28rem;
            text-indent: 2em;
            line-height: .4rem;
        }
    }
}
</style>

