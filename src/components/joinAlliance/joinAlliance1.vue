<template>
<div class="joinAlliance">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">加入联盟</h2>
        <h5 class="navTopH5" @click="goDues()">会费标准</h5>
    </div>
    <div class="joinAllianceWrap">
        <ul>
            <li class="joinAllianceLi1">
                <p>*真实姓名</p>
                <input type="" name="" placeholder="请输入真实姓名" v-model="userName">
            </li>
            <li>
                <p>*所在公司</p>
                <input type="" name="" placeholder="请输入所在公司" v-model="companyVal">
            </li>
            <li>
                <p>*职位</p>
                <input type="" name="" placeholder="请输入职位" v-model="postVal">
            </li>
            <li>
                <p>*手机号</p>
                <span>{{userTel}}</span>
            </li>
            <li>
                <p>分支机构</p>
                <div @click="organizationFun()">
                    <span class="grayColorSpan" v-if="typePulldownTxt == ''">请选择机构</span>
                    <span class="organizationSpan" v-else>{{typePulldownTxt}}</span>
                    <img v-if="showOrganizationWrap == true" src="../../../static/images/common/downward.png" class="downward">
                    <img v-else src="../../../static/images/common/upward.png" class="upward">
                </div>
            </li>
            <li>
                <p>*类型</p>
                <div @click="showTypesWrap = true;">
                    <span class="grayColorSpan" v-if="typesTxt == ''">请选择类型</span>
                    <span v-model="typesTxt" v-else>{{typesTxt}}</span>
                    <img v-if="showTypesWrap == true" src="../../../static/images/common/downward.png" class="downward">
                    <img v-else src="../../../static/images/common/upward.png" class="upward">
                </div>
            </li>
            <li>
                <p>*类别</p>
                <div @click="showCategoryWrap = true">
                    <span class="grayColorSpan" v-if="categoryTxt == ''">请选择类别</span>
                    <span v-model="categoryTxt" v-else>{{categoryTxt}}</span>
                    <img v-if="showCategoryWrap == true" src="../../../static/images/common/downward.png" class="downward">
                    <img v-else src="../../../static/images/common/upward.png" class="upward">
                </div>
            </li>
            <li>
                <p>会费</p>
                <span class="grayColorSpan" v-if="typesTxt == '' || categoryTxt == ''">请选择类型和类别</span>
                <h5 v-else>{{memberCost}}</h5>
            </li>
        </ul>
    </div>
    <div class="submitBtn" @click="submitBtn()">提交申请</div>

    <!-- 类型 -->
    <div class="typesWrap" v-if="showTypesWrap">
        <div class="typesOption" @click.stop>
            <ul>
                <li v-for="(item,index) in typesArr" @click="typesBtn(item.d_value,item.d_name)">{{item.d_name}}</li>
            </ul>
            <i></i>
            <h3 @click="showTypesWrap = false;">取消</h3>
        </div>
    </div>

    <!-- 类别 -->
    <div class="typesWrap" v-if="showCategoryWrap">
        <div class="typesOption" @click.stop>
            <ul v-if="this.isCategory == 0">
                <li v-for="(item,index) in categoryArr" @click="categoryBtn(item.d_value,item.d_name)">{{item.d_name,item.d_value}}</li>
            </ul>
            <ul v-else>
                <li v-for="(item,index) in categoryArr" @click="categoryBtn(item.d_value,item.d_name)" v-if="index < 2">{{item.d_name,item.d_value}}</li>
            </ul>
            <i></i>
            <h3 @click="showCategoryWrap = false;">取消</h3>
        </div>
    </div>

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
        showTypesWrap: false, // 类型
        showCategoryWrap: false, // 类别
        showOrganizationWrap: false, // 分支机构
        changeColor: 0,

        // 类型下拉
        typesArr: [],
        // 类别下拉
        categoryArr: [],
        // 分支机构下拉
        organizationArr: [],

        organizationChildArr2: {
            areaList: [{
                committee_name: "中经联盟北京总部",
                id: 1,
                organization_id: "1",
                organization_name: "中经联盟北京总部"
            },{
                committee_name: "（传化涂料）总裁俱乐部",
                id: 2,
                organization_id: "1",
                organization_name: "中经联盟北京总部",
            },{
                committee_name: "（天勤地产）商业地产专委会",
                id: 3,
                organization_id: "1",
                organization_name: "中经联盟北京总部"
            },{
                committee_name: "物业专委会",
                id: 4,
                organization_id: "1",
                organization_name: "中经联盟北京总部"
            },{
                committee_name: "（传化涂料）工程管理专委会",
                id: 5,
                organization_id: "1",
                organization_name: "中经联盟北京总部"
            }]
        },

        // organizationChildArr2: {
        //     areaList: [{
        //         committee_name: "中经联盟总裁专委会",
        //         id: 1,
        //         organization_id: "1",
        //         organization_name: "中经联盟（总部）"
        //     }]
        // },


        // 个人信息
        userName: "", // 真实姓名
        companyVal: "", // 公司
        postVal: "", // 职位
        userTel: "", // 电话

        // 下拉选择数据
        typePulldownTxt: "",//分支机构
        // parentName: "中经联盟北京总部",//分支机构父级
        typePulldownTxtId: "", //分支机构id
        typesTxt: "",
        typesId: "", // 类型id
        categoryTxt: "",
        categoryId: "", // 类别id

        // 会员费用
        memberCost: "",
        isCategory: "0"

      }
    },
    mounted(){

    },
    methods: {
        // 点击返回按钮
        navBack(){        
            // this.$router.push({path: '/home'});  
            this.$router.go(-1);          
        },
        // 跳转会员标准
        goDues(){
            this.$router.push({path: '/dues'});
        },
        // 提交
        submitBtn(){
            if(this.userName == "" || this.companyVal == "" || this.postVal == "" || this.typesTxt == "" || this.categoryTxt == ""){
                Toast({
                    message: '请输入相关信息',
                    duration: 3000
                });
            }else{
                // alert("成功");
                let url = this.changeData() + '/memberOrder/auth/createOrder'
                axios(url,{
                    method: 'post',
                    params: {
                        name: this.userName,   //真实姓名
                        company: this.companyVal, //公司名称
                        position: this.postVal, //职位
                        type: this.typesId,  //类型
                        category: this.categoryId,   // 类别
                        feeId: this.memberCostId,   //会费id
                        org: this.typePulldownTxtId, //string  否   分支机构 传参格式 一级机构id,二级机构id 例如 8,31
                        // flag      申请理事 传 1 会员续费时 传2 feeId 必传
                        orderSource: "4"
                    }
                }).then(data => {
                    console.log(data);
                    if(data.data.code == 101){
                        // Toast({
                        //     message: '提交成功',
                        //     duration: 3000
                        // });
                        // this.$router.push({path: '/pay'});
                        // Toast({
                        //     message: '提交成功',
                        //     duration: 2000
                        // });
                        this.$router.push({path: '/pay',query:{orderNo: data.data.orderNo}});
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
        // 选择类型
        typesBtn(id,name){
            // alert(name);
            this.typesId = id;
            console.log(this.typesId);
            this.typesTxt = name;
            this.showTypesWrap = false;
        },
        // 选择类别
        categoryBtn(id,name){
            this.categoryId = id;
            console.log(this.categoryId);
            this.categoryTxt = name;
            this.showCategoryWrap = false;
        },

        organizationFun(){
            this.showOrganizationWrap = true; 
            // $(".organizationOption ul li:eq(1)").click();

            $(".organizationOption ul li:eq(1)").css("color", "red");
        },
        // 选择分支机构
        organizationBtn(id,name,index,item){
            console.log("11111")

            console.log(item);

            this.organizationChildArr = item;
            this.changeColor = index;
            // this.parentName = name;
        },

        // 选择分支机构子集
        organizationChildBtn(id,parentId,name,parentName){
            // var str = brandTypeParentId + "-" + id;
            this.showOrganizationWrap = false;
            this.typePulldownTxt = parentName + "-" + name; 
            console.log(this.typePulldownTxt);
            this.typePulldownTxtId = parentId + "," + id;
            console.log(this.typePulldownTxtId);
        },

        // 下拉数据
        pulldownData(){
            let _this = this
            let url = this.changeData() + '/memberOrder/selectType'
            axios(url,{
                method: 'post',
            }).then(data => {
                console.log(data);
                // 类型下拉
                this.typesArr = data.data.type;
                // 类别下拉
                this.categoryArr = data.data.category;
                // 分支机构下拉
                this.organizationArr = data.data.organizationList;
            }).catch(err => {
                console.log(err)
            });
        },

        // 获取用户信息
        userData(){
            let url = this.changeData() + '/member/auth/getMemberInfo'
            axios(url,{
                method: 'post',
            }).then(data => {
                console.log(data);
                this.userDataObj = data.data.memberInfo;
                console.log(this.userDataObj);
                var str = data.data.memberInfo.phone;
                var str2 = str.substr(0,3)+"****"+str.substr(7)
                // 手机号码中间四位*代替
                this.userTel = str2;

                // 个人信息
                this.userName = data.data.memberInfo.name; // 真实姓名
                this.companyVal = data.data.memberInfo.company; // 公司
                this.postVal = data.data.memberInfo.position; // 职位


            }).catch(err => {
                console.log(err)
            });
        }

    },
    mounted() {
        
    },
    created() {
        // 获取用户信息
        this.userData();
        // 获取下拉数据
        this.pulldownData();
        this.organizationBtn("","","0",this.organizationChildArr2);  
    },
    watch: {
        typesTxt(){
            this.categoryTxt = "";
            if(this.typesTxt == "个人"){
                this.isCategory = "0";
                // console.log(this.isCategory);
            }else if(this.typesTxt == "企业"){
                this.isCategory = "1";
                // console.log(this.isCategory);
            }
        },
        categoryTxt(){
            if(this.typesTxt != "" && this.categoryTxt != ""){
                let url = this.changeData() + '/memberOrder/auth/selectOrderFee'
                axios(url,{
                    method: 'post',
                    params: {
                        type: this.typesId,
                        category: this.categoryId
                    }
                }).then(data => {
                    console.log(data);
                    if(data.data.code == "101"){
                        this.memberCost = data.data.orderFee.fee + "元／年" + "(" + data.data.orderFee.service_name + ")";
                        this.memberCostId = data.data.orderFee.id;

                        // {{memberCost.fee}}元／年（{{memberCost.service_name}}）
                    }
                }).catch(err => {
                    console.log(err)
                });
            }
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.joinAlliance{
    width: 7.5rem;
}
.joinAllianceWrap{
    width: 6.9rem;
    height: 7.3rem;
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
                width: 4.8rem;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
            span{
                color: #333333;
                font-size: .28rem;
            }
            .grayColorSpan{
                color: #898989;
                font-size: .28rem;
            }
            .organizationSpan{
                display: inline-block;
                width: 4.2rem;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
            .upward,.downward{
                width: .24rem;
                height: .16rem;
                position: absolute;
                right: 0rem;
                top: .4rem;
            }
        }
        .joinAllianceLi1{
            border-top: none;
        }
    }
}
.typesWrap{
    width: 7.5rem;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    z-index: 999999999;
    -webkit-tap-highlight-color: rgba(0,0,0,0); 
    .typesOption{
        width: 7.5rem;
        position: fixed;
        bottom: 0;
        text-align: center;
        ul{
            background: #fff;
            li{
                height: .88rem;
                line-height: .88rem;
                color: #333;
                font-size: .3rem;
                border-bottom: 1px solid #eaeaea;
            }
        }
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
        }
    }
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
