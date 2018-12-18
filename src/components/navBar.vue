<template>
    <div class="navBar">
        <div class="nav-class">
            <dl class="dl1">
                <router-link to='/home' active-class="active1">
                    <dd>
                        <i class='icon1'></i>
                    </dd>
                    <dt>首页</dt>
                </router-link>
            </dl>
            <dl class="dl2">
                <router-link to='/events' active-class="active2">
                    <dd>
                        <i class='icon2'></i>
                    </dd>
                    <dt>活动</dt>
                </router-link>
            </dl>

            <dl class="dl3">
                <router-link to='/alliance' active-class="active3">
                    <dd>
                        <i class='icon3'></i>
                    </dd>
                    <dt>联盟</dt>
                </router-link>
            </dl>

            <dl class="dl4">
                <span>
                    <router-link to='/mine' active-class="active4">
                        <dd>
                            <i class='icon4'></i>
                        </dd>
                        <dt>我的</dt>
                    </router-link>
                </span>
            </dl>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
import axios from 'axios';
import qs from 'qs';
export default {
    name: 'navBar',
    components: {
       
    },
    data () {
        return {
          
        }
    },
    methods:{
        goMine(){
            if(!localStorage.token){
                Toast({
                    message: '请先登录',
                    duration: 2000
                });
                this.$router.push({path: '/login',query:{"url":"mine"}}); 
            }else{
                this.$router.push({path: '/mine'}); 
            }
        }
    },
    mounted() {
　　　　
    },
    created(){

    }
}
</script>

<style lang="scss" type="text/scss" scoped>
.navBar{
    width: 7.5rem;
    margin: 0 auto;
    .nav-class{
        width: 6.9rem;
        height: 1rem;
        background-color: #fff;
        position: fixed;
        bottom: -1px;
        color: #a5a5a5;
        font-size: 0.2rem;
        border: 1px solid #eaeaea;
        z-index: 100;
        padding: 0 .3rem;
        dl{
            width: 25%;
            float: left;
            text-align: center;
            padding-top: .1rem;
            a{
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                display: inline-block;
                width: 100%;
                height: 100%;
                dd{
                    height: 0.44rem;
                    width: 100%;
                    margin-top: .04rem;
                    margin-bottom: .04rem;
                    i{
                        display: inline-block;
                        height: 0.44rem;
                        width: 0.44rem;
                    }
                }
                dt{
                    font-size: .22rem;
                    font-weight: bold;
                }
            }
        }
    }
}
dt{
    color: #a5a5a5;
}
.icon1{
    background: url(../../static/images/common/dl1.png) no-repeat;
    background-size: 100% 100%;
}
.icon2{
    background: url(../../static/images/common/dl2.png) no-repeat;
    background-size: 100% 100%;
}
.icon3{
    background: url(../../static/images/common/dl3.png)no-repeat;
    background-size: 100% 100%;
}
.icon4{
    background: url(../../static/images/common/dl4.png)no-repeat;
    background-size: 100% 100%;
}

.active1 dt{color: #3c915c;}
.active1 .icon1{
    background: url(../../static/images/common/dl11.png)no-repeat;
    background-size: 100% 100%;
}
.active2 dt{color: #3c915c;}
.active2 .icon2{
    background: url(../../static/images/common/dl22.png)no-repeat;
    background-size: 100% 100%;
}
.active3 dt{color: #3c915c;}
.active3 .icon3{
    background: url(../../static/images/common/dl33.png)no-repeat;
    background-size: 100% 100%;
}
.active4 dt{color: #3c915c;}
.active4 .icon4{
    background: url(../../static/images/common/dl44.png)no-repeat;
    background-size: 100% 100%;
}
</style>
