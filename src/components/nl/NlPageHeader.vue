<!--
  参考elementui的PageHeader，添加一个刷新和按钮插槽，并控制按钮显隐
  依赖：elementui
-->
<template>
  <div class="el-page-header">
    <el-tooltip v-if="isShowBack" :open-delay="500" :hide-after="2000" content="返回">
      <div style="cursor: pointer;" @click="$emit('back')">
        <i class="el-icon-back"></i>
      </div>
    </el-tooltip>
    <el-tooltip v-if="isShowRefresh" :open-delay="500" :hide-after="2000" content="刷新">
      <div style="cursor: pointer; margin-left: 8px;" @click="$emit('refresh')">
        <i class="el-icon-refresh-right"></i>
      </div>
    </el-tooltip>
    <el-tooltip v-if="isShowClose" :open-delay="500" :hide-after="2000" content="关闭">
      <div style="cursor: pointer; margin-left: 8px;" @click="$emit('close')">
        <i class="el-icon-close"></i>
      </div>
    </el-tooltip>
    <slot name="button"></slot>
    <div class="el-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NlPageHeader",

  props: {
    isShowBack: { type: Boolean, default: true },
    isShowRefresh: { type: Boolean, default: true },
    isShowClose: { type: Boolean, default: true },
    content: { type: String, default: "" },
  },
};
</script>
