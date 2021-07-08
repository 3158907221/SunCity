<template>
  <!-- 含 v-bind="$attrs" v-on="$listeners" -->
  <!-- 已继承原有属性和事件 -->
  <el-table
    ref="elTable"
    v-nl-el-table-lazy="load"
    v-bind="$attrs"
    v-on="$listeners"
    :data="renderData"
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
import Print from "./print";
export default {
  name: "nl-lazy-filter-table",

  directives: {
    "nl-el-table-lazy": {
      bind(el, binding) {
        const TABLEWRAP_DOM = el.querySelector(".el-table .el-table__body-wrapper");
        TABLEWRAP_DOM.addEventListener("scroll", function() {
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
          // 纵向滚动,且滚动到底时触发加载
          if (this.st !== this.scrollTop && scrollDistance <= 0) {
            binding.value();
          }
          // 记录纵向滚动
          this.st = this.scrollTop;
        });
      },
    },
  },

  props: {
    // 原始数据
    data: { type: Array, default: () => [] },
    // 样式
    rowStyle: { type: Object, default: () => ({}) },
    cellStyle: { type: Object, default: () => ({}) },
    headerRowStyle: { type: Object, default: () => ({}) },
    // 表头样式
    headerCellStyle: { type: Object, default: () => ({}) },
    // 下拉结束提醒
    // loadEndText: { type: String, default: "数据已经到底了" },
    size: { type: String, default: "mini" },
    stripe: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    highlightCurrentRow: { type: Boolean, default: true },
    showSummary: { type: Boolean, default: true },
    summaryMethod: { type: Function, default: null },
    // 默认每页数量
    pageSize: { type: Number, default: 100 },
    // 下拉懒加载
    lazy: { type: Boolean, default: true },
  },

  data() {
    return {
      // 过滤后数据
      filterData: [],
      // 过滤方法数组
      filterFuncList: [],
      // 当前页
      pageNum: 0,
      // 渲染数据
      renderData: [],
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

    // 加载
    load() {
      const start = this.pageSize * this.pageNum;
      if (start < this.filterData.length) {
        this.renderData = [...this.renderData, ...this.filterData.slice(start, start + this.pageSize)];
        this.pageNum++;
      } else {
        if (this.filterData.length && this.loadEndText) {
          this.$message.closeAll();
          this.$message(this.loadEndText);
        }
      }
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
      // 显示
      this.renderData = this.filterData.slice(0, this.pageSize);
      this.pageNum = 1;
    },

    // 列控件执行接口
    runCommand(cmd, para) {
      const cmds = {
        addFilter: this.addFilter,
        delFilter: this.delFilter,
        clrFilter: this.clrFilter,
      };
      let res = cmds[cmd](para);
      this.init();
      return res;
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
          } else if (c.$options._componentTag === "nl-lazy-filter-table-column") {
            resetChildren(c);
            c.reset();
          }
        });
      }
      this.filterFuncList = [];
      resetChildren(this.elTable);
    },

    // 导出excel 使用
    exportTable(name, method = "show") {
      const columns = this.elTable.columns;
      let option = {};
      option.header = columns.map((e) => e.label);
      const buildFun = (row, i) => {
        let r = [];
        columns.forEach((opt) => {
          if (opt.type === "index") r.push(i + 1);
          else if (opt.formatter) r.push(opt.formatter(row));
          else if (opt.property) r.push(row[opt.property]);
          else r.push("");
        });
        return r;
      };
      const table = method === "all" ? this.data.map(buildFun) : this.filterData.map(buildFun);
      if (Print.exportExcel) {
        let date = new Date();
        name = name || `ML_EXCEL`;
        date = {
          M: date.getMonth() + 1,
          d: ("00" + date.getDay()).slice(-2),
          h: ("00" + date.getHours()).slice(-2),
          m: ("00" + date.getMinutes()).slice(-2),
          s: ("00" + date.getSeconds()).slice(-2),
        };
        return Print.exportExcel(table, name + `_${date.M}_${date.d}_${date.h}${date.m}${date.s}`, option);
      } else {
        return table;
      }
    },
  },
};
</script>
