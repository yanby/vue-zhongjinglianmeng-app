<template>
<div class="buyHouse">
    <div class="navTop">
        <img src="../../../static/images/common/backWhite.png" class="backWhite" @click="navBack()">
        <h2 class="navTopH2">团购买房</h2>
    </div>
    <div class="buyHouseWrap">
        <ul>
            <li class="buyHouseLi1">
                <p>*项目名称</p>
                <input type="" name="" placeholder="请输入意向购买项目名称" v-model="projectName">
            </li>
            <li>
                <p>*楼号</p>
                <input type="" name="" placeholder="请输入项目意向楼号" v-model="floorNumber">
            </li>
            <li>
                <p>*单元房号</p>
                <input type="" name="" placeholder="请输入相应单元房号" v-model="roomNumber">
            </li>
            <li>
                <p>*购房人姓名</p>
                <input type="" name="" placeholder="请输入购房人姓名" v-model="buyerName">
            </li>
            <li>
                <p>*购房人电话</p>
                <input type="tel" name=""  placeholder="请输入购房人电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11" v-model="buyerTel">
            </li>
            <li>
                <p>项目销售人员姓名</p>
                <input type="" name="" placeholder="请输入项目销售人员姓名" v-model="sellName">
            </li>
            <li>
                <p>项目销售人员电话</p>
                <input type="" name="" placeholder="请输入项目销售人员电话" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11" v-model="sellTel">
            </li>
        </ul>
    </div>
    <div class="submitBtn" @click="submitBtn()">提交意向</div>
    <!-- 弹窗提示 -->
    <div class="promptWrap" v-if="showPromptWrap">
        <div class="promptBox">
            <h5>确定要取消发布团购买房吗？</h5>
            <ul>
                <li class="li1" @click="goLeave()">是</li>
                <li class="li2" @click="showPromptWrap = false">否</li>
            </ul>
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
name: "buyHouse",
    data () {
        return {
        	projectName: "", // 项目名称
            floorNumber: "", // 楼号
            roomNumber: "", // 单元房号
            buyerName: "", // 购房人姓名
            buyerTel: "", // 购房人电话
            sellName: "", // 销售人员电话
            sellTel: "", // 销售人员电话
            showPromptWrap: false, // 弹窗提示
        }
    },
    computed:{

    },
    methods:{
        // 点击返回按钮
        navBack(){  
            this.showPromptWrap = true;      
        },
        goLeave(){
            this.$router.push({path: '/home'});   
        },
        // 点击提交意向
        submitBtn(){
            let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if(this.sellTel != ""){
                if(!reg.test(this.sellTel)){
                    Toast({
                        message: '请输入正确手机号',
                        duration: 3000
                    });
                }else{
                    this.formData()
                }
            }else{
                this.formData();
            }
        },
        // 表单验证
        formData(){
            let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if(this.projectName == "" || this.floorNumber == "" || this.roomNumber == "" || this.buyerName == "" || this.buyerTel == ""){
                Toast({
                    message: '请输入相关信息',
                    duration: 3000
                });
            }else if(!reg.test(this.buyerTel)){
                Toast({
                    message: '请输入正确手机号',
                    duration: 3000
                });
            }else{
                let url = this.changeData() + '/member/auth/buyHouse'
                axios(url,{
                    method: 'post',
                    params: {
                        projectName: this.projectName, //string  是   项目名称
                        bulidingNo: this.floorNumber,  //string  是   楼号
                        unitNo: this.roomNumber,  //string  是   单元房号
                        buyerName: this.buyerName,  //string  是   购房人姓名
                        buyerPhone: this.buyerTel,  //string  是   购房人电话
                        saleName: this.sellName,    //string  否   项目销售人姓名
                        salePhone: this.sellTel   //string  否   项目销售人电话
                    }
                }).then(data => {
                    // console.log(data);
                    if(data.data.code == 101){
                        Toast({
                            message: '提交成功',
                            duration: 3000
                        });
                        this.$router.push({path: '/home'}); 
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
        // 获取用户信息
        userData(){
            let url = this.changeData() + '/member/auth/getMemberInfo'
            axios(url,{
                method: 'post',
            }).then(data => {
                // console.log(data);
                // this.userDataObj = data.data.memberInfo;
                this.buyerName = data.data.memberInfo.name;
                this.buyerTel = data.data.memberInfo.phone;
                console.log(this.userDataObj);
            }).catch(err => {
                console.log(err)
            });
        }
        
    },
    mounted() {
        this.userData();
        
    },
    created() {
        
    }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../static/css/commonNav.css";
.buyHouse{
	width: 7.5rem;
}
.buyHouseWrap{
    width: 6.9rem;
    height: 6.3rem;
    padding: 1rem .3rem 0 .3rem ;
    background: #fff;
    ul{
        li{
            width: 6.9rem;
            height: .9rem;
            border-top: 1px solid #eaeaea;
            line-height: .9rem;
            box-sizing: border-box;
            p{
                width: 2.9rem;
                float: left;
                color: #333;
                font-size: .3rem;
            }
            input{
                width: 4rem;
                line-height: .4rem;
                background: transparent;
                font-size: .28rem;
                color: #333;
            }
        }
        .buyHouseLi1{
            border-top: none;
        }
    }
}
</style>
