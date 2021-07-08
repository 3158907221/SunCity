<template>
  <div class="ml-root">
    <div class="ml-caption">
      <nl-page-header @back="$router.go(-1)" @refresh="handleRefreshHeader" @close="$CommonUtil.handleCloseHeader($route.path)" content="评分类型"></nl-page-header>
    </div>
    <div class="ml-auto-flex ml-overflow-auto">
      <vue-split
        style="flex: auto; overflow: auto;"
        :elements="['#splitLeft', '#splitRight']"
        direction="horizontal"
        :sizes="[0, 100]"
        :minSize="0"
        :gutterSize="3"
        @onDragEnd="refreshSize"
      >
        <div id="splitLeft" class="ml-none-col-flex ml-overflow-auto">
          <div style="flex: none;">
            <el-input style="width: 100px;" v-model="mytree.searchInput" placeholder="请输入查找内容" size="mini"></el-input>
            <el-button-group>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="查找">
                <el-button type="primary" icon="el-icon-search" size="mini" class="ml-tool-button" @click="handleClickSearchTree"></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="最前一条">
                <el-button
                  type="primary"
                  icon="el-icon-d-arrow-left"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.searchData.length < 1"
                  @click="handleClickSearchFirst"
                ></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="前一条">
                <el-button
                  type="primary"
                  icon="el-icon-arrow-left"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.searchData.length < 1"
                  @click="handleClickSearchPrev"
                ></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="后一条">
                <el-button
                  type="primary"
                  icon="el-icon-arrow-right"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.searchData.length < 1"
                  @click="handleClickSearchNext"
                ></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="最后一条">
                <el-button
                  type="primary"
                  icon="el-icon-d-arrow-right"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.searchData.length < 1"
                  @click="handleClickSearchLast"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </div>
          <div style="flex: none; padding-top: 4px;">
            <el-button-group>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['add'])"
                content="添加"
              >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.disabledAdd"
                  @click="handleClickAddTreeNode"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['del'])"
                content="删除"
              >
                <el-button
                  type="primary"
                  icon="el-icon-minus"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.disabledDelete"
                  @click="handleClickDeleteCurrentTreeNode"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])"
                content="剪切"
              >
                <el-button
                  type="primary"
                  icon="el-icon-scissors"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.disabledCut"
                  @click="handleClickCutTreeNode"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])"
                content="粘贴"
              >
                <el-button
                  type="primary"
                  icon="el-icon-document-copy"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.cutCid == null"
                  @click="handleClickPasteTreeNode"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])"
                content="上移"
              >
                <el-button
                  type="primary"
                  icon="el-icon-caret-top"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.disabledUp"
                  @click="handleClickUpTreeNode"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])"
                content="下移"
              >
                <el-button
                  type="primary"
                  icon="el-icon-caret-bottom"
                  size="mini"
                  class="ml-tool-button"
                  :disabled="mytree.disabledDown"
                  @click="handleClickDownTreeNode"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                :open-delay="500"
                :hide-after="2000"
                effect="dark"
                placement="top-start"
                v-if="$CommonUtils.isPermissive(cmdName, ['qry'])"
                content="刷新"
              >
                <el-button type="primary" icon="el-icon-refresh" size="mini" class="ml-tool-button" @click="handleClickRrefresh"></el-button>
              </el-tooltip>
              <!-- <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="测试1">
                <el-button type="primary" icon="el-icon-thumb" size="mini" class="ml-tool-button" @click="handleTest1"></el-button>
              </el-tooltip>
              <el-tooltip :open-delay="500" :hide-after="2000" effect="dark" placement="top-start" content="测试2">
                <el-button type="primary" icon="el-icon-thumb" size="mini" class="ml-tool-button" @click="handleTest2"></el-button>
              </el-tooltip> -->
            </el-button-group>
          </div>
          <div class="ml-auto-flex ml-overflow-auto">
            <div style="width: 100%;">
              <el-tree
                id="mytree"
                ref="mytree"
                :data="mytree.data"
                :default-expanded-keys="mytree.expandKeys"
                @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse"
                :props="mytree.defaultProps"
                :expand-on-click-node="false"
                node-key="cid"
                @current-change="handleCurrentChange"
                @node-contextmenu="handleRightClick"
              >
                <span style="font-size: 12px;" slot-scope="{ node, data }">
                  <i
                    :class="{ 'el-icon-coin': data.nodeType === 0, 'el-icon-folder': data.nodeType === 1, 'el-icon-document': data.nodeType === 2 }"
                    style="padding-right: 4px"
                  ></i
                  >{{ node.label }}
                </span>
              </el-tree>
            </div>
            <div v-show="mytree.isShowTreeAddMenu" id="treeAddMenu" @mouseleave="mytree.isShowTreeAddMenu = false" style="border: 1px solid #000;">
              <el-menu @select="handleTreeAddMenuSelect" background-color="#fff" text-color="#000" active-text-color="#000">
                <el-menu-item index="1" v-if="$CommonUtils.isPermissive(cmdName, ['add'])" :disabled="mytree.disabledAddType">添加指标类别</el-menu-item>
                <el-menu-item index="2" v-if="$CommonUtils.isPermissive(cmdName, ['add'])" :disabled="mytree.disabledAddItem">添加考核指标</el-menu-item>
              </el-menu>
            </div>
            <div v-show="mytree.isShowTreeMenu" id="treeMenu" @mouseleave="mytree.isShowTreeMenu = false" style="border: 1px solid #000;">
              <el-menu @select="handleTreeMenuSelect" background-color="#fff" text-color="#000" active-text-color="#000">
                <el-menu-item index="1" v-if="$CommonUtils.isPermissive(cmdName, ['add'])" :disabled="mytree.disabledAddType">添加指标类别</el-menu-item>
                <el-menu-item index="2" v-if="$CommonUtils.isPermissive(cmdName, ['add'])" :disabled="mytree.disabledAddItem">添加考核指标</el-menu-item>
                <el-menu-item index="3" v-if="$CommonUtils.isPermissive(cmdName, ['del'])" :disabled="mytree.disabledDelete">删除</el-menu-item>
                <el-menu-item index="4" v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])" :disabled="mytree.disabledCut">剪切</el-menu-item>
                <el-menu-item index="5" v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])" :disabled="mytree.cutCid == null">粘贴</el-menu-item>
                <el-menu-item index="6" v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])" :disabled="mytree.disabledUp">上移</el-menu-item>
                <el-menu-item index="7" v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])" :disabled="mytree.disabledDown">下移</el-menu-item>
                <el-menu-item index="8" v-if="$CommonUtils.isPermissive(cmdName, ['qry'])">刷新</el-menu-item>
              </el-menu>
            </div>
          </div>
        </div>
        <div id="splitRight" class="ml-auto-col-flex ml-overflow-auto">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="指标类别" :name="tabItemType.name" :disabled="activeTab !== tabItemType.name">
              <el-form size="mini" :model="tabItemType.form" label-width="80px" style="min-width: 460px; width: 460px;">
                <el-form-item :required="true" label="类别名称">
                  <el-input v-model="tabItemType.form.name"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input type="textarea" v-model="tabItemType.form.remark"></el-input>
                </el-form-item>
                <el-row type="flex" justify="center">
                  <el-button size="mini" type="primary" v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])" @click="handleClickTabItemTypeEdit">修改</el-button>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="指标" :name="tabItem.name" :disabled="activeTab !== tabItem.name">
              <el-form size="mini" :model="tabItem.form" label-width="80px" style="min-width: 460px; width: 460px;">
                <el-row>
                  <el-col :span="12">
                    <el-form-item :required="true" label="指标名称">
                      <el-input v-model="tabItem.form.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="指标类型">
                      <el-select v-model="tabItem.form.itemTypeId" filterable clearable placeholder="请选择" style="width: 100%;">
                        <el-option v-for="item in tabItem.optionItemType" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="计量单位">
                      <el-select v-model="tabItem.form.unit" filterable clearable placeholder="请选择" style="width: 100%;">
                        <el-option v-for="item in tabItem.optionUnit" :key="item.recId" :label="item.name" :value="item.name"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="考核频次">
                      <el-select v-model="tabItem.form.frequencyId" filterable clearable placeholder="请选择" style="width: 100%;">
                        <el-option v-for="item in tabItem.optionFrequency" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="指标说明">
                  <el-input type="textarea" v-model="tabItem.form.description"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input type="textarea" v-model="tabItem.form.remark"></el-input>
                </el-form-item>
                <el-form-item label="是否可用">
                  <el-checkbox v-model="tabItem.form.isUseable"></el-checkbox>
                </el-form-item>
                <el-row type="flex" justify="center">
                  <el-button size="mini" type="primary" v-if="$CommonUtils.isPermissive(cmdName, ['mdy'])" @click="handleClickTabItemEdit">修改</el-button>
                </el-row>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </vue-split>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cmdName: "cmdItemLib",
      moduleName: "绩效指标库管理",
      mytree: {
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
        disabledAddType: true, // 添加指标类别
        disabledAddItem: true, // 添加考核指标
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
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.refreshSize);
  },
  deactivated() {
    window.removeEventListener("resize", this.refreshSize);
  },
  mounted() {
    this.refreshInitData();
    this.handleClickRrefresh();
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
        // 初始化左右面版的宽度
        let el = document.getElementById("splitLeft");
        let er = document.getElementById("splitRight");
        let elpw = el.parentElement.clientWidth;
        el.style.width = "250px";
        er.style.width = (elpw - 253 > 0 ? elpw - 253 : 0) + "px";
      });
    },

    // 刷新表格高度
    refreshSize() {
      // 初始化左右面版的宽度
      let el = document.getElementById("splitLeft");
      let er = document.getElementById("splitRight");
      let elpw = el.parentElement.clientWidth;
      er.style.width = (elpw - el.offsetWidth - 3 > 0 ? elpw - el.offsetWidth - 3 : 0) + "px";
      el.style.width = el.offsetWidth + "px";
    },

    /**
     * 遍历树形结构，生成搜索顺序表
     */
    refreshSortTable() {
      function setSortTable(node, arr) {
        arr.push(node);
        // 动态生成的节点，没有children属性
        if (node.children !== undefined) {
          for (let i = 0; i < node.children.length; ++i) {
            setSortTable(node.children[i], arr);
          }
        }
      }
      this.mytree.sortTable = [];
      setSortTable(this.mytree.data[0], this.mytree.sortTable);
    },

    /**
     * 添加一个展开节点
     */
    appendExpand(key) {
      for (var i = 0; i < this.mytree.expandKeys.length; ++i) {
        if (this.mytree.expandKeys[i] >= key) {
          if (this.mytree.expandKeys[i] > key) {
            this.mytree.expandKeys.splice(i, 0, key);
          }
          return;
        }
      }
      this.mytree.expandKeys.push(key);
    },

    /**
     * 简单移除一个展开节点，不移除子孙展开节点
     */
    removeExpandSimple(key) {
      for (var i = 0; i < this.mytree.expandKeys.length; ++i) {
        if (this.mytree.expandKeys[i] >= key) {
          if (this.mytree.expandKeys[i] === key) {
            this.mytree.expandKeys.splice(i, 1);
          }
          return;
        }
      }
    },

    /**
     * 移除一个展开节点，并且移除所有子孙展开节点
     */
    removeExpand(key) {
      function searchTree(node, arr) {
        arr.push(node.data.cid);
        node.collapse();
        // 动态生成的节点，没有children属性
        if (node.childNodes !== undefined) {
          for (let i = 0; i < node.childNodes.length; ++i) {
            searchTree(node.childNodes[i], arr);
          }
        }
      }
      let arr = [];
      let node = this.$refs.mytree.getNode(key);
      //console.log("removeExpand node: ", node);
      searchTree(node, arr);
      for (let i = 0; i < arr.length; ++i) {
        this.removeExpandSimple(arr[i]);
      }
    },

    /**
     * 重新加载一些下拉选项数据等
     */
    async refreshInitData() {
      const loading = this.$CommonUtils.showLoading();
      await this.$CommonUtils.post("/api/common/getItemTypeList", null, (successData) => {
        this.tabItem.optionItemType = successData;
      });
      await this.$CommonUtils.post("/api/common/getUnitList", null, (successData) => {
        this.tabItem.optionUnit = successData;
      });
      await this.$CommonUtils.post("/api/common/getFrequencyList", null, (successData) => {
        this.tabItem.optionFrequency = successData;
      });
      loading.close();
    },

    /**
     * 重新加载整个树
     */
    async handleClickRrefresh() {
      await this.refreshInitData();
      const loading = this.$CommonUtils.showLoading();
      this.mytree.cutCid = null;
      await this.$CommonUtils.post("/api/ItemLib/getTreeNodeList", null, (successData) => {
        let curData = this.$refs.mytree.getCurrentNode();
        // console.log("curData: ", curData);
        // 根据一个pid，创建此pid下面的树形结构
        function getTree(treeData, pid) {
          function sortSeq(a, b) {
            return a.seq - b.seq;
          }
          let treeArr = [];
          for (let i = 0; i < treeData.length; ++i) {
            let node = treeData[i];
            if (node.pid === pid) {
              let newNode = { ...node, children: getTree(treeData, node.cid) };
              newNode.children.sort(sortSeq); // 根据seq排序
              treeArr.push(newNode);
            }
          }
          return treeArr;
        }
        // 重建树形结构
        this.mytree.data = getTree(successData, 0);
        // console.log("treeData", this.mytree.data);
        // 重建排序表
        this.refreshSortTable();
        // console.log("sortTable", this.mytree.sortTable);
        this.$nextTick(() => {
          this.$refs.mytree.setCurrentKey(curData === null ? null : curData.cid);
          this.changeCurrentNodeData(curData);
        });
      });
      loading.close();
    },

    /**
     * 展开节点，维护expandKeys数组，保持节点展开状态
     */
    handleNodeExpand(data, node, ele) {
      // this.$set(ele, "expanded", true);
      this.appendExpand(data.cid);
    },

    /**
     * 收起节点，维护expandKeys数组，保持节点展开状态
     */
    handleNodeCollapse(data, node, ele) {
      // for (var i = 0; i < this.mytree.expandKeys.length; ++i) {
      //   if (this.mytree.expandKeys[i] === data.cid) {
      //     this.mytree.expandKeys.splice(i, 1);
      //     this.$set(ele, "expanded", false);
      //   }
      // }
      this.removeExpand(data.cid);
    },

    /**
     * 定位节点，并触发changeCurrentNodeData
     */
    focusNodeByKey(key) {
      let pnode = this.$refs.mytree.getNode(key);
      this.$refs.mytree.setCurrentNode(pnode.data);
      this.changeCurrentNodeData(pnode.data);
    },

    /**
     * 统一onCurrentChange和刷新树或节点时触发，data可能为null
     */
    changeCurrentNodeData(data) {
      // console.log(data);
      if (data === null) {
        this.mytree.disabledDelete = true;
        this.mytree.disabledAdd = true;
        this.mytree.disabledAddType = true;
        this.mytree.disabledAddItem = true;
        this.mytree.disabledUp = true;
        this.mytree.disabledDown = true;
        this.mytree.disabledCut = true;

        this.activeTab = "tabItemType";
        // this.tabItemType.isShow = true;
        // this.tabItem.isShow = false;
        this.tabItemType.form.name = "";
        this.tabItemType.form.remark = "";
      } else {
        this.mytree.disabledDelete = data.nodeType === 0;
        this.mytree.disabledAdd = data.nodeType === 2;
        this.mytree.disabledAddType = data.nodeType === 2;
        this.mytree.disabledAddItem = data.nodeType === 2;
        this.mytree.disabledUp = data.nodeType === 0;
        this.mytree.disabledDown = data.nodeType === 0;
        this.mytree.disabledCut = data.nodeType === 0;
        // this.tabItemType.isShow = data.nodeType !== 2;
        // this.tabItem.isShow = data.nodeType === 2;
        this.activeTab = data.nodeType !== 2 ? "tabItemType" : "tabItem";
        // 更新内容
        const loading = this.$CommonUtils.showLoading();
        this.$CommonUtils.post("/api/ItemLib/getNodeContentByCid", "cid=" + data.cid, (successData) => {
          // console.log(successData);
          if (data.nodeType === 2) {
            this.tabItem.form.name = successData.name;
            this.tabItem.form.remark = successData.remark;
            this.tabItem.form.itemTypeId = successData.itemTypeId;
            this.tabItem.form.unit = successData.unit;
            this.tabItem.form.frequencyId = successData.frequencyId;
            this.tabItem.form.description = successData.description;
            this.tabItem.form.isUseable = successData.isUseable;
          } else {
            this.tabItemType.form.name = successData.name;
            this.tabItemType.form.remark = successData.remark;
          }
        });
        loading.close();
      }
    },

    /**
     * 当前节点发生变化，注意 为空时不触发
     */
    handleCurrentChange(data, node) {
      this.changeCurrentNodeData(data);
      // console.log(data.cid);
    },

    /**
     * 点击查询树
     */
    handleClickSearchTree() {
      this.mytree.searchIndex = -1;
      this.mytree.searchData = [];
      if (this.mytree.searchInput.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
        this.$message("请输入要查找的内容！");
        return;
      }
      this.mytree.searchData = this.mytree.sortTable.filter((item) => {
        return item.name.indexOf(this.mytree.searchInput) > -1; //返回符合查询条件的节点
      });
      if (this.mytree.searchData.length === 0) {
        this.$message("未找到任何匹配数据！");
        return;
      }
      this.focusSearchNode(0);
    },

    /**
     * 定位
     */
    focusSearchNode(index) {
      this.mytree.searchIndex = index;
      this.appendExpand(this.mytree.searchData[this.mytree.searchIndex].pid);
      this.focusNodeByKey(this.mytree.searchData[this.mytree.searchIndex].cid);
      this.$nextTick(() => {
        let node = document.querySelector("#mytree .is-current");
        node.scrollIntoView({ behavior: "smooth" });
      });
    },

    /**
     * 点击查询第一个
     */
    handleClickSearchFirst() {
      if (this.mytree.searchIndex === 0) {
        this.$message("已经是第一条");
        return;
      }
      this.focusSearchNode(0);
    },

    /**
     * 查询前一个
     */
    handleClickSearchPrev() {
      if (this.mytree.searchIndex === 0) {
        this.$message("已经是第一条");
        return;
      }
      this.focusSearchNode(this.mytree.searchIndex - 1);
    },

    /**
     * 查询下一个
     */
    handleClickSearchNext() {
      if (this.mytree.searchIndex === this.mytree.searchData.length - 1) {
        this.$message("已经是最后一条");
        return;
      }
      this.focusSearchNode(this.mytree.searchIndex + 1);
    },

    /**
     * 查询最后一个
     */
    handleClickSearchLast() {
      if (this.mytree.searchIndex === this.mytree.searchData.length - 1) {
        this.$message("已经是最后一条");
        return;
      }
      this.focusSearchNode(this.mytree.searchData.length - 1);
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
