<template>
  <el-table-column ref="elTableColumn" v-bind="$attrs" v-on="$listeners">
    <!-- 表头重新渲染 -->
    <template v-slot:header="scope">
      <div :class="['table-header', hasFiltered ? 'table-header-filter' : '']">
        <!-- 表头文字 允许插槽自定义 header -->
        <slot name="header" :row="scope.row">{{ $attrs.label || "" }}</slot>
        <!-- 表头排序 允许插槽自定义 sort -->
        <slot v-if="sortable" name="sort">
          <div>
            <div :class="['sort', 'sort-up', hasSorted && hasSorted.dir === 'up' ? 'table_header-sort' : '']" @click="addSortUp"></div>
            <div :class="['sort', 'sort-down', hasSorted && hasSorted.dir === 'down' ? 'table_header-sort' : '']" @click="addSortDown"></div>
          </div>
        </slot>
        <!-- 表头筛选 -->
        <div v-if="filterable !== false">
          <el-popover ref="popover" trigger="click">
            <i class="el-icon-arrow-down filter-icon" slot="reference"></i>
            <!-- 筛选面板 允许插槽自定义 filter -->
            <slot name="filter">
              <div class="filter-panel-array">
                <ul v-infinite-scroll="load" style="margin: 0px;">
                  <el-checkbox-group v-model="filterSelect" style="display: flex; flex-direction: column;">
                    <el-input v-model="filterText" size="mini" style="width: 100%;" placeholder="'_'任意字符,'%'任意多字符" clearable @keyup.enter.native="addStrFilter"></el-input>
                    <el-button size="mini" class="filter-button" @click="clrFilter">（取消所有过滤）</el-button>
                    <el-button size="mini" class="filter-button" @click="delFilter">（取消本列过滤）</el-button>
                    <el-button size="mini" class="filter-button" @click="addNotNullFilter">（非空）</el-button>
                    <el-button size="mini" class="filter-button" @click="addNullFilter">（空）</el-button>
                    <li v-for="i in filterShowOptions" :key="i.key">
                      <el-checkbox :label="i.key" :key="i.key" @change="addArrFilter" style="width: 100%;">{{ i.value }}</el-checkbox>
                    </li>
                  </el-checkbox-group>
                </ul>
              </div>
            </slot>
          </el-popover>
        </div>
      </div>
    </template>
    <!-- 列展示 允许插槽自定义 default -->
    <template :slot="$scopedSlots.default ? 'default' : 'xx'" slot-scope="scope">
      <slot name="default" :row="scope.row"></slot>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "nl-recycle-table-column",

  props: {
    // 是否排序
    sortable: { type: Boolean, default: false },
    // 排序方法
    sortFunc: { type: Function, default: null },
    // 是否筛选/筛选方式
    filterable: { type: Boolean | String, default: false },
    // 是否动态筛选，已优化
    isDynamicFilter: { type: Boolean | String, default: true },
    // arr方式下,显示的数组
    filterOptions: { type: Array, default: () => [] },
  },

  data() {
    return {
      // str 方式下的变量
      filterText: "",
      // arr 方式下的变量
      filterSelect: [],
      // arr 下拉加载相关配置
      filterOriginalOptions: [], // 初始下拉显示时的数据
      filterShowOptions: [],
      filterShowSize: 20,
      filterShowPageNum: 0,
      // 添加方法到table时的标识字符
      type:
        this.$attrs.label +
        this.$attrs.props +
        Math.random()
          .toString(36)
          .slice(2),
    };
  },

  computed: {
    elTableColumn() {
      return this.$refs.elTableColumn;
    },

    // 获取表格组件对象
    table() {
      let parent = this.$parent;
      while (parent && parent.$options.name !== "nl-recycle-table") {
        parent = parent.$parent;
      }
      return parent;
    },

    // 字段是否已筛选
    hasFiltered() {
      return this.table.filterFuncList.findIndex((e) => e.type === this.type) > -1;
    },

    // 字段是否已排序
    hasSorted() {
      return this.table.sortFuncList.find((e) => e.type === this.type) || "";
    },

    // 计算筛选选项
    filterAllOptions() {
      if (this.filterOptions.length > 0) return this.filterOptions;
      // 获取除了本列外过滤数据
      const parent = this.table;
      let arr = {};
      if (this.isDynamicFilter) {
        if (!this.hasFiltered) {
          let filterData = [...parent.data];
          if (parent.filterFuncList.length) {
            parent.filterFuncList.forEach((f) => {
              if (f.type !== this.type) {
                filterData = filterData.filter(f.fun);
              }
            });
          }
          this.filterOriginalOptions = filterData.map((i) => i[this.$attrs.prop || ""]);
        }
        this.filterOriginalOptions.forEach((e) => {
          if (e !== null && e !== undefined) {
            arr[e] = "1";
          }
        });
        // let filterData = [...parent.data];
        // if (parent.filterFuncList.length) {
        //   parent.filterFuncList.forEach((f) => {
        //     if (f.type !== this.type) {
        //       filterData = filterData.filter(f.fun);
        //     }
        //   });
        // }
        // filterData.forEach((e) => {
        //   let obj = e[this.$attrs.prop || ""];
        //   // if (obj !== null && obj !== undefined && obj !== "") arr[obj] = "1";
        //   arr[obj] = "1";
        // });
      } else {
        parent.data.forEach((e) => {
          let obj = e[this.$attrs.prop || ""];
          // if (obj !== null && obj !== undefined && obj !== "") arr[obj] = "1";
          if (obj !== null && obj !== undefined) {
            arr[obj] = "1";
          }
        });
      }
      return Object.keys(arr)
        .sort()
        .map((e) => ({ key: e, value: e }));
    },
  },

  created() {
    this.load();
  },

  watch: {
    filterAllOptions() {
      this.filterShowPageNum = 0;
      this.filterShowOptions = [];
      this.load();
    },
  },

  methods: {
    // 升序按钮
    addSortUp() {
      const parent = this.table;
      const hasSorted = this.hasSorted;
      if (hasSorted && hasSorted.dir === "up") {
        parent.runCommand("clrSort");
      } else {
        parent.runCommand("addSort", {
          type: this.type,
          dir: "up",
          fun: this.sortFun || this.sortDefault(),
        });
      }
    },

    // 降序按钮
    addSortDown() {
      const parent = this.table;
      const hasSorted = this.hasSorted;
      if (hasSorted && hasSorted.dir === "down") {
        parent.runCommand("clrSort");
      } else {
        parent.runCommand("addSort", {
          type: this.type,
          dir: "down",
          fun: (ele1, ele2, arr) => -(this.sortFun || this.sortDefault())(ele1, ele2, arr),
        });
      }
    },

    // 默认的方法
    sortDefault() {
      return (a, b, c) => (a[this.$attrs.prop] < b[this.$attrs.prop] ? -1 : 1);
    },

    // 字符串按钮
    addStrFilter() {
      this.filterSelect = [];
      if (this.filterText.trim() === "") {
        this.filterSelect = "";
        this.table.runCommand("delFilter", this.type);
        this.$refs.popover.doClose();
        return;
      }
      let temp = (ele) => {
        let val = new RegExp(this.filterText.replace(/_/g, ".").replace(/\%/g, ".*"), "ig");
        let value = ele[this.$attrs.prop];
        let temp = value === null || value === undefined ? "" : value.toString();
        return temp.toUpperCase().match(val);
      };
      this.table.runCommand("addFilter", { type: this.type, fun: temp });
      this.$refs.popover.doClose();
    },

    // 数组筛选
    addArrFilter() {
      this.filterText = "";
      if (this.filterSelect.length === 0) {
        this.table.runCommand("delFilter", this.type);
        return;
      }
      let temp = (ele) => {
        if (this.filterSelect.length) {
          let value = ele[this.$attrs.prop];
          let temp = value === null || value === undefined ? "" : value.toString();
          return this.filterSelect.findIndex((e) => e === temp) > -1;
        } else {
          return true;
        }
      };
      this.table.runCommand("addFilter", { type: this.type, fun: temp });
    },

    // 空值筛选
    addNullFilter() {
      this.filterText = "";
      this.filterSelect = [];
      let temp = (ele) => !ele[this.$attrs.prop] && ele[this.$attrs.prop] !== 0;
      this.table.runCommand("addFilter", { type: this.type, fun: temp });
      this.$refs.popover.doClose();
    },

    // 非空值筛选
    addNotNullFilter() {
      this.filterText = "";
      this.filterSelect = [];
      let temp = (ele) => ele[this.$attrs.prop] || ele[this.$attrs.prop] === 0;
      this.table.runCommand("addFilter", { type: this.type, fun: temp });
      this.$refs.popover.doClose();
    },

    // 关闭当前筛选
    delFilter() {
      this.filterText = "";
      this.filterSelect = [];
      this.table.runCommand("delFilter", this.type);
      this.$refs.popover.doClose();
    },

    // 清空表格所有筛选
    clrFilter() {
      this.table.runCommand("clrFilter");
      this.$refs.popover.doClose();
    },

    reset() {
      this.filterText = "";
      this.filterSelect = [];
      this.filterOriginalOptions = [];
    },

    load() {
      const start = this.filterShowSize * this.filterShowPageNum;
      if (start < this.filterAllOptions.length) {
        this.filterShowOptions = [...this.filterShowOptions, ...this.filterAllOptions.slice(start, start + this.filterShowSize)];
        this.filterShowPageNum++;
      }
    },
  },
};
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sort {
  width: 0;
  height: 0;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  cursor: pointer;
}

