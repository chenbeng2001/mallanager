import Vue from 'vue'
//引入整个Element
import ElementUI from 'element-ui';
//导入对应的CSS
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
//引入CSS
import '@/assets/css/layut.css'
//导入axios 
import http from '@/plugins/http'
//导入全局组件
import cusBreadcrumb from '@/components/commons/cusBreadcrumb'


//是否产生环境 ？（ false 开发环境 项目环境输出会多一些 ）
Vue.config.productionTip = false
//安装ElementUI
Vue.use(ElementUI)
//安装 axios
Vue.use(http)
// 全局 组件
Vue.component('cusBreadcrumb',cusBreadcrumb)





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
