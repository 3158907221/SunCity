<!--
  带边框标题的panel容器
  依赖：无
-->
<template>
  <div class="nl-caption-panel">
    <div class="nl-caption-panel-text">{{ caption }}</div>
    <div class="nl-caption-panel-border-first"></div>
    <div class="nl-caption-panel-border-second"></div>
    <div class="nl-caption-panel-content" :style="{ 'flex-direction': direction, overflow: overflow }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NlCaptionPanel",

  props: {
    caption: { type: String, default: "" },
    direction: { type: String, default: "column" },
    overflow: { type: String, default: "hidden" }, // 为了隐藏cotent中的form表单，会置顶显示
  },
};
</script>

<style scoped>
.nl-caption-panel {
  display: flex;
  flex: auto;
  flex-direction: column;
}
.nl-caption-panel-text {
  font-size: 14px;
  position: absolute;
  background-color: #fff;
  margin-left: 14px;
  padding-left: 4px;
  padding-right: 4px;
  flex: none;
  /*z-index: -1;*/ /* 不让文本标题置顶显示 */
}
.nl-caption-panel-border-first {
  height: 10px;
  flex: none;
}
.nl-caption-panel-border-second {
  height: 10px;
  border-top: 1px;
  border-left: 1px;
  border-right: 1px;
  border-bottom: 0px;
  border-style: solid;
  border-color: #eee;
  box-sizing: border-box;
  flex: none;
  /*z-index: -2;*/ /* 不让文本标题置顶显示 */
}
.nl-caption-panel-content {
  border-top: 0px;
  border-left: 1px;
  border-right: 1px;
  border-bottom: 1px;
  border-style: solid;
  border-color: #eee;
  box-sizing: border-box;
  display: flex;
  flex: auto;
}
</style>
