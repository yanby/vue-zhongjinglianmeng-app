<template>
    <div class="user">
      <div class="nav" @click="back()"><span></span>个人信息</div>
      <div class="content">
        <ul>
          <li class="cur">头像 <div class="img"><img :src="imgsrc" alt="" :onerror="defaultImg"><input type="file" @change="uploadFun($event)"></div></li>
          <li>手机号 <span>{{iphone}}</span></li>
          <li>真实姓名 <b></b><input type="text" v-model="userName"></li>
          <li @click="actionsheet">性别 <b></b>
            <input readOnly='readOnly' type="text" placeholder="请选择性别" v-model="sexName">
            <mt-actionsheet
              :actions="sex"
              v-model="sexhide">
            </mt-actionsheet>
          </li>
          <li class="other">生日 <b></b>
            <input @click="openPicker" readOnly='readOnly' type="text" placeholder="请选择生日" v-model="birthday">
            <mt-datetime-picker
              type="date"
              ref="picker"
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日"
              @confirm="handleConfirm"
              :startDate="startDate"
            >
            </mt-datetime-picker></li>
          <li>所在公司 <b></b><input type="text" v-model="company"></li>
          <li>职位 <b></b><input type="text" v-model="userduty"></li>
        </ul>
      </div>
      <div class="confirm" @click="confirmFun()">完成</div>
    </div>
</template>

