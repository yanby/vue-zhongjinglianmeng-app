<template>
<div class="joinExecutiveDirector">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">申请理事</h2>
        <h5 class="navTopH5" @click="goDues()">会费标准</h5>
    </div>
    <div class="joinExecutiveDirectorWrap">
        <ul>
            <li class="joinExecutiveDirectorLi1">
                <p>*真实姓名</p>
                <span>{{userDataObj.name}}</span>
            </li>
            <li>
                <p>*所在公司</p>
                <span>{{userDataObj.company}}</span>
            </li>
            <li>
                <p>*职位</p>
                <span>{{userDataObj.position}}</span>
            </li>
            <li>
                <p>*手机号</p>
                <span>{{userTel}}</span>
            </li>
            <li>
                <p>分支机构</p>
                <div @click="showOrganizationWrap = true;">
                    <span class="grayColorSpan" v-if="typePulldownTxt == ''">请选择机构</span>
                    <span class="organizationSpan" v-else>{{typePulldownTxt}}</span>
                    <img v-if="showOrganizationWrap == true" src="../../../static/images/common/downward.png" class="downward">
                    <img v-else src="../../../static/images/common/upward.png" class="upward">
                </div>
            </li>
            <li>
                <p>类型</p>
                <span>{{userDataObj.typeText}}</span>
            </li>
            <li>
                <p>类别</p>
                <span>{{userDataObj.categoryText}}</span>
            </li>
            <li>
                <p>申请级别</p>
                <span>常务理事（当前是普通会员）</span>
            </li>
            <li>
                <p>会费</p>
                <h5>{{userDataObj.fee}}元/年</h5>
            </li>
        </ul>
    </div>
    <div class="prompting">注：如个人信息变动，请及时修改</div>
    <div class="submitBtn" @click="submitBtn">提交申请</div>

    <!-- 分支机构 -->
    <div class="organizationWrap" v-if="showOrganizationWrap">
        <div class="organizationOption" @click.stop>
            <ul>
                <li class="li1" v-for="(item,index) in organizationArr">
                    <span @click="organizationBtn(item.id,item.organization_name,index,item)" :class="{txtColor:changeColor == index}">{{item.organization_name}}</span>
                    <ol>
                        <li v-for="(item1,index1) in organizationChildArr.areaList" @click="organizationChildBtn(item1.id,item1.organization_id,item1.committee_name,item1.organization_name)">{{item1.committee_name}}</li>
                    </ol>
                </li>
            </ul>
        </div>
        <div class="organizationBottom">
            <i></i>
            <h3 @click="showOrganizationWrap = false;">取消</h3>
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
    name: 'joinAlliance',
    data () {
      return {
        userTel: "", //电话号码
        userDataObj: {},
        organizationArr: [], // 分支机构下拉
        showOrganizationWrap: false,
        // 分支机构
        typePulldownTxt: "",
        changeColor: 0,
        typePulldownTxtId: "",

        memberCostId: ""// 会员费用
      }
    },
    mounted(){

    },
    methods: {
        // 点击返回按钮
        navBack(){        
            // this.$router.push({path: '/memberBenefits'});  
            this.$router.go(-1);          
        },
        // 跳转会员标准
        goDues(){
            this.$router.push({path: '/dues'});
        },

        // 选择分支机构
        organizationBtn(id,name,index,item){
            this.organizationChildArr = item;
            this.changeColor = index;
            // this.parentName = name;
        },
        // 选择分支机构子集
        organizationChildBtn(id,parentId,name,parentName){
            // var str = brandTypeParentId + "-" + id;
            this.showOrganizationWrap = false;
            this.typePulldownTxt = parentName + "-" + name; 
            // console.log(this.typePulldownTxt);
            this.typePulldownTxtId = parentId + "," + id;
            console.log(this.typePulldownTxtId);
        },

        // 提交
        submitBtn(){
            // alert("成功");
            let url = this.changeData() + '/memberOrder/auth/createOrder'
            axios(url,{
                method: 'post',
                params: {
                    name: this.userDataObj.name,   //真实姓名
                    company: this.userDataObj.company, //公司名称
                    position: this.userDataObj.position, //职位
                    type: this.userDataObj.type,  //类型
                    category: this.userDataObj.category,   // 类别
                    feeId: this.userDataObj.orderServiceId,   //会费id
                    org: this.typePulldownTxtId,//string  否   分支机构 传参格式 一级机构id,二级机构id 例如 8,31
                    feeId: this.memberCostId,   //会费id
                    flag: "1",     //申请理事 传 1 会员续费时 传2 feeId 必传
                    orderSource: "4"
                }
            }).then(data => {
                // console.log(data);
                if(data.data.code == 101){
                    // Toast({
                    //     message: '提交成功',
                    //     duration: 2000
                    // });
                    this.$router.push({path: '/pay',query:{orderNo: data.data.orderNo}});
                    // this.$router.push({path: '/newsInfo',query:{id: url}});
                }else{
                    Toast({
                        message: data.data.message,
                        duration: 3000
                    });
                }
            }).catch(err => {
                console.log(err)
            });
        },

        // 获取用户信息
        userData(){
            let url = this.changeData() + '/member/auth/getMemberInfo'
            axios(url,{
                method: 'post',
                params: {
                    flag: "1"      //申请理事 传 1 会员续费时 传2 feeId 必传
                }
            }).then(data => {
                console.log(data);
                this.userDataObj = data.data.memberInfo;
                // console.log(this.userDataObj);
                var str = data.data.memberInfo.phone;
                var str2 = str.substr(0,3)+"****"+str.substr(7);
                // 手机号码中间四位*代替
                this.userTel = str2;

                this.memberCostId = data.data.memberInfo.orderServiceId;// 会员费用
        
                // console.log(this.memberCostId);

                if(data.data.memberInfo.organizationId != "" && data.data.memberInfo.committeeId != ""){
                    this.typePulldownTxtId = data.data.memberInfo.organizationId +","+ data.data.memberInfo.committeeId;
                    // console.log(this.typePulldownTxtId);
                    //string  否   分支机构 传参格式 一级机构id,二级机构id 例如 8,31
                }

                if(data.data.memberInfo.organizationText != "" && data.data.memberInfo.committeeText != ""){
                    this.typePulldownTxt = data.data.memberInfo.organizationText + '-' + data.data.memberInfo.committeeText;
                }
            }).catch(err => {
                console.log(err)
            });
        },

        
    },
    mounted() {
        // this.pulldownData();
        // this.organizationBtn("","","0",this.organizationChildArr2);
        // 下拉数据
        let _this = this
        let url = this.changeData() + '/memberOrder/selectType'
        axios(url,{
            method: 'post',
        }).then(data => {
            console.log(data);
            // 分支机构下拉
            this.organizationArr = data.data.organizationList;
            var organizationChildArr2 = [];

            organizationChildArr2 = data.data.organizationList[0];

            this.organizationBtn("","","0",organizationChildArr2); 
        }).catch(err => {
            console.log(err)
        });  

    },
    created() {
        this.userData();   
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.joinAlliance{
    width: 7.5rem;
}
.joinExecutiveDirectorWrap{
    width: 6.9rem;
    /*height: 8.06rem;*/
    padding: 1rem .3rem 0 .3rem ;
    background: #fff;
    ul{
        li{
            width: 6.9rem;
            height: .9rem;
            border-top: 1px solid #eaeaea;
            line-height: .9rem;
            box-sizing: border-box;
            position: relative;
            p{
                width: 1.9rem;
                float: left;
                color: #333;
                font-size: .3rem;
            }
            input{
                width: 5rem;
                line-height: .4rem;
                background: transparent;
                font-size: .28rem;
                color: #333;
            }
            h5{
                color: #333;
                font-size: .28rem;
            }
            span{
                color: #333;
                font-size: .28rem;
            }
            .organizationSpan{
                display: inline-block;
                width: 4.2rem;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
        }
        .joinExecutiveDirectorLi1{
            border-top: none;
        }
        .upward,.downward{
            width: .24rem;
            height: .16rem;
            position: absolute;
            right: 0rem;
            top: .36rem;
        }
    }
}
.prompting{
    height: .5rem;
    width: 6rem;
    color: #4aa462;
    margin-top: .24rem;
    margin-left: .3rem;
    font-size: .24rem;
}
/* 分支机构 */
.organizationWrap{
    width: 7.5rem;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    z-index: 9999999;
    -webkit-tap-highlight-color: rgba(0,0,0,0); 
    .organizationOption{
        width: 7.5rem;
        height: 5.4rem;
        position: absolute;
        bottom: 0;
        ul{
            height: 4.4rem;
            width: 7.5rem;
            overflow-x: auto;
            background: #fff;
            .li1{
                height: .88rem;
                width: 3rem;
                box-sizing: border-box;
                text-align: center;
                display: block;
                color: #333333;
                font-size: .3rem;
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                z-index: 111;
                line-height: .88rem; 
                text-align: left;
                text-indent: 1em;          
                span{
                    color: #333333;
                    font-size: .3rem;
                }
                .txtColor{
                    color: #3c915c;
                }
                ol{
                    height: 4.4rem;
                    width: 4.5rem;                           
                    position: absolute;
                    left: 3rem;
                    top: 0;  
                    z-index: 100000;   
                    overflow-x: auto; 
                    background: #fafafa;                     
                    li{
                        width: 4.5rem;
                        height: .88rem;
                        font-size: .3rem;
                        line-height: .88rem;                        
                        z-index: 100000;  
                    }
                }                   
            }
        } 
    }
    .organizationBottom{
        width: 7.5rem;
        height: 1rem;
        position: absolute;
        bottom: 0;
        left: 0;
        i{
            display: block;
            width: 7.5rem;
            height: .12rem;
            background: rgba(255,255,255,.57);
        }
        h3{
            
            height: .88rem;
            color: #898989;
            line-height: .88rem;
            font-size: .3rem;
            background: #fff;
            text-align: center;
        }
    } 
}
</style>
