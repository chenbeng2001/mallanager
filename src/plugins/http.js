// 使用axios 插件（本省属于第三方库，与vue没有任何区别）  封装成Vue插件
import axios from 'axios'

// 1.定义插件 
const MyPlugin={}


// 2.开发插件
MyPlugin.install = function (Vue, options) {
    //  基准地址
     axios.defaults.baseURL="http://localhost:8888/api/private/v1/"
   
     //全局储存 token 里面的值  bug ？ axios 只加载一次
    //  let AUTH_TOKEN=localStorage.getItem('token')
    //  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
   //添加拦截器 （每一次请求）
   // 添加请求拦截器
          axios.interceptors.request.use(function (config) {
            if (config.url!=='login') {
                let AUTH_TOKEN=localStorage.getItem('token')
                // config.headers(在当前请求下) 加入AUTH_TOKEN
                config.headers['Authorization']=AUTH_TOKEN
            }   
          // 在发送请求之前做些什么
            return config;
          }, function (error) {
         // 对请求错误做些什么
           return Promise.reject(error);
  });
    // . 添加实例属性
    Vue.prototype.$http = axios
    }
    // 导出
    export default MyPlugin 
       
 