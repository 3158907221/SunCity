<template>
  <div class="menu-root">
    <el-menu :default-active="$route.path" mode="horizontal" @select="handleSelect" background-color="#409eff" text-color="#fff" active-text-color="#fff">
      <el-menu-item index="/welcome">首页</el-menu-item>
      <!-- <el-menu-item index="/employee-query" v-if="$CommonUtil.isMenuPermissive('cmdReport')">员工考勤查询</el-menu-item> -->
      <!-- todo permissive -->
      <el-menu-item index="/employee-query">员工考勤查询</el-menu-item>
      <el-submenu index="999" class="userinfo">
        <template slot="title"><div v-html="userinfo"></div></template>
        <el-menu-item index="/return-to-platform">返回集成平台</el-menu-item>
        <el-menu-item index="login-time" disabled>{{ loginTime }}</el-menu-item>
        <el-menu-item index="login-ip" disabled>{{ loginIp }}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
// :default-active="$route.path" 绑定路由，会反馈到导航
export default {
  data() {
    return {
      userinfo: "",
      loginTime: "",
      loginIp: "",
      loginTimer: null,
    };
  },

  async created() {
    let token = this.$route.query.token;
    if (token) {
      this.$CommonUtil.checkToken(token);
    }
    this.$CommonUtil.initPermList();
    // console.log(this.$store.state.permList);
    // 定时器，每隔一分钟检查登录cookie，过期就直接退出到登录页面
    this.loginTimer = setInterval(() => {
      if (!this.$CommonUtil.Cookie.getUser()) {
        // this.$router.push("/login");
        this.$CommonUtil.relogin("cookie getUser null");
      }
    }, 60 * 1000);
  },

  beforeDestroy() {
    clearInterval(this.loginTimer);
  },

  async mounted() {
    let user = this.$CommonUtil.Cookie.getUser();
    if (user) {
      this.userinfo = "登录帐号 " + user.userId + "&#12288;&#12288;登录人 " + user.empName;
      this.loginTime = "登录时间 " + new Date(user.loginTime).format("HH:mm:ss");
      this.loginIp = "登录IP " + user.loginIp;
    }
  },

  methods: {
    async handleSelect(key, keyPath) {
      switch (key) {
        case "/return-to-platform":
          let url = "http://172.16.10.95/home?token=" + this.$CommonUtil.Cookie.getUser().token;
          window.open(url, "_self");
          break;
        default: {
          this.$router.push(key);
        }
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/css/common.css";
.menu-root >>> .el-menu--horizontal > .el-submenu .el-submenu__title,
.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
}
.menu-root >>> .el-submenu__title i {
  color: #fff;
}
/* 用于显示登录时间 */
.el-menu-item.is-disabled {
  opacity: 1;
  cursor: auto;
}
.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  height: 40px;
  line-height: 40px;
}
.el-menu.el-menu--horizontal {
  border-bottom: solid 1px #409eff;
}
.userinfo {
  float: right;
}
.menu-root >>> .userinfo i {
  display: none;
}
</style>
