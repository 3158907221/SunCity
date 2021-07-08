<template>
  <div class="ml-root">
    <div class="ml-caption">
      <nl-page-header @back="$router.go(-1)" @refresh="handleRefreshHeader" @close="$CommonUtil.handleCloseHeader($route.path)" content="评分类型"></nl-page-header>
    </div>
    <div class="ml-auto-flex ml-overflow-auto">
      <nl-flex-split :ref="empqrySplit.name" :elements="empqrySplit.elements" direction="horizontal" :sizes="[30, 70]" @onDragEnd="refreshSize">
        <div :id="empqrySplit.elements[0]">
          <div class="ml-auto-flex">
            <div style="flex: none;">
              <el-input style="width: 100px;" v-model="mytree.searchInput" placeholder="请输入查找内容" size="mini"></el-input>
              <el-button-group>
                <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="查找">
                  <el-button type="primary" icon="el-icon-search" size="mini" class="ml-tool-button" @click="$CommonUtil.TreeUtil.handleClickSearchTree(mytree)"></el-button>
                </el-tooltip>
                <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="最前一条">
                  <el-button
                    type="primary"
                    icon="el-icon-d-arrow-left"
                    size="mini"
                    class="ml-tool-button"
                    :disabled="mytree.searchData.length < 1"
                    @click="$CommonUtil.TreeUtil.handleClickSearchFirst(mytree)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="前一条">
                  <el-button
                    type="primary"
                    icon="el-icon-arrow-left"
                    size="mini"
                    class="ml-tool-button"
                    :disabled="mytree.searchData.length < 1"
                    @click="$CommonUtil.TreeUtil.handleClickSearchPrev(mytree)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="后一条">
                  <el-button
                    type="primary"
                    icon="el-icon-arrow-right"
                    size="mini"
                    class="ml-tool-button"
                    :disabled="mytree.searchData.length < 1"
                    @click="$CommonUtil.TreeUtil.handleClickSearchNext(mytree)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="最后一条">
                  <el-button
                    type="primary"
                    icon="el-icon-d-arrow-right"
                    size="mini"
                    class="ml-tool-button"
                    :disabled="mytree.searchData.length < 1"
                    @click="$CommonUtil.TreeUtil.handleClickSearchLast(mytree)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="刷新">
                  <el-button type="primary" icon="el-icon-refresh" size="mini" class="ml-tool-button" @click="handleClickRrefreshTree"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
            <div style="flex: none; padding-top: 4px;">
              <el-button-group>
                <!-- <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="测试1">
                <el-button type="primary" icon="el-icon-thumb" size="mini" class="ml-tool-button" @click="handleTest1"></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="测试2">
                <el-button type="primary" icon="el-icon-thumb" size="mini" class="ml-tool-button" @click="handleTest2"></el-button>
              </el-tooltip> -->
              </el-button-group>
            </div>
          </div>
        </div>
        <div :id="empqrySplit.elements[1]" style="flex: none; overflow: hidden; background-color: #fff; flex-direction: column;">
          <!-- <el-form size="mini" :inline="true" :model="empqryStatTable.form">
            <el-form-item label="前缀">
              <el-input v-model="empqryStatTable.form.prefix" style="width: 100px;"></el-input>
            </el-form-item>
            <el-form-item label="长度">
              <el-input-number style="width: 50px;" size="mini" :precision="0" :min="1" :max="20" controls-position="right" v-model="empqryStatTable.form.length"></el-input-number>
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number style="width: 50px;" size="mini" :precision="0" :min="1" :max="1000" controls-position="right" v-model="empqryStatTable.form.count"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" style="width: 75px;" icon="el-icon-plus" @click="handleClickQuery">查询</el-button>
            </el-form-item>
          </el-form> -->
          <div class="ml-auto-flex">
            <el-table
              :id="empqryStatTable.name"
              :data="empqryStatTable.data"
              :ref="empqryStatTable.name"
              :height="empqryStatTable.height"
              highlight-current-row
              border
              stripe
              size="mini"
              :row-style="{ height: '22px' }"
              :cell-style="{ padding: '0px' }"
              :header-row-style="{ height: '22px' }"
              :header-cell-style="{ padding: '0px', 'text-align': 'center' }"
              show-summary
              :summary-method="$CommonUtil.Table.getSummaries"
            >
              <el-table-column show-overflow-tooltip align="right" fixed type="index" label="行号" width="40">
                <template slot-scope="{ row, $index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="strPassword" label="评分密码" width="200"></el-table-column>
            </el-table>
          </div>
        </div>
      </nl-flex-split>
    </div>
  </div>
</template>

<script>
import NlPageHeader from "@/components/nl/NlPageHeader";
import NlFlexSplit from "@/components/nl/NlFlexSplit";