<script>
import { Toast,Actionsheet  } from 'mint-ui';
import axios from 'axios';
import qs from 'qs';
export default {
    data () {
        return {
           sex:[
             {name: "男",method:this.getman},
             {name: "女",method:this.getwomen},
           ],
            iphone: "",
            sexhide: false,
            userName:"",//姓名
            sexName: "男/女",//性别
            userduty: "",//职务
            imgsrc:"../../../static/images/mine/user.png",//图像
            birthday: "请选择出生年月",//日期
            company: "",//公司
            startDate: new Date('1900-01-01'),
            memberInfo: "",//个人信息
            //上传图片要用
            host: "",
            policy:"",
            signature: "",
            accessid: "",
            dir: "",
            expire: "",
            callback: "",
            fileImg: "",
            defaultImg: 'this.src="' + require('../../../static/images/mine/user.png') + '"'
        }
    },
    computed:{

    },
    mounted() {
      this.init();
      this.ossData();
    },
    methods:{
      init(){
        this.$http({
          url: this.changeData() + "/member/auth/getMemberInfo",
          method: "post",
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.memberInfo = res.data.memberInfo;
            this.iphone = this.memberInfo.phone.substr(0,3)+"****"+this.memberInfo.phone.substr(7);
            this.imgsrc = this.memberInfo.iconPath;
            this.userName = this.memberInfo.name;
            this.company = this.memberInfo.company;
            this.userduty = this.memberInfo.position;
            this.birthday  = this.memberInfo.birthday;
            if(this.memberInfo.sex == 0){
              this.sexName = "女";
            }else{
              this.sexName = "男";
            }
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log("收藏页面错误：",err)
        })
      },
      back(){
        this.$router.go(-1);
      },
      getman(){
        this.sexName = "男";
      },
      getwomen(){
        this.sexName = "女";
      },
      actionsheet(){
        this.sexhide = true;
      },
      openPicker() {
        this.$refs.picker.open()
      },
      handleConfirm (data) {
        this.birthday = data;   //获取的时间为时间戳，getdata是自己写的一个转换时间的方法
        var d = new Date(data);
        this.birthday = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      },
      ossData() {
        let url = this.changeData() + '/oss/policy'
        axios(url, {
          method: 'post',
          url: url
        }).then(ret => {
          console.log(ret);
          this.host = ret.data.host;
          this.policy = ret.data.policy;
          this.signature = ret.data.signature;
          this.accessid = ret.data.accessid;
          this.dir = ret.data.dir;
          this.expire = ret.data.expire;
          this.callback = ret.data.callback;
        }).catch(err => {
          console.log(err)
        });
      },
      uploadFun(e){
        let _this = this;

        //1. 拿到fileinput里面的文件, 这个file是一个file对象， file对象不能直接展示的
        var file = e.target.files[0];
        //需要把本地的file上传到阿里云
        this.fileImg = file;
        // console.log(file);

        //2. 读取文件，成功img标签可以直接使用的格式
        //FileReader类就是专门用来读文件的
        var reader = new FileReader();

        //3. 开始读文件
        //readAsDataURL: dataurl它的本质就是图片的二进制数据， 进行base64加密后形成的一个字符串， 这个字符串可以直接作用img标签的图片资源使用
        reader.readAsDataURL(file);

        //4. 因为文件读取是一个耗时操作， 所以它在回调函数中，才能够拿到读取的结果
        reader.onload = function() {
          // console.log(reader.result);
          //直接使用读取的结果
          _this.imgsrc = reader.result;
        }
      },
      random_string(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      confirmFun(){
        let _this = this;
        var ossData = new FormData();
        ossData.append('OSSAccessKeyId', _this.accessid);
        ossData.append('policy', _this.policy);
        ossData.append('Signature', _this.signature);
        //上传阿里云需要一个动态的random
        ossData.append('key', _this.dir + _this.random_string(32));
        ossData.append('success_action_status', 200); // 指定返回的状态码
        ossData.append("callback", _this.callback);
        ossData.append("file", _this.fileImg);
        this.$http.post(this.host, ossData, { headers: { "Content-Type": "multipart/form-data" } })
          .then(res => {
            console.log(res);
            _this.imgsrc = res.data.fileName;

            if(_this.imgsrc){
              _this.upData();
            }
          }).catch(err => {
          console.log(err)
        });
      },
      upData() {
        this.$http({
          url: this.changeData() + "/member/auth/perfectMemberInfo",
          method: "post",
          params: {
            name: this.userName,
            sex: this.sexName,
            position: this.userduty,
            birthday: this.birthday,
            company: this.company,
            iconPath: "/" + this.imgsrc
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            Toast("保存成功")
            this.$router.push({path:"/mine"})
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log(err)
        })
      }
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .user{
    margin-top: 1rem;
    position: relative;
    .title{
      background: #fff;
      height: .8rem;
      line-height: .8rem;
      font-size: 0;
      text-align: center;
      border-bottom: .01rem solid #eaeaea;
      span{
        display: inline-block;
        width: 50%;
        height: .8rem;
        font-size: .3rem;
        position: relative;
        &.cur{
          b{
            display: block;
          }
        }
        b{
          display: none;
          position: absolute;
          width: .84rem;
          height: .04rem;
          left: 50%;
          margin-left: -.42rem;
          bottom: 0;
          background: #3C915C;
        }
      }
    }
    .content{
      margin-top: 1rem;
      padding: 0 .3rem;
      background: #fff;
      ul{
        li{
          height: .9rem;
          line-height: .9rem;
          font-size: .3rem;
          border-bottom: .01rem solid #EAEAEA;
          position: relative;
          span{
            float: right;
          }
          b{
            position: absolute;
            width: 0.15rem;
            height: 0.24rem;
            right: 0;
            top: .33rem;
            background: url("../../../static/images/mine/you.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          input,i{
            float: right;
            width: 2rem;
            height: .88rem;
            line-height: .88rem;
            font-size: .28rem;
            text-align: right;
            margin-right: .2rem;
          }
          &.other{
            input{
              position: absolute;
              right: 0;
              top: 0;
            }
          }
          &.cur{
            height: 1.41rem;
            line-height: 1.41rem;
            .img{
              float: right;
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              position: relative;
              img{
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
              }
              input{
                position: absolute;
                top: .2rem;
                right: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
              }
            }
          }
        }
      }
    }
    .confirm{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 7.5rem;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      background: #3C915C;
      font-size: .34rem;
    }
  }
</style>
