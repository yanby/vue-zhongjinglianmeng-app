// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Mint from 'mint-ui'
import axios from "axios"
import Qs from "qs"
import QRCode from 'qrcode'     //引入生成二维码组件
import router from './router'
import store from './store/index.js'
import host from '../static/js/host/host.js'
// import VueAxios from 'vue-axios'

import 'mint-ui/lib/style.css'
import 'babel-polyfill'

Vue.use(Mint);
Vue.use(host);
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

import { Toast } from 'mint-ui';
// var axios_instance = axios.create({
//   baseURL:'http://test-api-mpb.yingshangchina.com',
//   transformRequest: [function (data) {
//     data = Qs.stringify(data);
//     return data;
//   }]
// });
// Vue.use(VueAxios, axios_instance);


//http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers["access-token"]  = localStorage.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

//http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.code == 202){
      localStorage.clear();
      Toast("登录超时，请重新登录")
      router.replace({
        path: 'login',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)   // 返回接口返回的错误信息
  });



/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    host,
    components: { App },
    template: '<App/>',
    render: h => h(App),
    // mounted () {
    //   document.dispatchEvent(new Event('render-event'))
    // }
})

