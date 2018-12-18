function getUrlId(name){
  var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
  var result = window.location.search.substr(1).match(reg);
  return result?decodeURIComponent(result[2]):null;
}

function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

//正则验证手机号
function isPoneAvailable(str) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}


//获得年月日      得到日期oTime
function getMyDate(str){
  function getzf(num){
    if(parseInt(num) < 10){
      num = '0'+num;
    }
    return num;
  }
  var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth()+1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
  return oTime;
};
//补0操作




//获得年月日      得到日期oTime
function getNewDate(str){
  function getzf(num){
    if(parseInt(num) < 10){
      num = '0'+num;
    }
    return num;
  }
  var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth()+1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);//最后拼接时间
  return oTime;
};

//判断是不是微信浏览器
function isWeiXin(){
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    return true;
  }else{
    return false;
  }
}

//去除空格
function Trim(str)
{
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
//正则验证手机号
function isPoneAvailable(str) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

//60s倒计时
var countdown;
function settime(val) {
  if (countdown == 0) {
    val.removeAttribute("disabled");
    val.value = "免费获取验证码";
    countdown = 60;
  } else {
    val.setAttribute("disabled", true);
    val.value = "重新发送(" + countdown + ")";
    countdown--;
    setTimeout(function () {
      settime(val)
    }, 1000)
  }
}

