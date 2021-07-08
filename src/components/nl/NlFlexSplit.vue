<!--
  参考vue-split，主要增加快捷按钮，改成flex布局
  依赖：elementui, split.js
  注意：sizes若设置为0时，按钮是不显示的。尤其在初始化时设为0，在函数中又修改了宽度，若没更新sizes，还是不显示按钮。
-->
<template>
  <div class="split-container" :class="{ 'split-container--horizontal': direction === 'horizontal', 'split-container--vertical': direction === 'vertical' }">
    <slot></slot>
    <!-- <el-button
      v-show="isShowB0 && isShowButton"
      class="split-button"
      style="padding: 0px"
      @click="handleClickLeftHalf"
      :icon="direction === 'horizontal' ? 'el-icon-arrow-left' : 'el-icon-arrow-up'"
      circle
      :style="{ left: x0, top: y0 }"
    ></el-button> -->
    <el-button
      v-show="isShowB1 && isShowButton"
      class="split-button"
      style="padding: 0px"
      @click="handleClickLeftFull"
      :icon="direction === 'horizontal' ? 'el-icon-back' : 'el-icon-top'"
      circle
      :style="{ left: x1, top: y1 }"
    ></el-button>
    <!-- <el-button
      v-show="isShowB2 && isShowButton"
      class="split-button"
      style="padding: 0px"
      @click="handleClickRightHalf"
      :icon="direction === 'horizontal' ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
      circle
      :style="{ left: x2, top: y2 }"
    ></el-button> -->
    <el-button
      v-show="isShowB3 && isShowButton"
      class="split-button"
      style="padding: 0px"
      @click="handleClickRightFull"
      :icon="direction === 'horizontal' ? 'el-icon-right' : 'el-icon-bottom'"
      circle
      :style="{ left: x3, top: y3 }"
    ></el-button>
  </div>
</template>

<script type="text/javascript">
import Split from "./split";