export default {
  components: {
    NlPageHeader,
    NlFlexSplit,
  },

  data() {
    return {
      cmdName: "cmdEmployeeQuery",
      moduleName: "员工考勤查询",
      restoreFlag: 0,
      empqrySplit: {
        name: "empqrySplit",
        ref: null,
        elements: ["empqrySplitLeft", "empqrySplitRight"],
      },
      mytree: {
        name: "mytree",
        ref: null,
        onChangeCurrentNodeData: this.onChangeCurrentNodeData,
        oldCurrentKey: null,
        // el-tree的对应属性
        defaultProps: {
          children: "children",
          label: "name",
        },
        sortTable: [], // 表结构的 节点数据，地址排序
        data: [], // 树结构的 节点数据
        expandKeys: [1], // 节点展开数组，默认展开根节点，有序的
        disabledDelete: true, // 删除树节点
        disabledAdd: true, // 添加树节点
        disabledAddAssessUnit: true, // 添加考核单元
        disabledAddDept: true, // 添加考核部门
        disabledAddEmp: true, // 添加考核人员
        disabledUp: true, // 上移节点
        disabledDown: true, // 下移节点
        disabledCut: true, // 剪切节点
        cutCid: null, // 剪切的cid
        cutNodeType: null, // 剪切的类型
        // 搜索
        searchInput: "",
        searchIndex: -1,
        searchData: [],
        isShowTreeAddMenu: false,
        isShowTreeMenu: false,
      },
      empqryStatTable: {
        name: "empqryStatTable",
        ref: null,
        height: null,
        data: [],
      },
    };
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.refreshSize);
  },

  deactivated() {
    window.removeEventListener("resize", this.refreshSize);
  },

  mounted() {
    this.empqrySplit.ref = this.$refs[this.empqrySplit.name];
    this.mytree.ref = this.$refs[this.mytree.name];
    this.empqryStatTable.ref = this.$refs[this.empqryStatTable.name];
    this.handleRefreshHeader();
  },

  activated() {
    window.addEventListener("resize", this.refreshSize);
    this.initSize();
    setTimeout(() => {
      this.initSize();
    }, 200);
  },

  methods: {
    handleTest1() {
      // let curData = this.$refs.mytree.getCurrentNode();
      // console.log("curData: ", curData);
      // console.log("data: ", this.mytree.data);
      // console.log("sortTable: ", this.mytree.sortTable);
    },

    handleTest2() {
      // this.test1();
      // console.log("expandKeys:", this.mytree.expandKeys);
      this.refreshCommonData();
    },

    initSize() {
      this.$nextTick(() => {
        let size = 400;
        this.$CommonUtil.Table.refreshHeight(this.empqryStatTable);
        //
        let parent = this.empqrySplit.ref.getParent();
        let child0 = parent.children[0];
        let child1 = parent.children[2];
        let result = parent.clientWidth - size - this.empqrySplit.ref.gutterSize;
        child1.style.width = (result > 0 ? result : 0) + "px";
        child0.style.width = size + "px";
      });
    },

    // 刷新表格高度
    refreshSize() {
      this.$CommonUtil.Table.refreshHeight(this.empqryStatTable);
      let parent = this.empqrySplit.ref.getParent();
      let child0 = parent.children[0];
      let child1 = parent.children[2];
      this.restoreFlag = parent.clientWidth;
      let result = parent.clientWidth - child0.offsetWidth - this.empqrySplit.ref.gutterSize;
      child1.style.width = (result > 0 ? result : 0) + "px";
      child0.style.width = child0.offsetWidth + "px";
    },

    async handleRefreshHeader() {
      const loading = this.$CommonUtil.showLoading();
      // await this.refreshInitData();
      // await this.refreshUpTable();
      loading.close();
    },

    /**
     * 重新加载整个树
     */
    async handleClickRrefreshTree() {
      // await this.refreshInitData();
      const loading = this.$CommonUtil.showLoading();
      this.mytree.cutCid = null;
      await this.$CommonUtil.post("/api/CadreTree/getTreeNodeList", "yearNo=" + this.mytree.yearNo, (successData) => {
        let curData = this.mytree.ref.getCurrentNode();
        // 重建树形结构
        this.mytree.data = this.$CommonUtil.TreeUtil.getTreeData(successData, 0);
        // 重建排序表
        this.$CommonUtil.TreeUtil.refreshSortTable(this.mytree);
        this.$nextTick(() => {
          this.mytree.oldCurrentKey = -1; // 使其必须触发onChangeCurrent
          if (curData === null) {
            this.mytree.ref.setCurrentKey(null);
            this.mytree.onChangeCurrentNodeData(null);
          } else {
            let ret = this.mytree.sortTable.some((v) => {
              return v.cid === curData.cid;
            });
            if (ret) {
              this.mytree.ref.setCurrentKey(curData.cid);
              this.mytree.onChangeCurrentNodeData(curData);
            } else {
              this.mytree.ref.setCurrentKey(null);
              this.mytree.onChangeCurrentNodeData(null);
            }
          }
        });
      });
      loading.close();
    },

    /**
     * 统一onCurrentChange和刷新树或节点时触发，data可能为null
     */
    async onChangeCurrentNodeData(data) {
      let isChange = false;
      if (data === null) {
        isChange = this.mytree.oldCurrentKey !== null;
        this.mytree.oldCurrentKey = null;
      } else {
        isChange = data.cid !== this.mytree.oldCurrentKey;
        this.mytree.oldCurrentKey = data.cid;
      }
      if (!isChange) {
        return;
      }
      if (data === null) {
        this.mytree.disabledDelete = true;
        this.mytree.disabledAdd = true;
        this.mytree.disabledAddAssessUnit = true;
        this.mytree.disabledAddDept = true;
        this.mytree.disabledAddEmp = true;
        this.mytree.disabledUp = true;
        this.mytree.disabledDown = true;
        this.mytree.disabledCut = true;
        this.activeTab = "tabRootYear";
        this.tabRootYear.form.name = "";
        this.tabRootYear.form.remark = "";
      } else {
        this.mytree.disabledDelete = data.nodeType === 0;
        this.mytree.disabledAdd = data.nodeType === 3;
        this.mytree.disabledAddAssessUnit = data.nodeType !== 0;
        this.mytree.disabledAddDept = !(data.nodeType === 1 || data.nodeType === 2);
        this.mytree.disabledAddEmp = data.nodeType !== 2;
        this.mytree.disabledUp = data.nodeType === 0;
        this.mytree.disabledDown = data.nodeType === 0;
        this.mytree.disabledCut = data.nodeType === 0 || data.nodeType === 1;
        switch (data.nodeType) {
          case 0:
            this.activeTab = "tabRootYear";
            break;
          case 1:
            this.activeTab = "tabAssessUnit";
            break;
          case 2:
            this.activeTab = "tabDept";
            break;
          case 3:
            this.activeTab = "tabEmp";
            break;
        }
        // 更新内容
        const loading = this.$CommonUtil.showLoading();
        await this.$CommonUtil.post("/api/CadreTree/getNodeByCid", "yearNo=" + this.mytree.yearNo + "&cid=" + data.cid, async (successData) => {
          switch (data.nodeType) {
            case 0:
              this.tabRootYear.form.name = successData.name;
              this.tabRootYear.form.remark = successData.remark;
              break;
            case 1:
              this.tabAssessUnit.form.assessUnitId = successData.assessUnitId;
              this.tabAssessUnit.form.remark = successData.remark;
              break;
            case 2:
              this.tabDept.form.deptId = successData.deptId;
              this.tabDept.form.remark = successData.remark;
              break;
            case 3:
              this.tabEmp.form.empId = successData.empId;
              this.tabEmp.form.remark = successData.remark;
              this.treatForm.empId = successData.empId;
              this.treatForm.yearNo = this.mytree.yearNo;
              this.officeTable.form.content = "";
              await this.refreshOffice();
              let formData = new FormData();
              formData.append("yearNo", this.mytree.yearNo);
              formData.append("empId", this.tabEmp.form.empId);
              await this.$CommonUtil.post("/api/CadreTreat/getByYearNoEmpId", formData, async (successData) => {
                if (successData === null) {
                  let formData = new FormData();
                  formData.append("empId", this.tabEmp.form.empId);
                  await this.$CommonUtil.post("/api/person/getLeaderByEmpId", formData, async (successData) => {
                    this.treatForm.id = this.$CommonUtil.getNewGuid();
                    this.treatForm.posId = "";
                    this.treatForm.dutyId = successData.dutyId;
                    this.treatForm.yearAmount = "";
                    this.treatForm.monthAmount = "";
                  });
                } else {
                  this.treatForm.id = successData.id;
                  this.treatForm.posId = successData.posId;
                  this.treatForm.dutyId = successData.dutyId;
                  this.treatForm.yearAmount = successData.yearAmount;
                  this.treatForm.monthAmount = successData.monthAmount;
                }
              });
              break;
          }
        });
        loading.close();
      }
    },
  },
};
</script>

<style scoped>
/* 右键菜单鼠标悬停背景颜色 */
.ml-root >>> #treeAddMenu ul li:hover,
.ml-root >>> #treeMenu ul li:hover {
  background-color: #b4d8ff !important;
}
/* 右键菜单项高度 */
.ml-root >>> .el-menu-item {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
}
.ml-root >>> .el-tabs__content {
  overflow: auto;
}
</style>