.sort-up {
  border-top: 4px solid transparent;
  border-bottom: 4px solid #aaaaaa;
  margin-bottom: 3px;
}

.sort-down {
  border-top: 4px solid #aaaaaa;
  border-bottom: 4px solid transparent;
  margin-top: 3px;
}

.table_header-sort.sort-up {
  border-bottom: 4px solid #66b1ff;
}

.table_header-sort.sort-down {
  border-top: 4px solid #66b1ff;
}

.filter-icon {
  cursor: pointer;
}

.table-header-filter {
  color: #66b1ff;
}

.filter-panel-array ul {
  padding: 0px;
  overflow: auto;
  max-height: 300px;
  list-style: none;
}

/*修改滚动条样式*/
.filter-panel-array ul::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.filter-panel-array ul::-webkit-scrollbar-track {
  background: #efefef;
  border-radius: 2px;
}
.filter-panel-array ul::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 6px;
}
.filter-panel-array ul::-webkit-scrollbar-thumb:hover {
  background: #999;
}
.filter-panel-array ul::-webkit-scrollbar-corner {
  background: #fff;
}

.filter-button {
  display: block;
  margin-left: 0px;
  width: 100%;
  text-align: left;
  border: 0px;
  padding: 3px 24px;
  color: #000;
}

.filter-button:hover {
  color: #000;
  background-color: #b4d8ff;
}

.el-checkbox:hover {
  background-color: #b4d8ff;
}
</style>
