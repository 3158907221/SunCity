import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import home from "@/views/Home.vue";

import welcome from "@/components/Welcome.vue";

import fillIn from "@/views/accountBalance/fillIn.vue";

import balanceDetail from "@/views/accountBalance/detail.vue";

import fundsDetail from "@/views/funds/detail.vue";


Vue.use(VueRouter);


const routes = [
	{
		path: "/",
		component: home,
		name: "Home",
		meta: {
	        title: "首页" ,
	        hasSubMenu: false, // 是否包含子菜单，false 没有子菜单；true 有子菜单
		},
		children: [
			{
				path: '/home',
				component: welcome
			}
		]
	},
	{
		path: '/accountBalance',
		component: home,
		name: 'accountBalance',
		meta: {
			title: '账户余额表',    // 菜单标题
			hasSubMenu: true,   // 是否包含子菜单
		},
		children: [
			{
				path: '/accountBalance/fillIn',
				name: 'fillIn',
				meta: {
					title: '账户余额填报',    // 菜单标题,
					hasSubMenu: false    // 是否包含子菜单
				},
				component: fillIn,
			},
			{
				path: '/accountBalance/detail',
				name: 'accountBalanceDetail',
				meta: {
					title: '账户余额明细查询',    // 菜单标题,
					hasSubMenu: false    // 是否包含子菜单
				},
				component: balanceDetail,
			},
		]
	},
	{
		path: '/fundsExpenditure',
		component: home,
		name: 'fundsExpenditure',
		meta: {
			title: '资金收支报表',    // 菜单标题
			hasSubMenu: true,   // 是否包含子菜单
		},
		children: [
			{
				path: '/funds/detail',
				name: 'fundsDetail',
				meta: {
					title: '收支明细报表',    // 菜单标题
					hasSubMenu: false    // 是否包含子菜单
				},
				component: fundsDetail,
			},
		]
	}
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 重写路由的push方法
const vueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return vueRouterPush.call(this, location).catch((error) => error);
};


router.beforeEach((to, from, next) => {
    next();
  // if (to.matched.length === 0) {
  //   next("/welcome");
  // } else {
  //   if (Vue.prototype.$CommonUtil.Cookie.getProlongUser() !== null || to.query.token) {
  //     next();
  //     if (to.path !== "/welcome") {
  //       store.commit("openTab", to);
  //     }
  //   } else {
  //     Vue.prototype.$CommonUtil.relogin("route Cookie.getProlongUser() === null && !to.query.token");
  //   }
  // }
});

export default router;
