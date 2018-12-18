import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/index.js"

// 一级路由
import NavBar from '@/components/navBar'

//首页
import Home from '@/components/home/home'
//活动
import Events from '@/components/events/events'
import ApplyDetail from '@/components/events/applyDetail'
import ReviewDetail from '@/components/events/reviewDetail'
import Apply from '@/components/events/apply'
//我的
import Word from '@/components/mine/word'
import Mine from '@/components/mine/mine'
import Message from '@/components/mine/message'
import Renew from '@/components/mine/renew'
import Dues from '@/components/mine/dues'
import Standard from '@/components/mine/standard'
import User from '@/components/mine/user'
import Perfect from '@/components/mine/perfect'
import Perfect1 from '@/components/mine/perfect1'
import Order from '@/components/mine/order'
import Join from '@/components/mine/join'
import Event from '@/components/mine/event'
import Need from '@/components/mine/need'
import Collect from '@/components/mine/collect'
import About from '@/components/mine/about'
//联盟
import Alliance from '@/components/alliance/alliance'
import Alliance1 from '@/components/alliance/alliance1'
//登录
import Login from '@/components/login/login'
// 支付
import Pay from '@/components/pay/pay'
import PayConfirm from '@/components/pay/payConfirm'



// 首页模块
import BuyHouse from '@/components/home/buyHouse' //团购买房
import Announcement from '@/components/home/announcement' //联盟公告
import AnnouncementInfo from '@/components/home/announcementInfo' //联盟公告详情
import News from '@/components/home/news' //联盟资讯
import NewsInfo from '@/components/home/newsInfo' //联盟资讯详情
import JoinAlliance from '@/components/joinAlliance/joinAlliance' //加入联盟
import MemberBenefits from '@/components/memberBenefits/memberBenefits' //会员权益
import JoinExecutiveDirector from '@/components/memberBenefits/joinExecutiveDirector' //成为常务理事
// 联盟模块
import AllianceOne from '@/components/alliance/allianceOne'
import AllianceTwo from '@/components/alliance/allianceTwo'
//会员需求模块
import MemberNeeds from '@/components/memberNeeds/memberNeeds' //会员需求
import FindProject from '@/components/memberNeeds/findProject' //找项目
import FindFund from '@/components/memberNeeds/findFund' //找资金
import FindJob from '@/components/memberNeeds/findJob' //找工作


Vue.use(Router)

const router =  new Router({
  // base: "/",
  mode: "history",
  scrollBehavior: ()=>({y:0}),//路由切换以后返回到顶部
  routes: [

    {path: '*',name:'navBar',redirect: "/home",component: NavBar,
        children:[
          {path: '/home',component: Home},
          {path: '/events',component: Events,meta:{keepAlive: true}},
          {path: '/alliance',component: Alliance},
          {path: '/alliance1',component: Alliance1},
          {path: '/mine',component: Mine}
        ]
    },
    //活动
    {path: '/applyDetail',component: ApplyDetail},//活动详情
    {path: '/reviewDetail',component: ReviewDetail},//活动详情
    {path: '/apply',component: Apply},//报名活动
    //我的
    {path: '/word',component: Word},//文档
    {path: '/message',component: Message},//消息
    {path: '/user',component: User},//修改信息
    {path: '/perfect',component: Perfect},//完善信息
    {path: '/perfect1',component: Perfect1},//完善信息
    {path: '/renew',component: Renew},//会员续费
    {path: '/dues',component: Dues},//会费标砖
    {path: '/standard',component: Standard},//
    {path: '/order',component: Order},//我的订单
    {path: '/join',component: Join},//我的加盟
    {path: '/event',component: Event},//我的活动
    {path: '/need',component: Need},//会员需求
    {path: '/collect',component: Collect},//我的收藏
    {path: '/about',component: About},//关于优铺
    // 首页模块
    {path: '/buyHouse',component: BuyHouse}, //团购买房
    {path: '/announcement',component: Announcement}, //联盟公告
    {path: '/announcementInfo',component: AnnouncementInfo}, //联盟公告详情
    {path: '/news',component: News}, //联盟资讯
    {path: '/newsInfo',component: NewsInfo}, //联盟资讯详情
    {path: '/joinAlliance',component: JoinAlliance}, //加入联盟
    {path: '/memberBenefits',component: MemberBenefits}, //会员权益
    {path: '/joinExecutiveDirector',component: JoinExecutiveDirector}, //成为常务理事
    // 联盟模块
    {path: '/allianceOne',component: AllianceOne},
    {path: '/allianceTwo',component: AllianceTwo},
    // 会员需求模块
    {path: '/memberNeeds',component: MemberNeeds}, //会员需求
    {path: '/findProject',component: FindProject}, //找项目
    {path: '/findFund',component: FindFund}, //找资金
    {path: '/findJob',component: FindJob}, //找工作
    // 登录
    {path: '/login',component: Login},
    // 支付
    {path: '/pay',component: Pay},
    {path: '/payConfirm',component: PayConfirm},

  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = Number(localStorage.scrollTop);
      }
      return { x: 0, y: to.meta.savedPosition || 0}
    }
  }
})

export default router;