export default {
  name: "NlFlexSplit",
  props: {
    elements: {
      // Array of target split element ids
      type: Array,
      required: true,
      validator(value) {
        // must be array of strings
        const isValid = value.every((i) => typeof i === "string");
        if (!isValid) {
          console.error(`VueSplitJs: Invalid elements - "${value}". Must be array of strings`);
        }
        return isValid;
      },
    },

    direction: {
      // Direction to split: horizontal or vertical.
      type: String,
      default: "horizontal",
      validator(value) {
        let allowedValues = ["horizontal", "vertical"];
        const isValid = allowedValues.includes(value);
        if (!isValid) {
          console.error(`VueSplitJs: Invalid direction - "${value}". Possible values are "horizontal" or "vertical"`);
        }
        return isValid;
      },
    },

    sizes: {
      // Initial sizes of each element in percents.
      type: Array,
      default: null,
      validator(value) {
        // must be array of numbers
        const isValid = value.every((i) => typeof i === "number");
        if (!isValid) {
          console.error(`VueSplitJs: Invalid sizes - "${value}". Must be array of numbers`);
        }
        return isValid;
      },
    },

    minSize: {
      // Minimum size of each element in pixels.
      type: [Number, Array],
      default: 0,
    },

    gutterSize: {
      // Gutter size in pixels.
      type: Number,
      default: 3,
    },

    snapOffset: {
      // Snap to minimum size offset.
      type: Number,
      default: 30,
    },

    cursor: {
      // Cursor to display while dragging.
      type: String,
      default: "grabbing",
    },

    isShowButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      split: null,
      // isShowB0: false,
      isShowB1: false,
      // isShowB2: false,
      isShowB3: false,
      // x0: "0px",
      // y0: "0px",
      x1: "0px",
      y1: "0px",
      // x2: "0px",
      // y2: "0px",
      x3: "0px",
      y3: "0px",
      beforeTimer: null,
      stayTimer: null,
      splitData: null,
    };
  },

  mounted() {
    this.split = Split(
      this.elements.map((i) => {
        return "#" + i;
      }),
      {
        direction: this.direction,
        sizes: this.sizes,
        minSize: this.minSize,
        gutterSize: this.gutterSize,
        snapOffset: this.snapOffset,
        cursor: this.cursor,
        onDrag: this.onDrag,
        onDragStart: this.onDragStart,
        onDragEnd: this.onDragEnd,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      }
    );
  },

  methods: {
    onDrag() {
      clearTimeout(this.stayTimer);
      clearTimeout(this.beforeTimer);
      // this.isShowB0 = false;
      this.isShowB1 = false;
      // this.isShowB2 = false;
      this.isShowB3 = false;
      this.$emit("onDrag");
    },

    onDragEnd() {
      this.$emit("onDragEnd");
      // console.log("split:", this.split);
      // console.log("split.getSizes():", this.split.getSizes());
    },

    onDragStart() {
      clearTimeout(this.stayTimer);
      clearTimeout(this.beforeTimer);
      // this.isShowB0 = false;
      this.isShowB1 = false;
      // this.isShowB2 = false;
      this.isShowB3 = false;
      this.$emit("onDragStart");
    },

    onMouseEnter(e) {
      this.beforeTimer = setTimeout(() => {
        this.splitData = e.splitData;
        // if (this.direction === "horizontal") {
        //   this.x0 = e.x - 30 + "px";
        //   this.y0 = e.y - 25 + "px";
        //   this.x1 = e.x - 40 + "px";
        //   this.y1 = e.y + 5 + "px";
        //   this.x2 = e.x + "px";
        //   this.y2 = e.y - 25 + "px";
        //   this.x3 = e.x + "px";
        //   this.y3 = e.y + 5 + "px";
        // } else {
        //   this.x0 = e.x - 30 + "px";
        //   this.y0 = e.y - 25 + "px";
        //   this.x1 = e.x + "px";
        //   this.y1 = e.y - 25 + "px";
        //   this.x2 = e.x - 40 + "px";
        //   this.y2 = e.y + 5 + "px";
        //   this.x3 = e.x + "px";
        //   this.y3 = e.y + 5 + "px";
        // }
        // this.isShowB0 = e.sizes[e.a] > 1;
        // this.isShowB1 = this.isShowB0;
        // this.isShowB2 = e.sizes[e.b] > 1;
        // this.isShowB3 = this.isShowB2;
        let x = e.clientX;
        let y = e.clientY;
        if (this.direction === "horizontal") {
          this.x1 = x - 40 + "px";
          this.y1 = y - 10 + "px";
          this.x3 = x + 10 + "px";
          this.y3 = y - 10 + "px";
        } else {
          this.x1 = x - 10 + "px";
          this.y1 = y - 35 + "px";
          this.x3 = x - 20 + "px";
          this.y3 = y + 15 + "px";
        }
        this.isShowB1 = this.splitData.sizes[this.splitData.a] > 1;
        this.isShowB3 = this.splitData.sizes[this.splitData.b] > 1;
        clearTimeout(this.stayTimer);
        this.stayTimer = setTimeout(() => {
          // this.isShowB0 = false;
          this.isShowB1 = false;
          // this.isShowB2 = false;
          this.isShowB3 = false;
        }, 2000);
      }, 500);
    },

    onMouseLeave(e) {
      clearTimeout(this.beforeTimer);
    },

    // handleClickLeftHalf() {
    //   this.isShowB0 = false;
    //   this.isShowB1 = false;
    //   this.isShowB2 = false;
    //   this.isShowB3 = false;
    //   let sizes = this.splitData.sizes;
    //   let s = sizes[this.splitData.a] + sizes[this.splitData.b];
    //   sizes[this.splitData.a] = parseInt((sizes[this.splitData.a] / 2).toFixed(0));
    //   sizes[this.splitData.b] = s - sizes[this.splitData.a];
    //   this.split.setSizes(sizes);
    // },

    handleClickLeftFull() {
      // this.isShowB0 = false;
      this.isShowB1 = false;
      // this.isShowB2 = false;
      this.isShowB3 = false;
      let sizes = this.splitData.sizes;
      let s = sizes[this.splitData.a] + sizes[this.splitData.b];
      sizes[this.splitData.a] = 0;
      sizes[this.splitData.b] = s;
      this.split.setSizes(sizes);
      this.$emit("onDrag");
      this.$emit("onDragEnd");
    },

    // handleClickRightHalf() {
    //   this.isShowB0 = false;
    //   this.isShowB1 = false;
    //   this.isShowB2 = false;
    //   this.isShowB3 = false;
    //   let sizes = this.splitData.sizes;
    //   let s = sizes[this.splitData.a] + sizes[this.splitData.b];
    //   sizes[this.splitData.b] = parseInt((sizes[this.splitData.b] / 2).toFixed(0));
    //   sizes[this.splitData.a] = s - sizes[this.splitData.b];
    //   this.split.setSizes(sizes);
    // },

    handleClickRightFull() {
      // this.isShowB0 = false;
      this.isShowB1 = false;
      // this.isShowB2 = false;
      this.isShowB3 = false;
      let sizes = this.splitData.sizes;
      let s = sizes[this.splitData.a] + sizes[this.splitData.b];
      sizes[this.splitData.a] = s;
      sizes[this.splitData.b] = 0;
      this.split.setSizes(sizes);
      this.$emit("onDrag");
      this.$emit("onDragEnd");
    },

    getParent() {
      return this.split.parent;
    },
  },
};
</script>

<style scoped>
.split-container {
  display: flex;
  overflow: auto;
  width: 100%;
  height: 100%;
}

/* .split-container > * {
  position: relative;
  overflow-y: hidden;
} */

.split-container > div {
  display: flex;
}

.split-container--horizontal {
  flex-direction: row;
}

.split-container--horizontal > div {
  height: 100%;
}

.split-container--vertical {
  flex-direction: column;
}

.split-container--vertical > div {
  width: 100%;
}

.split-container >>> .gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.split-container >>> .gutter.gutter-vertical {
  background-color: #e6f2ff;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  cursor: ns-resize;
}

.split-container >>> .gutter.gutter-horizontal {
  background-color: #e6f2ff;
  /* float: left; */
  cursor: ew-resize;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
}

.split {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  /* overflow-y: auto;
  overflow-x: hidden; */
}

.split-button {
  position: fixed;
  width: 20px;
  height: 20px;
  /* 至少为3，否则可能会被eltable的固定列遮挡 */
  z-index: 3;
}
</style>
