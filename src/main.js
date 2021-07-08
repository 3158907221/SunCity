import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import echarts from "echarts";
import CommonUtil from "./CommonUtil";
import Contextmenu from "./components/other/Contextmenu/index";
import "./assets/css/styleCss.css"

Vue.config.productionTip = false;

var axios = require("axios");
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// 请求拦截器，检查前端登录cookie
let lastLoginOutDate = new Date(0);
axios.interceptors.request.use((config) => {
  // console.log(config.url);
  if (config.url !== "/api/sys/getUserByToken") {
    if (CommonUtil.Cookie.getProlongUser() === null) {
      let current = new Date();
      if (current.getTime() - lastLoginOutDate.getTime() > 1000) {
        lastLoginOutDate = current;
        // Vue.prototype.$message("用户未登录，请先登录。");
        // CommonUtil.relogin("axios.interceptors.request Cookie.getProlongUser() === null");
      }
      return null;
    }
    config.headers.token = CommonUtil.Cookie.getProlongUser().token;
  }
  return config;
});

// 响应拦截器，后端登录验证
axios.interceptors.response.use((response) => {
  if (response.data.code === 401) {
    let current = new Date();
    if (current.getTime() - lastLoginOutDate.getTime() > 1000) {
      lastLoginOutDate = current;
      CommonUtil.Cookie.removeUser();
      Vue.prototype.$message("用户未登录，请先登录。");
      CommonUtil.relogin("axios.interceptors.response response.data.code === 401");
    }
  }
  return response;
});

Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$CommonUtil = CommonUtil;
CommonUtil.axios = axios;
CommonUtil.store = store;
CommonUtil.router = router;
CommonUtil.Vue = Vue;

// 添加日期格式化方法
Date.prototype.format = function(fmt) {
  return CommonUtil.formatDate(this, fmt);
};

Date.prototype.clearPartTime = function() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  this.setMilliseconds(0);
  return this;
};

Date.prototype.clearPartDay = function() {
  this.setDate(1);
  return this;
};

Date.prototype.offsetTime = function(offset) {
  this.setTime(this.getTime() + offset);
  return this;
};

Number.prototype.round = function(fractionDigits) {
  return parseFloat((this + Number.EPSILON).toFixed(fractionDigits));
};

Number.prototype.toRound = function(fractionDigits) {
  return (this + Number.EPSILON).toFixed(fractionDigits);
};

// 整数，修复小数尾部 0.3-0.2=0.09999999999999998
Number.prototype.fixFloatTail = function(fractionDigits) {
  return parseFloat(this.toFixed(fractionDigits === undefined ? 6 : fractionDigits));
};

//定义一个时间过滤器
Vue.filter("dateFormat", (date, fmt) => {
  return date.format(fmt);
});

Vue.use(ElementUI);
Vue.use(Contextmenu);

//使用Vue.mixin的方法拦截了路由离开事件，并在该拦截方法中实现了销毁页面缓存的功能。
Vue.mixin({
  beforeRouteLeave(to, from, next) {
    for (let i = 0; i < this.$store.state.tabList.length; ++i) {
      if (this.$store.state.tabList[i].path === from.path) {
        if (this.$store.state.tabDestory) {
          this.$store.commit("setTabDestory", false);
          // 如果直接调用this.$destroy(); 再次打开时会失去keep-alive特性
          if (this.$vnode && this.$vnode.data.keepAlive) {
            if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
              if (this.$vnode.componentOptions) {
                let key = this.$vnode.key == null ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : "") : this.$vnode.key;
                let cache = this.$vnode.parent.componentInstance.cache;
                let keys = this.$vnode.parent.componentInstance.keys;
                if (cache[key]) {
                  if (keys.length) {
                    let index = keys.indexOf(key);
                    if (index > -1) {
                      keys.splice(index, 1);
                    }
                  }
                  delete cache[key];
                }
              }
            }
          }
          this.$destroy();
        }
        break;
      }
    }
    next();
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
