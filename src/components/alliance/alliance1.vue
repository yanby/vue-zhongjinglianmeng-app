<template>
<div class="alliance" ref="box">
    <div class="navTop">
        <h2 class="navTopH2">中经联盟分布</h2>
    </div>
    <div class="allianceMap">
        <div id="container" style="height: 5.88rem; width: 7.5rem; padding-top: 1rem; margin: 0 auto;"></div>
    </div>
    <div class="allianceIntroduction">
        <p>中经联盟，全称中国房地产经理人联盟，定位于主体是开发商的社群组织。成立于2008年，注册会员总数近3000人，其中包括开发商集团公司董事长、总裁、总经理96位，开发商副总裁级别以上常务理事会员581位，担任俱乐部或专委会主席副主席职务的执委会成员285位，秘书处工作人员109位，下设28个专业委员会和俱乐部，囊括了中国房地产领域TOP200房企的近70%从业者、50%开发商企业。</p>
        <p>成立10年来，始终定位于“公益公信、专业团体、学习园地、交流平台、友情家园、人才宝库”，致力于打造5大平台---事业平台、健康平台、资本平台、舆论平台、人才平台，房地产从业者都以能够加入中经联盟为荣，国内主流房地产企业的董事长、总经理、副总经理、总监、乃至经理，品牌商家，知名学者、投融资机构成为联盟的主力人群。</p>
        <p>作为中国房地产业行业最具影响力的主流社团之一，中经联盟始终推动着行业发展和进步，充满着正能量！高举公益、公信、专业、健康的大旗，以丰富多彩的活动，搭建了有价值的行业平台，以“走正道、聚好人、做好事”享誉业内！</p>
        <p>中经联盟始终号召以公益目标，开放的胸怀，发展的眼光，包容的心态，专业的精神，规范化运行，实行轮值主席制度，打造行业内最具生命力的组织团体。现已落地天津、上海，今年开始计划在全国各省市开设地方分支机构，河南、浙江及粤港澳大湾区分盟正在筹措搭建中，欢迎各地房地产企业老总加入我们！</p>
        <h5>机构定位：【公益公信】【专业团体】【学习园地】【交流平台】【友情家园】【人才宝库】</h5>
    </div>
</div>
</template>
<script>
import { Toast } from 'mint-ui';
import $ from '../../../static/js/jquery.min.js';
import axios from 'axios';
import qs from 'qs';
export default {
    name: 'alliance',
    data () {
        return {

        }
    },
    methods:{
        seekMapData(){
            let url = this.changeData() + '/show/selectOrganizations'
            axios(url,{
                method: 'post',
            }).then(data => {
                // console.log(data);
                var lnglats = data.data.orgList;
                // 百度地图API功能
                var mp = new BMap.Map("container");
                mp.centerAndZoom(new BMap.Point(109.777217, 38.252861), 4);

                mp.enableScrollWheelZoom();
                // var geoc = new BMap.Geocoder();//逆地址解析
                // 复杂的自定义覆盖物
                function ComplexCustomOverlay(point, text){
                    this._point = point;
                    this._text = text;
                }
                // 继承API的BMap.Overlay
                ComplexCustomOverlay.prototype = new BMap.Overlay();
                // 实现初始化方法
                ComplexCustomOverlay.prototype.initialize = function(map){
                    this._map = map;
                    var div = this._div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                    div.style.backgroundColor = "#3E925E";
                    div.style.border = "1px solid #3E925E";
                    div.style.color = "white";
                    div.style.height = ".4rem";
                    div.style.borderRadius = "10px";
                    div.style.padding = ".02rem .08rem";
                    div.style.lineHeight = ".4rem";
                    div.style.whiteSpace = "nowrap";
                    div.style.MozUserSelect = "none";
                    div.style.fontSize = ".24rem"
                    var span = this._span = document.createElement("span");
                    div.appendChild(span);
                    span.appendChild(document.createTextNode(this._text));
                    var that = this;

                    var arrow = this._arrow = document.createElement("div");
                    arrow.style.background = "url(../../../static/images/common/greenSquare.png) no-repeat";
                    arrow.style.position = "absolute";
                    arrow.style.width = ".6rem";
                    arrow.style.height = ".28rem";
                    arrow.style.top = ".34rem";
                    arrow.style.left = "50%";
                    arrow.style.marginLeft = "-.18rem";
                    arrow.style.overflow = "hidden";
                    div.appendChild(arrow);

                    mp.getPanes().labelPane.appendChild(div);

                    return div;
                }
                // 实现绘制方法
                ComplexCustomOverlay.prototype.draw = function(){
                    var map = this._map;
                    // 根据地理坐标转换为像素坐标，并设置给容器
                    var pixel = map.pointToOverlayPixel(this._point);
                    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
                    this._div.style.top  = pixel.y - 30 + "px";
                }
                //在调用聚合方法时会将会调用标注的getPosition方法
                //获取该覆盖物的位置
                ComplexCustomOverlay.prototype.getPosition = function () {
                    return this._point;
                };
                // 自定义覆盖物添加事件方法
                ComplexCustomOverlay.prototype.addEventListener = function (event, fun) {
                    this._div['on' + event] = fun;
                }

                for (var i = 0; i < lnglats.length; i++) {
                    var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(lnglats[i].lng,lnglats[i].lat), lnglats[i].organization_name,lnglats[i].id);
                    // console.log(myCompOverlay);
                    mp.addOverlay(myCompOverlay);  // 将标注添加到地图中
                    //显示定位图标
                    myCompOverlay.addEventListener("touchend", createClickEvent(lnglats[i].id,lnglats[i].organization_name)); //覆盖物点击事件
                }
                function createClickEvent(id,name){
                    return function (e) {
                        window.location.href = "./allianceOne?id="+ id +"&name=" + name;
                    }
                }
            }).catch(err => {
                console.log(err)
            });
        },
    },
    mounted() {
        // this.seekMapData(1);
        this.seekMapData();
    },
    created() {

    }
}
</script>

<style scoped lang="scss">
@import "../../../static/css/commonNav.css";
.alliance{
    width: 7.5rem;
    background: #fff;
}
.allianceMap{
    width: 7.5rem;
    height: 5.88rem;
    padding-top: 1rem;
    .container{
        width: 7.5rem;
        height: 5.88rem;
    }
}
.allianceIntroduction{
    width: 6.9rem;
    padding: .3rem .3rem 1.8rem;
    p{
        color: #333;
        font-size: .3rem;
        line-height: .55rem;
        text-indent: 2em;
        text-align: justify;
    }
    h5{
        color: #333;
        font-size: .3rem;
        line-height: .5rem;
    }
}
</style>

