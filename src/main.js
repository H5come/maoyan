// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
//import VueRouter from 'vue-router'
import router from './router'
import App from './App'
import {AjaxPlugin} from 'vux'
import {WechatPlugin} from 'vux'
import stores from './store/store.js'  
import qs from 'qs'
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
FastClick.attach(document.body)
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
		Vue.http.get("/wemovie/login.php?action=checkLogin").then(res=>{
				if(res.data.code==401){
					window.location.href="/wemovie/login.php";
				}else{
					next() 
				}
			})

})
//router.afterEach((to,from,next)=>{
//	 setTimeout(() => {
//	    window.scrollTo(0,0);
//	 },500)
//})
Vue.http.interceptors.request.use(function(config){  
    stores.dispatch('showloader');
    config.data = qs.stringify(config.data);
    return config  
},function(err){  
    return Promise.reject(err)  
});  
Vue.http.interceptors.response.use(function(response){  
    stores.dispatch('hideloader')  
    return response  
},function(err){  
    return Promise.reject(err)  
});  


Vue.http.get("/wemovie/wxscancode.php?act=getScanParams").then((res) => {
	if(res.data.code == 200) {
		var appId = res.data.data.appId;
		var nonceStr = res.data.data.nonceStr;
		var signature = res.data.data.signature;
		var timestamp = res.data.data.timestamp;
		Vue.wechat.config({
//		  debug: true,
			appId: appId,
			timestamp: timestamp,
			nonceStr: nonceStr,
			signature: signature,
			jsApiList: [
				// 所有要调用的 API 都要加到这个列表中
				'scanQRCode',
				'openLocation',
                'getLocation'
			]
		})
	}
});
/* eslint-disable no-new */
new Vue({
  router,
store:stores,
  render: h => h(App)
}).$mount('#app-box')
var wAlert = window.alert;    
//去掉alert显示网址
window.alert = function (message) {    
    try {    
        var iframe = document.createElement("IFRAME");    
        iframe.style.display = "none";    
        iframe.setAttribute("src", 'data:text/plain,');    
        document.documentElement.appendChild(iframe);    
        var alertFrame = window.frames[0];    
        var iwindow = alertFrame.window;    
        if (iwindow == undefined) {    
            iwindow = alertFrame.contentWindow;    
        }    
        iwindow.alert(message);    
        iframe.parentNode.removeChild(iframe);    
    }    
    catch (exc) {    
        return wAlert(message);    
    }    
}    