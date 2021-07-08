<template>
  <!-- 含 v-bind="$attrs" v-on="$listeners" -->
  <!-- 已继承原有属性和事件 -->
  <!-- height -->
  <el-table
    ref="elTable"
    v-lazyload="lazyload"
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
    :height="m_height"
    :size="size"
    :border="border"
    :stripe="stripe"
    :highlight-current-row="highlightCurrentRow"
    :show-summary="showSummary"
    :summary-method="summaryMethod || sumMethod"
    @current-change="handleElTableCurrentChange"
  >
    <slot></slot>
  </el-table>
</template>
<script>
import Print from "./print";
export default {
  name: "nl-recycle-table",

  directives: {
    lazyload: {
      bind(el, binding, vnode) {
        let element = el.querySelector(".el-table .el-table__body-wrapper");
        vnode.context._data.element = element;
        element.addEventListener("scroll", function(e) {
          if (e.msgScrollTop) {
            this.scrollTop = e.msgScrollTop;
            return;
          }
          if (this.scrollTop === 0) {
            binding.value(this, -1);
          } else if (this.scrollHeight - this.scrollTop <= this.clientHeight) {
            binding.value(this, 1);
          }
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
    // 默认每页数量，始终最多显示2页，但是单页数量大于表格的显示行数，否则显示不全无法懒加载。
    pageSize: { type: Number, default: 50 },
  },

  data() {
    return {
      m_height: this.$attrs.height,
      // 过滤后数据
      filterData: [],
      // 过滤方法数组
      filterFuncList: [],
      // 排序方法数组
      sortFuncList: [],
      // 渲染数据
      renderData: [],
      // 当前索引
      beginPageIndex: 0,
      // 实际元素
      element: null,
      // 当前行
      currentRow: null,
      // 保存外部的实际行变换函数
      currentChange: () => {},
    };
  },

  created() {
    if (this.$listeners["current-change"]) {
      this.currentChange = this.$listeners["current-change"].fns;
    }
    this.init();
    this.scrollToTop(1);
    this.height = 100;
  },

  // 可以用update来动态调整pageSize
  updated() {
    // console.log("updated");
    this.refreshHeight();
    // let rowHeight = this.element.querySelector(".el-table__body tbody tr").clientHeight;
    // console.log(this.element, rowHeight, this.element.clientHeight);
  },

  watch: {
    data() {
      this.currentRow = null;
      // this.$emit("nl-current-change", this.currentRow);
      this.currentChange(this.currentRow);
      this.init();
      this.scrollToTop(1);
    },
  },

  computed: {
    elTable() {
      return this.$refs.elTable;
    },

    beginIndex() {
      return this.beginPageIndex * this.pageSize;
    },
  },

  methods: {
    // scrollToTop(top, timeout) {
    //   setTimeout(() => {
    //     let event = window.document.createEvent("HTMLEvents");
    //     event.initEvent("scroll", false, false);
    //     event.msgScrollTop = top;
    //     this.element.dispatchEvent(event);
    //   }, timeout);
    // },

    scrollToTop(top) {
      this.$nextTick(() => {
        this.element.scrollTop = top;
      });
    },

    // 默认合计方法
    sumMethod() {
      return [((this.filterFuncList.length && this.filterData.length) || this.data.length) + "行"];
    },

    refreshHeight() {
      // todo testttttttttttttttt
      if (this.$el) {
        if (this.m_height !== this.$el.parentElement.clientHeight) {
          this.m_height = this.$el.parentElement.clientHeight;
        }
      }
    },

    handleElTableCurrentChange(row) {
      if (this.$listeners["current-change"]) {
        this.$listeners["current-change"].fns = function() {};
      }
      if (row) {
        if (this.currentRow !== row) {
          this.currentRow = row;
          // this.$emit("current-change", this.currentRow);
          this.currentChange(row);
        }
      }
    },

    getCurrentRow() {
      return this.currentRow;
    },

    setCurrentRow(row) {
      this.elTable.setCurrentRow(row);
      this.handleElTableCurrentChange(row);
    },

    getCurrentRowId() {
      return this.currentRow ? this.currentRow.id : "";
    },

    focusCurrentRow() {
      // 因为watch data的延迟
      this.$nextTick(() => {
        for (let i = 0; i < this.filterData.length; ++i) {
          if (this.filterData[i] === this.currentRow) {
            this.beginPageIndex = parseInt(i / this.pageSize);
            this.renderData = this.filterData.slice(this.beginIndex, this.beginIndex + this.pageSize);
            this.setCurrentRow(this.currentRow);
            let rowHeight = this.element.querySelector(".el-table__body tbody tr").clientHeight;
            let maxTop = this.element.scrollHeight - this.element.clientHeight;
            let top = rowHeight * (i - this.beginIndex) - this.element.clientHeight / 2;
            if (top <= 0) {
              top = 1;
            } else if (top >= maxTop) {
              top = maxTop - 1;
            }
            this.scrollToTop(top);
            break;
          }
        }
      });
    },

    focusRowByAttr(name, value) {
      // 因为watch data的延迟
      this.$nextTick(() => {
        for (let i = 0; i < this.filterData.length; ++i) {
          if (this.filterData[i][name] === value) {
            this.beginPageIndex = parseInt(i / this.pageSize);
            this.renderData = this.filterData.slice(this.beginIndex, this.beginIndex + this.pageSize);
            this.setCurrentRow(this.filterData[i]);
            let rowHeight = this.element.querySelector(".el-table__body tbody tr").clientHeight;
            let maxTop = this.element.scrollHeight - this.element.clientHeight;
            let top = rowHeight * (i - this.beginIndex) - this.element.clientHeight / 2;
            if (top <= 0) {
              top = 1;
            } else if (top >= maxTop) {
              top = maxTop - 1;
            }
            this.scrollToTop(top);
            break;
          }
        }
      });
    },

    focusRowById(id) {
      this.focusRowByAttr("id", id);
    },

    // 懒加载更多，元素，方向
    lazyload(element, direction) {
      if (direction > 0) {
        if (this.beginIndex + this.pageSize * 2 < this.filterData.length) {
          ++this.beginPageIndex;
          this.renderData = this.filterData.slice(this.beginIndex, this.beginIndex + this.pageSize * 2);
          let top = this.pageSize * element.querySelector(".el-table__body tbody tr").clientHeight - element.clientHeight;
          if (top <= 0) {
            top = 1;
          }
          this.scrollToTop(top);
          this.elTable.setCurrentRow(this.currentRow);
        }
      } else if (direction < 0) {
        if (this.beginPageIndex > 0) {
          --this.beginPageIndex;
          this.renderData = this.filterData.slice(this.beginIndex, this.beginIndex + this.pageSize * 2);
          let maxTop = this.element.scrollHeight - this.element.clientHeight;
          let top = this.pageSize * element.querySelector(".el-table__body tbody tr").clientHeight;
          if (top >= maxTop) {
            top = maxTop - 1;
          }
          this.scrollToTop(top);
          this.elTable.setCurrentRow(this.currentRow);
        }
      }
    },

    // 初始化: 原始数据->渲染数据
    init() {
      this.filterData = [...this.data];
      // step 1:执行所有筛选方法
      if (this.filterFuncList.length) {
        this.filterFuncList.forEach((f) => {
          this.filterData = this.filterData.filter(f.fun);
        });
      }
      // step 2:执行所有排序方法,现只支持一个排序方法
      if (this.sortFuncList.length) {
        this.sortFuncList.forEach((s) => {
          this.filterData = this.filterData.sort(s.fun);
        });
      }
      // 显示
      this.beginPageIndex = 0;
      this.renderData = this.filterData.slice(0, this.pageSize);
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
      this.focusCurrentRow();
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
          } else {
            resetChildren(c);
            if (c.reset) {
              c.reset();
            }
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
