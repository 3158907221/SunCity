<template>
  <!-- 含 v-bind="$attrs" v-on="$listeners" -->
  <!-- 已继承原有属性和事件 -->
  <el-table
    ref="elTable"
    v-bind="$attrs"
    v-on="$listeners"
    :data="filterData"
    :row-style="{ height: '22px', ...rowStyle }"
    :cell-style="{ padding: '0px', ...cellStyle }"
    :header-row-style="{ height: '22px', ...headerRowStyle }"
    :header-cell-style="{
      padding: '0px',
      'text-align': 'center',
      ...headerCellStyle,
    }"
    :size="size"
    :border="border"
    :stripe="stripe"
    :highlight-current-row="highlightCurrentRow"
    :show-summary="showSummary"
    :summary-method="summaryMethod || sumMethod"
  >
    <slot></slot>
  </el-table>
</template>
<script>
export default {
  name: "nl-table",

  props: {
    // 原始数据
    data: { type: Array, default: () => [] },
    // 样式
    rowStyle: { type: Object, default: () => ({}) },
    cellStyle: { type: Object, default: () => ({}) },
    headerRowStyle: { type: Object, default: () => ({}) },
    // 表头样式
    headerCellStyle: { type: Object, default: () => ({}) },
    size: { type: String, default: "mini" },
    stripe: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    highlightCurrentRow: { type: Boolean, default: true },
    showSummary: { type: Boolean, default: true },
    summaryMethod: { type: Function, default: null },
  },

  data() {
    return {
      // 过滤后数据
      filterData: [],
      // 过滤方法数组
      filterFuncList: [],
      // 排序方法数组
      sortFuncList: [],
    };
  },

  created() {
    this.init();
  },

  watch: {
    data() {
      this.init();
    },
  },

  computed: {
    elTable() {
      return this.$refs.elTable;
    },
  },

  methods: {
    // 默认合计方法
    sumMethod() {
      return [((this.filterFuncList.length && this.filterData.length) || this.data.length) + "行"];
    },

    // 初始化: 原始数据->渲染数据
    init() {
      this.filterData = [...this.data];
      // step 1:执行所有筛选方法
      if (this.filterFuncList.length) {
        this.filterFuncList.forEach((f) => {
          this.filterData = this.filterData.filter((e) => f.fun(e, this.data));
        });
      }
      // step 2:执行所有排序方法,现只支持一个排序方法
      if (this.sortFuncList.length) {
        this.sortFuncList.forEach((s) => {
          this.filterData = this.filterData.sort((a, b) => {
            return s.fun(a, b, this.filterData);
          });
        });
      }
    },

    // 列控件执行接口
    runCommand(cmd, para) {
      const cmds = {
        addSort: this.addSort,
        clrSort: this.clrSort,
        addFilter: this.addFilter,
        delFilter: this.delFilter,
        clrFilter: this.clrFilter,
      };
      let res = cmds[cmd](para);
      this.init();
      return res;
    },

    // 添加排序
    addSort(newSort) {
      this.clrSort();
      this.sortFuncList.push(newSort);
    },

    // 清空排序
    clrSort() {
      this.sortFuncList = [];
    },

    // 添加筛选
    addFilter(newFilter) {
      this.delFilter(newFilter.type);
      this.filterFuncList.push(newFilter);
    },

    // 关闭筛选
    delFilter(type) {
      const ind = this.filterFuncList.findIndex((e) => e.type === type);
      if (ind > -1) {
        this.filterFuncList.splice(ind, 1);
      }
    },

    // 清空筛选
    clrFilter() {
      function resetChildren(f) {
        f.$children.forEach((c) => {
          if (c.$options._componentTag === "el-table-column") {
            resetChildren(c);
          } else if (c.$options._componentTag === "nl-table-column") {
            resetChildren(c);
            c.reset();
          }
        });
      }
      this.filterFuncList = [];
      resetChildren(this.elTable);
    },
  },

  // 其它通用函数
};
</script>
