import Vue from 'vue'
import Router from 'vue-router'
import AppLogin from '@/components/login/AppLogin'
import AppUsers from '@/components/user/AppUsers'
import AppHello from '@/components/AppHello'
import AppRights from '@/components/rights/AppRights'
import AppRelos from '@/components/rights/AppRelos'
import AppGoodsList from '@/components/goods/AppGoodsList'
import AppGoodsAdd from '@/components/goods/AppGoodsAdd'
import AppGoodsEdit from '@/components/goods/AppGoodsEdit'
import AppGoodsParams from '@/components/goods/AppGoodsParams'
import AppOrders from '@/components/orders/AppOrders'
import AppReports from '@/components/reports/AppReports'



//导入提示框
import { Message } from 'element-ui';


//引入页面
import AppHome from '@/components/AppHome'


Vue.use(Router)
//安装moment 时间转换
Vue.use(require('vue-moment'))



const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AppLogin
    },
    {
      path: '/',
      name: 'home',
      component: AppHome,
      children:[
        {
          name: '/',
          path: `/Hello`,
          component: AppHello
        }
        ,
       {
        name: '/users',
        path: `/users`,
        component: AppUsers
      },{
        name: '/rights',
        path: `/rights`,
        component: AppRights
      },{
        name: '/roles',
        path: `/roles`,
        component: AppRelos
      },{
        name: '/goods',
        path: `/goods`,
        component: AppGoodsList
      },{
        path: '/goodsAdd',
        name: '/goodsAdd',
        component: AppGoodsAdd
      },{
        path: '/goodsedit',
        name: '/goodsedit',
        component: AppGoodsEdit
        
      },{
        path: '/params',
        name: '/params',
        component: AppGoodsParams
        
      }
      ,{
        path: '/orders',
        name: '/orders',
        component: AppOrders
      } ,{
        path: '/reports',
        name: '/reports',
        component: AppReports
      }
      ]
    },
  ] 
})

//路由守卫
router.beforeEach((to, from, next) => {
    if (to.name==='login') {
            next()
  }else{    
  let token = localStorage.getItem('token')
      if (!token) { //true 没有登录 token = null 为空 
        Message.warning('请先登录') 
        //为空  跳转登录’
         router.push({
              name: 'login'
          }) 
          return
 }
}
next()
})

export default router