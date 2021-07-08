<template>
  <div class="ncp-root" ref="root">
    <div class="ncp-border">
      <div class="ncp-border-top"><div class="ncp-block-top" :style="{ width: 100 / (blockCount + 1) + '%' }" v-for="item in blockCount" :key="item"></div></div>
      <div class="ncp-border-middle"><div class="ncp-block-middle" :style="{ width: 100 / (blockCount + 1) + '%' }" v-for="item in blockCount" :key="item"></div></div>
      <div class="ncp-border-bottom"><div class="ncp-block-bottom" :style="{ width: 100 / (blockCount + 1) + '%' }" v-for="item in blockCount" :key="item"></div></div>
    </div>
    <div class="ncp-title-div">
      <div v-for="item in list" :key="item" style="font-size: 12px;">{{ item }}</div>
    </div>
    <div class="ncp-between" ref="between"></div>
    <div class="ncp-pos" ref="pos" style="font-size: 12px;">{{ pos }}</div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "NlChartProgress",
  props: {
    blockCount: {
      type: Number,
      default: 4,
    },
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 5,
    },
    left: {
      type: Number,
      default: 2.51,
    },
    right: {
      type: Number,
      default: 4.52,
    },
    pos: {
      type: [Number, String],
      default: 3.51,
    },
  },

  data() {
    return {
      list: [],
    };
  },

  mounted() {
    let arr = [];
    arr.push(this.min.toRound(2));
    let offset = (this.max - this.min) / this.blockCount;
    for (let i = 0; i < this.blockCount; ++i) {
      arr.push((this.min + (i + 1) * offset).toRound(2));
    }
    this.list = arr;
    //
    let realWidth = offset * (this.blockCount + 1);
    let realMin = this.min - (realWidth - (this.max - this.min)) / 2;
    this.$refs.between.style.width = (100 * (this.right - this.left)) / realWidth + "%";
    this.$refs.between.style.left = ((this.left - realMin) * this.$refs.root.clientWidth) / realWidth + "px";
    //
    this.$refs.pos.style.left = ((this.pos - realMin) * this.$refs.root.clientWidth) / realWidth - this.$refs.pos.clientWidth / 2 + "px";
    // console.log(this.$refs.pos.style.left);
  },

  methods: {},
};
</script>

<style scoped>
.ncp-root {
  /* background-color: #ddd; */
  position: relative;
  display: flex;
  align-items: center;
}
.ncp-border {
  /* background-color: #ff0; */
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
}
.ncp-border-top {
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.ncp-border-middle {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.ncp-border-bottom {
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.ncp-block-top {
  height: 100%;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  border-top: 1px solid #000;
}
.ncp-block-middle {
  height: 100%;
}
.ncp-block-bottom {
  height: 100%;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
}
.ncp-title-div {
  position: absolute;
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.ncp-between {
  position: absolute;
  width: 100%;
  height: 75%;
  background-color: rgba(231, 158, 109, 0.4);
}

.ncp-pos {
  position: absolute;
  background-color: rgba(231, 158, 109, 1);
  border-radius: 50%;
  padding: 6px 4px;
}
</style>
