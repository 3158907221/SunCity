<template>
  <div class="welcome-root">
    <div class="copyright">
      <div>版权所有©福建省南平铝业股份有限公司</div>
      <div>技术支持 信息化室</div>
      <div>日常维护 董靖 8735019</div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    // 隐藏url上的token
    if (this.$route.query.token) {
      this.$router.replace("/welcome");
    }
  },
  
  mounted() {
    this.$CommonUtil.post("/api/common/tick", null);
  },
};
</script>

<style scoped>
.welcome-root {
  width: 100%;
  height: 1000px;
  background: url("../assets/img/welcome.jpg") no-repeat 0 0;
  background-size: cover;
  -webkit-background-size: cover; /* 兼容Webkit内核浏览器如Chrome和Safari */
  -o-background-size: cover; /* 兼容Opera */
}
.copyright {
  position: fixed;
  right: 40px;
  bottom: 40px;
  text-align: left;
  font-weight: bold;
  line-height: 25px;
}
</style>
