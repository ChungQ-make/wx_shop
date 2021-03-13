import Vue from 'vue'
import App from './app'
import Fly from 'flyio/dist/npm/wx'
import 'weui-miniprogram/miniprogram_dist/weui-wxss/dist/style/weui.wxss'
import '../static/css/iconfont.css'
import moment from 'moment'
// import _ from 'lodash'
// 设置vue的提示功能关闭
Vue.config.productionTip = false

// ! 挂载lodash
// Vue.prototype._ = _

// ! 挂载moent时间格式转换插件
Vue.prototype.$moment = moment

// 声明当前组件的类型(应用类型)
App.mpType = 'app'

// ! 配置flyio
const fly = new Fly()
// ! 添加拦截器
let ajaxTimes = 0
fly.interceptors.request.use((config, promise) => {
  // 加载中的效果实现
  ajaxTimes++
  wx.showLoading({
    title: '加载中',
    // 蒙版屏蔽
    mask: true
  })
  // 给所有请求添加自定义header
  config.headers['Authorization'] = wx.getStorageSync('token')
  return config
})
fly.interceptors.response.use((config, promise) => {
  ajaxTimes--
  if (ajaxTimes === 0) {
    //  关闭效果
    wx.hideLoading()
  }
  return config
})

// 配置请求基地址
fly.config.baseURL = 'http://localhost:5000/api/public/v1'
// 挂载至原型对象上
Vue.prototype.$fly = fly

// 生成应用实例
const app = new Vue(App)

//  挂载整个应用（生效）
app.$mount()
