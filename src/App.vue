<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
html {
  height: 100%;
}
body {
  margin: 0px;
  height: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
/*修改滚动条样式*/
div::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
div::-webkit-scrollbar-track {
  background: #efefef;
  border-radius: 2px;
}
div::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 6px;
}
div::-webkit-scrollbar-thumb:hover {
  background: #999;
}
div::-webkit-scrollbar-corner {
  background: #fff;
}

</style>
