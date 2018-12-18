<template>
    <div class="user">
      <div class="nav"><span @click="back()"></span>完善资料 <router-link to="/home">跳过</router-link></div>
      <div class="content">
        <div class="upload">
          <ol v-if="imgList.length">
            <li v-for="(item,index) in imgList">
              <img :src="item.file.src" alt="">
              <img class="del" src="../../../static/images/mine/close.png" @click.stop="delImg(index)"/>
            </li>
          </ol>
          <div class="img"><img :src="imgsrc" alt=""><input type="file" @change="uploadFun($event)"></div>
        </div>
        <ul>
          <li><i>手机号</i><span>{{iphone}}</span></li>
          <li><i>真实姓名</i><input type="text" v-model="userName" placeholder="请输入真实姓名"></li>
          <li @click="actionsheet"><i>性别</i><b></b><input type="text" placeholder="请选择性别" v-model="sexName">
            <mt-actionsheet
              :actions="sex"
              v-model="sexhide">
            </mt-actionsheet>
          </li>
          <li @click="openPicker"><i>生日</i><b></b><input type="text" placeholder="请选择生日" v-model="birthday">
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
          <li><i>所在公司</i><input type="text" v-model="company" placeholder="请输入所在公司"></li>
          <li><i>职位</i><input type="text" v-model="userduty" placeholder="请输入职位"></li>
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
            sexName: "",//性别
            userduty: "",//职务
            imgsrc:"../../../static/images/mine/wanshang.png",//图像
            birthday: "",//日期
            company: "",//公司
            startDate: new Date('1968-01-01'),
            //上传图片要用
            host: "",
            policy:"",
            signature: "",
            accessid: "",
            dir: "",
            expire: "",
            callback: "",
            fileImg: "",
            imgList: [],
            imgArr: []
        }
    },
    computed:{

    },
    mounted() {
      this.ossData();
      this.iphone = localStorage.iphone.substr(0,3)+"****"+localStorage.iphone.substr(7);
    },
    methods:{
      back(){
        this.$router.push({path:"/mine"});
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
        console.log(e)
        //如果选了照片就遍历循环，没有选就退出
        if(e.target.files[0].size){
          let files = e.target.files;
          for (let i = 0; i < files.length; i++) {
            this.fileAdd(files[i]);
          }
        }else{
          return;
        }
      },
      //图片上传本地
      fileAdd(file){
        console.log(file)
        var that = this;
        // this.imgArr.push({file});
        //如果上传的不是图片提示，否则显示出来
        if (file.type.indexOf('image') == -1) {
          this.$dialog.toast({mes: '请选择图片文件'});
        } else {
          let reader = new FileReader();
          let image = new Image();
          let _this = this;
          reader.readAsDataURL(file);
          reader.onload = function () {
            file.src = this.result;
            that.imgList.push({file});
            image.src= file.src;
          }
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
        for (var i = 0; i < this.imgList.length; i++){
          var ossData = new FormData();
          ossData.append('OSSAccessKeyId', _this.accessid);
          ossData.append('policy', _this.policy);
          ossData.append('Signature', _this.signature);
          //上传阿里云需要一个动态的random
          ossData.append('key', _this.dir + _this.random_string(32));
          ossData.append('success_action_status', 200); // 指定返回的状态码
          ossData.append("callback", _this.callback);
          ossData.append("file", _this.imgList[i].file);
          console.log(_this.imgList)
          this.$http.post(this.host, ossData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(res => {
              console.log(res);
              //返回地址如果后台没加/,需要加个/
              _this.imgsrc = "/" + res.data.fileName;
              //把地址添加到数组中
              _this.imgArr.push(_this.imgsrc);
              //转化成字符串上传给后台
              _this.imgArr = _this.imgArr.join(",");

              if(_this.imgsrc){
                _this.upData();
              }
            }).catch(err => {
            console.log(err)
          });
        }
      },
      upData() {
        console.log(this.imgArr)
        this.$http({
          url: this.changeData() + "/member/auth/perfectMemberInfo",
          method: "post",
          params: {
            name: this.userName,
            sex: this.sexName,
            position: this.userduty,
            birthday: this.birthday,
            company: this.company,
            iconPath: this.imgArr
          }
        }).then(function(res){
          console.log(res);
          if(res.data.code=="101"){
            this.$router.push({path:"/home"})
          }else{
            Toast(res.data.message)
          }
        }.bind(this)).catch(function(err){
          console.log(err)
        })
      },
      delImg(index) {
        this.imgList.splice(index, 1);
      },
    },
}
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../../static/css/common.scss";
  .user{
    margin-top: 1rem;
    position: relative;
    .nav{
      a{
        position: absolute;
        top: 0rem;
        right: .2rem;
        font-size: .3rem;
        color: #fff;
      }
    }
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
      background: #fff;

      .upload{
        overflow: hidden;
        .img{
          padding-top: .3rem;
          width: 1.86rem;
          height: 1.86rem;
          /*text-align: center;*/
          float: left;
          position: relative;
          img{
            width: 1.86rem;
            height: 1.86rem;
          }
          input{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }

        }
        ol{
          float: left;
          overflow: hidden;
          padding-top: .3rem;
          li{
            float: left;
            position: relative;
            img{
              border-radius: 50%;
              width: 1.86rem;
              height: 1.86rem;
            }
            .del{
              width: 0.38rem;
              height: 0.38rem;
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }

      ul{
        padding: 0 .3rem;
        li{
          height: .9rem;
          line-height: .9rem;
          font-size: .3rem;
          border-bottom: .01rem solid #EAEAEA;
          i{
            display: inline-block;
            width: 1.8rem;
          }
          span{
            float: right;
          }
          b{
            width: 0.24rem;
            height: 0.15rem;
            margin-top: .4rem;
            float: right;
            background: url("../../../static/images/mine/xia.png") no-repeat;
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
          }
          input{
            font-size: .28rem;
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
