import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    permList: null, // 权限表
    tabList: [], // tab 缓存路由数组
    tabPath: "", // 当前路由
    tabDestory: false, // 路由缓存销毁标记
  },
  
  mutations: {
    // 设置权限表
    setPermList(state, permList) {
      state.permList = permList;
    },

    // 设置当前激活的tab
    setTabPath(state, path) {
      state.tabPath = path;
    },

    // 打开一个菜单时
    openTab(state, to) {
      for (let i = 0; i < state.tabList.length; ++i) {
        if (state.tabList[i].path === to.path) {
          state.tabPath = to.path;
          return;
        }
      }
      state.tabList.push({ path: to.path, name: to.meta.title });
      state.tabPath = to.path;
    },

    // 关闭一个菜单时
    closeTab(state, data) {
      for (let i = 0; i < state.tabList.length; ++i) {
        if (state.tabList[i].path === data.del) {
          if (data.cur !== data.del) {
            router.push({ path: data.cur });
          } else {
            if (state.tabList.length === 1) {
              router.push({ path: "/" });
            } else if (i + 1 < state.tabList.length) {
              router.push({ path: state.tabList[i + 1].path });
            } else {
              router.push({ path: state.tabList[i - 1].path });
            }
          }
          state.tabList.splice(i, 1);
          break;
        }
      }
    },

    // 清空菜单选项
    clearTab(state) {
      state.tabList = [];
      state.tabPath = "";
    },

    // 设置销毁标记
    setTabDestory(state, isDestory) {
      state.tabDestory = isDestory;
    },
  },

  actions: {},
  modules: {},
});
