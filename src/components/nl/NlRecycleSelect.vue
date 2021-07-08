<!-- 
说明：
  5、初始只加载一块，全部只渲染两块数据
  1、主要实现加载 所有数据数组-》过滤后数组-》渲染数组（懒加载）
  2、注意，监听了value，若不匹配data，则强制改为""
  3、目前，分为向前和向后加载。弹出选项时，只渲染对应的一块数据。
  4、由于向前滚动时，无法设置scrollTop=1，先用事件
示例：
  <nl-recycle-select
    style="width: 200px;"
    v-model="fdefoObjectTable.form.empId"
    :data="empList"
    #default="sp"
    valueName="empId"
    :filterNames="['empNumber', 'empName']"
  >
    <el-option v-for="item in sp.renderData" :key="item.empId" :label="item.empNumber + ' ' + item.empName" :value="item.empId"></el-option>
  </nl-recycle-select>
问题1：
  当select放在弹出对话框时，在显示立即赋值时，id显示不正确，估计是对话框没有立即显示，需要对id赋值做延时处理
    this.qncetTargetTable.updateDialog.isShow = true;
    this.qncetTargetTable.updateDialog.empName = curTargetRow.empName;
    this.qncetTargetTable.updateDialog.form.partyId = curTargetRow.partyId;
    // this.qncetTargetTable.updateDialog.form.unitId = curTargetRow.unitId;
    // this.qncetTargetTable.updateDialog.form.deptId = curTargetRow.deptId;
    this.qncetTargetTable.updateDialog.form.jobId = curTargetRow.jobId;
    setTimeout(() => {
      this.qncetTargetTable.updateDialog.form.unitId = curTargetRow.unitId;
      this.qncetTargetTable.updateDialog.form.deptId = curTargetRow.deptId;
    }, 200);
-->
<template>
  <el-select v-bind="$attrs" v-on="$listeners" v-lazyload="lazyload" :filterable="filterable" :clearable="clearable" :filter-method="filter" @visible-change="handleVisibleChange">
    <slot :renderData="renderData"></slot>
  </el-select>
</template>

<script>
import PinyinMatch from "pinyin-match";

export default {
  name: "NlRecycleSelect",

  directives: {
    // 懒加载指令
    lazyload: {
      bind(el, binding, vnode) {
        let element = el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
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
    // 过滤
    filterable: { type: Boolean, default: true },
    // 可清除
    clearable: { type: Boolean, default: true },
    // 原始数据集
    data: { type: Array, default: () => [] },
    // option的value名称
    valueName: { type: String, default: "value" },
    // 需要进行过滤的属性名称数组
    filterNames: { type: Array, default: () => [] },
    // 筛选后单页大小
    pageSize: { type: Number, default: 50 },
    // 是否监听value变化，若有进行设置，则必须监听
    isWatchValue: { type: Boolean, default: true },
    // 是否更正未匹配到数据
    isCorrectValue: { type: Boolean, default: false },
  },

  data() {
    return {
      // 筛选数据
      filterData: [],
      // 渲染数据
      renderData: [],
      // 当前索引
      beginPageIndex: 0,
      endPageIndex: 0,
      // 选项高度
      scrollContainHeight: 0,
      // 选项高度
      scrollItemHeight: 0,
      // 实际元素
      element: null,
    };
  },

  watch: {
    // 初始化optionData
    data(newValue, oldValue) {
      // console.log("datadatadata", newValue);
      this.filter("");
    },

    // 手动修改value值时，做查询并显示相关值
    "$attrs.value"(newValue, oldValue) {
      if (this.isWatchValue) {
        this.refreshValue();
      }
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

    resetPage() {
      let index = this.filterData.findIndex((v) => {
        return v[this.valueName] === this.$attrs.value;
      });
      this.beginPageIndex = parseInt(index / this.pageSize);
      this.endPageIndex = this.beginPageIndex;
      let m = (index % this.pageSize) * this.scrollItemHeight;
      if (m > this.scrollContainHeight / 2) {
        // this.element.scrollTop = parseInt(m - this.scrollContainHeight / 2 + 1);
        this.scrollToTop(m - this.scrollContainHeight / 2 + 1);
      } else {
        // this.element.scrollTop = 1;
        this.scrollToTop(1);
      }
      // this.scrollToTop((index % this.pageSize) * this.scrollItemHeight + 1, 100);
      let n = this.beginPageIndex * this.pageSize;
      this.renderData = this.filterData.slice(n, n + this.pageSize);
      if (this.renderData.length > 0) {
        this.endPageIndex = this.beginPageIndex + 1;
      }
      return index;
    },

    // 设置value，如果匹配到value显示所有匹配的，如果没有匹配，则设置为""。
    // 注意，若匹配到，data数组中也必须更新包含它，否则不显示对应name，因此必须重新计算renderData
    refreshValue() {
      this.filterData = this.data;
      let index = this.resetPage();
      if (this.isCorrectValue && index === -1) {
        this.$attrs.value = "";
        // 修改发送给父组件
        this.$emit("input", this.$attrs.value);
        return;
      }
    },

    // 正常过滤
    filter(query) {
      if (query === "") {
        this.filterData = this.data;
      } else {
        this.filterData = this.data.filter((item) => {
          for (let i = 0; i < this.filterNames.length; ++i) {
            if (String(item[this.filterNames[i]]).includes(query)) {
              return true;
            }
            if (PinyinMatch.match(String(item[this.filterNames[i]]), query)) {
              return true;
            }
          }
          return false;
          // return item.name.includes(query);
        });
      }
      this.resetPage();
    },

    // 懒加载更多，元素，方向
    lazyload(element, direction) {
      if (direction > 0) {
        if (this.endPageIndex * this.pageSize < this.filterData.length) {
          this.beginPageIndex = this.endPageIndex - 1;
          ++this.endPageIndex;
          this.renderData = this.filterData.slice(this.beginPageIndex * this.pageSize, this.endPageIndex * this.pageSize);
          let top = this.pageSize * this.scrollItemHeight - element.clientHeight;
          if (top <= 0) {
            top = 1;
          }
          this.scrollToTop(top);
        }
      } else if (direction < 0) {
        if (this.beginPageIndex > 0) {
          this.endPageIndex = this.beginPageIndex + 1;
          --this.beginPageIndex;
          this.renderData = this.filterData.slice(this.beginPageIndex * this.pageSize, this.endPageIndex * this.pageSize);
          let maxTop = element.scrollHeight - element.clientHeight;
          let top = this.pageSize * this.scrollItemHeight;
          if (top >= maxTop) {
            top = maxTop - 1;
          }
          this.scrollToTop(top);
        }
      }
    },

    // 选择框隐藏时，清除残留的过滤字符串
    handleVisibleChange(isVisible) {
      if (!isVisible) {
        this.filter("");
      } else {
        if (!this.scrollItemHeight) {
          setTimeout(() => {
            let ge = this.element;
            if (ge) {
              this.scrollContainHeight = ge.clientHeight;
              let ele = ge.querySelector(".el-select-dropdown__item");
              this.scrollItemHeight = ele ? ele.clientHeight : 0;
            } else {
              this.scrollItemHeight = 0;
            }
            this.filterData = this.data;
            this.resetPage();
          }, 20);
        } else {
          this.filterData = this.data;
          this.resetPage();
        }
      }
    },
  },
};
</script>
