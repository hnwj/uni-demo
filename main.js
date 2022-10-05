import App from './App'

// #ifndef VUE3
import Vue from 'vue'
// 按需导入 $http 对象
import {
	$http
} from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = 'https://api-ugo-web.itheima.net'

// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
	})
}

// 请求完成之后做一些事情，关闭数据加载
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装 uni.$showMsg() 方法
uni.$showMsg = function(title = "数据加载失败！", duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
