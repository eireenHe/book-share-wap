import '../static/sdk/ald-stat'

import Vue from 'vue'
import App from './App'
import Fly from 'flyio/dist/npm/wx'
import store from '@/utils/store'

import 'mpvue-weui/src/style/weui.css'

App.mpType = 'app'
Vue.config.productionTip = false
Vue.prototype.$http = new Fly()
Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()
