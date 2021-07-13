import Cookies from "js-cookie";
import $ from "jquery";
import FileSaver from "file-saver";
import XLSX from "xlsx";

let CommonUtil = {
  prjName: process.env.PROJECT_NAME,
  axios: null,
  store: null,
  router: null,
  Vue: null,

  handleCloseHeader(path) {
    //需要激活关闭tab的路由，并设置销毁标记，再关闭此路由，销毁组件，恢复销毁标记。
    this.router.push({ path: path });
    this.store.commit("setTabDestory", true);
    this.store.commit("closeTab", { cur: this.store.state.tabPath, del: path });
  },

  relogin(msg) {
    this.Cookie.removeUser();
    let url = process.env.LOGIN_URL + window.location.href;
    // let url = "http://172.16.10.95/login?title=360度评估反馈&url=" + window.location.href;
    // window.open(url, "_self");
    //
    // this.Vue.prototype.$confirm("确定重新登录，状态信息：" + msg, "提示", {
    //   confirmButtonText: "确定",
    //   cancelButtonText: "取消",
    //   type: "warning",
    // })
    //   .then(async () => {
    //     this.Cookie.removeUser();
    //     let url = process.env.LOGIN_URL + window.location.href;
    //     // let url = "http://172.16.10.95/login?title=360度评估反馈&url=" + window.location.href;
    //     window.open(url, "_self");
    //   })
    //   .catch(() => {});
  },

  /**
   * 格式化时间
   * @param {Date} date 时间
   * @param {string} fmt 格式化字符串
   * @return {string} 返回格式化后的字符串
   */
  formatDate(date, fmt) {
    date.get;
    if (fmt === undefined) {
      fmt = "yyyy-MM-dd HH:mm:ss";
    }
    var obj = {
      yyyy: date.getFullYear(),
      yy: ("" + date.getFullYear()).slice(-2),
      M: date.getMonth() + 1,
      MM: ("0" + (date.getMonth() + 1)).slice(-2),
      d: date.getDate(),
      dd: ("0" + date.getDate()).slice(-2),
      H: date.getHours(),
      HH: ("0" + date.getHours()).slice(-2),
      h: date.getHours() % 12,
      hh: ("0" + (date.getHours() % 12)).slice(-2),
      m: date.getMinutes(),
      mm: ("0" + date.getMinutes()).slice(-2),
      s: date.getSeconds(),
      ss: ("0" + date.getSeconds()).slice(-2),
      S: date.getMilliseconds(),
      SSS: ("00" + date.getMilliseconds()).slice(-3),
      w: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()],
      q: Math.floor((date.getMonth() + 3) / 3),
    };
    return fmt.replace(/([a-z]+)/gi, function($1) {
      return obj[$1];
    });
  },

  /**
   * 获得一个新的GUID
   * @return {string} 返回一个新的GUID
   */
  getNewGuid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  },

  // 简单检查对象为空等
  isCheckNub0(obj) {
    return obj === null || obj === undefined || obj === "" || obj === 0;
  },

  // 简单检查对象为空等
  isCheckNub(obj) {
    return obj === null || obj === undefined || obj === "";
  },

  isNumber(v) {
    return typeof v === "number" && !isNaN(v);
  },

  // 数组中的对象属性是否已经存在
  isArrayExist(array, key, value) {
    for (let i = 0; i < array.length; ++i) {
      if (array[i][key] === value) {
        return true;
      }
    }
    return false;
  },

  /**
   * 获取对象数组中的对象
   * @param {*} array
   * @param {*} keyName
   * @param {*} key
   */
  getArrayObject(array, keyName, key) {
    for (let i = 0; i < array.length; ++i) {
      if (array[i][keyName] === key) {
        return array[i];
      }
    }
    return null;
  },

  // 获取对象数组中的对象属性，不存在则返回null
  getArrayObjectAttr(array, keyName, key, attrKey) {
    for (let i = 0; i < array.length; ++i) {
      if (array[i][keyName] === key) {
        return array[i][attrKey];
      }
    }
    return null;
  },

  getArrayMaxNumber(array, key) {
    let max = -1;
    array.forEach((i) => {
      if (i[key] > max) {
        max = i[key];
      }
    });
    return max;
  },

  Cookie: {
    /**
     * 设置Cookie
     * @param {string} key 名称
     * @param {*} value 数据或对象
     * @param {number} expms 超时毫秒数
     */
    set(key, value, expms) {
      let data = JSON.stringify({
        val: value,
        startTime: new Date().getTime(),
        expms: expms ? expms : 0,
      });
      Cookies.set(key, data);
    },

    /**
     * 获取Cookie
     * @param {string} key 名称
     * @return {*} 值或对象
     */
    get(key) {
      if (Cookies.get(key)) {
        let vals = Cookies.get(key); // 获取本地存储的值
        let data = JSON.parse(vals); // 将字符串转换成JSON对象
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
        if (data.expms > 0) {
          if (new Date().getTime() - data.startTime > data.expms) {
            Cookies.remove(key);
            return null;
          } else {
            return data.val;
          }
        } else {
          return data.val;
        }
      } else {
        return null;
      }
    },

    /**
     * 移除Cookie
     * @param {string} key 名称
     */
    remove(key) {
      Cookies.remove(key);
    },

    /**
     * 获取并重新延长Cookie
     * @param {string} key 名称
     * @return {*} 值或对象
     */
    getProlong(key) {
      if (Cookies.get(key)) {
        let vals = Cookies.get(key); // 获取本地存储的值
        let data = JSON.parse(vals); // 将字符串转换成JSON对象
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
        if (data.expms > 0) {
          if (new Date().getTime() - data.startTime > data.expms) {
            Cookies.remove(key);
            return null;
          } else {
            this.set(key, data.val, data.expms);
            return data.val;
          }
        } else {
          return data.val;
        }
      } else {
        return null;
      }
    },

    /**
     * 设置登录用户相关Cookie
     * @param {*} value 对象
     */
    setUser(value) {
      // 登录测试cookie设置1分钟 60 * 1000
      this.set(CommonUtil.prjName + "_COOKIE_USER", value, process.env.COOKIE_TIMEOUT);
    },

    /**
     * 获取登录用户相关Cookie
     * @return {object} 对象
     */
    getUser() {
      return this.get(CommonUtil.prjName + "_COOKIE_USER");
    },

    /**
     * 获取并重新延期登录用户相关Cookie
     * @return {object} 对象
     */
    getProlongUser() {
      return this.getProlong(CommonUtil.prjName + "_COOKIE_USER");
    },

    /**
     * 移除登录用户相关Cookie
     */
    removeUser() {
      this.remove(CommonUtil.prjName + "_COOKIE_USER");
    },
  },

  /**
   * 模态显示加载，使用返回对象进行关闭。ret.close()
   * spinner: "el-icon-loading",
   */
  showLoading() {
    return this.Vue.prototype.$loading({
      lock: false,
      text: "正在加载...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.0)",
    });
  },

  /**
   * 弹出消息
   * @param {*} msg
   */
  message(msg) {
    this.Vue.prototype.$message(msg);
  },

  /**
   * 删除确认框
   * @param {*} thenFunc
   */
  confirmDelete(thenFunc) {
    return this.Vue.prototype
      .$confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(thenFunc)
      .catch(() => {});
  },

  /**
   * 确认对话框
   * @param {*} msg
   */
  async confirmMessageBox(msg) {
    let ret = false;
    await this.Vue.prototype
      .$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        ret = true;
      })
      .catch(() => {});
    return ret;
  },

  /**
   * 封装axios的post函数，统一简化错误处理，
   * 可使用同步例如：await post("url", obj, async () => { await func(); });
   * @param {string} url 地址
   * @param {*} params 参数
   * @param {*} success 成功后回调，并传回返回值
   * @return {*} 返回Promise，可使用await同步
   */
  post(url, params, success, fail) {
  	console.log(url)
	  console.log(params)
    return this.axios
      .post(url, params)
      .then(async (response) => {
        if (response.data.code === 200) {
          if (arguments.length >= 3) {
            await success(response.data.data);
          }
        } else if (response.data.code === 20001) {
          // 未登录，响应拦截器统一处理
        } else {
          this.message(response.data.msg);
          if (arguments.length === 4) {
            await fail();
          }
        }
      })
      .catch(async (error) => {
        if (this.Cookie.getUser() != null) {
          this.message("操作失败。" + error);
          console.log("操作失败。" + error);
        }
        if (arguments.length === 4) {
          await fail();
        }
      });
  },

  checkToken(token) {
    $.ajax({
      url: process.env.VUE_APP_URL + "/sys/getUserByToken",
      type: "POST",
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      async: false,
      timeout: 600000,
      dataType: "json",
      headers: { token: token },
      success: (data) => {
        if (data.code === 200) {
          localStorage.setItem("LAST_USER_ID", data.data.id);
          this.Cookie.setUser({
            userId: data.data.id,
            empName: data.data.empName,
            loginTime: data.data.logontime,
            loginIp: data.data.ipaddress,
            token: token,
          });
        } else {
          this.relogin("checkToken fail, return != 200");
        }
      },
      error: (jqXHR) => {
        this.message("操作失败。" + jqXHR.statusText);
        console.log("操作失败。" + jqXHR.statusText);
        this.relogin("checkToken error");
      },
    });
  },

  initPermList() {
    // await this.post("/perm/getPermList", null, (successData) => {
    //   let permList = {};
    //   successData.forEach((v)=> {
    //     permList[v.cmdName] = {
    //       isAdd: v.isAdd > 0,
    //       isDel: v.isDel > 0,
    //       isMdy: v.isMdy > 0,
    //       isQry: v.isQry > 0,
    //       isAdu: v.isAdu > 0,
    //       isPerm: v.isAdd + v.isDel + v.isMdy + v.isQry + v.isAdu > 0,
    //     };
    //   });
    //   this.store.commit("setPermList", permList);
    // });
    $.ajax({
      url: process.env.VUE_APP_URL + "/sys/getPermList",
      type: "POST",
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      async: false,
      timeout: 60000,
      dataType: "json",
      headers: { token: this.Cookie.getUser().token },
      success: (data) => {
        if (data.code === 200) {
          let permList = {};
          data.data.forEach((v) => {
            permList[v.CmdName] = {
              add: v.IsAdd > 0,
              del: v.IsDel > 0,
              mdy: v.IsMdy > 0,
              qry: v.IsQry > 0,
              adu: v.IsAdu > 0,
              or: v.IsAdd + v.IsDel + v.IsMdy + v.IsQry + v.IsAdu > 0,
            };
          });
          this.store.commit("setPermList", permList);
        } else if (data.code === 401) {
          this.store.commit("setPermList", null);
          this.relogin("getPermList return 401");
          // 登出检测
        } else {
          this.store.commit("setPermList", null);
          this.message(data.msg);
        }
      },
      error: (jqXHR) => {
        this.message("操作失败。" + jqXHR.statusText);
        console.log("操作失败。" + jqXHR.statusText);
      },
    });
  },

  // type：0或1与，默认0
  isPermissive(cmdName, permNameList, type) {
    let permList = this.store.state.permList;
    if (!permList) {
      return false;
    }
    if (!permList[cmdName]) {
      return false;
    }
    if (!permNameList || permNameList.length === 0) {
      return true;
    }
    let ret = type === undefined || type === 0;
    for (let i = 0; i < permNameList.length; ++i) {
      if (permList[cmdName][permNameList[i]] == ret) {
        return ret;
      }
    }
    return !ret;
  },

  isMenuPermissive(cmdName) {
    return this.isPermissive(cmdName, ["or"]);
  },

  // 添加日志记录
  addLog(moduleName, eventType, eventAction, eventDesc) {
    this.post("/api/UserEventLog/addLog", {
      moduleName: moduleName,
      eventType: eventType,
      eventAction: eventAction,
      eventDesc: eventDesc,
    });
  },

  /**
   * 表格工具
   */
  Table: {
    /**
     * 获取当前行
     * @param {*} myTable
     */
    getCurrentRow(myTable) {
      return myTable.ref.store.states.currentRow;
    },

    getCurrentRowId(myTable) {
      if (myTable.ref.store.states.currentRow === null) {
        return "";
      } else {
        return myTable.ref.store.states.currentRow.id;
      }
    },

    getCurrentRowAttr(myTable, key, defaultValue) {
      if (myTable.ref.store.states.currentRow === null) {
        return defaultValue;
      } else {
        return myTable.ref.store.states.currentRow[key];
      }
    },

    /**
     * 设置当前行，但没有定位
     * @param {*} myTable
     * @param {*} row
     */
    setCurrentRow(myTable, row) {
      myTable.ref.setCurrentRow(row);
    },

    /**
     * 默认合计行格式
     * @param {*} param
     */
    getSummaries(param) {
      return [param.data.length + "行"];
    },

    getSummariesCheck(param) {
      return ["", param.data.length + "行"];
    },

    /**
     * 过滤列，默认方法
     * @param {*} value
     * @param {*} row
     * @param {*} column
     */
    filterMethod(value, row, column) {
      return row[column.property] === value;
    },

    /**
     * 刷新表格过滤值
     * @param {*} myTable
     */
    refreshFilters(myTable) {
      for (let key in myTable.filters) {
        let arr = myTable.data.map((item) => {
          return item[key];
        });
        arr = [...new Set(arr)];
        arr = arr.map((i) => {
          return { text: i, value: i };
        });
        myTable.filters[key] = arr;
      }
    },

    // 刷新表格高度，可用于初始化等需要判断是否为空
    refreshHeight(myTable) {
      if (myTable) {
        if (myTable.ref) {
          myTable.height = myTable.ref.$el.parentElement.clientHeight;
        }
      }
    },

    /**
     * 修正刷新合计行高度
     * @param {*} myTable 可能是number，也可能是string例如300px
     */
    refreshSummaryHeight(myTable) {
      let value = myTable.height;
      if (typeof value === "number") {
        myTable.height -= 0.5;
      } else {
        myTable.height = myTable.height.replace("px", "") - 0.5 + "px";
      }
      myTable.ref.$nextTick(() => {
        myTable.height = value;
      });
    },

    getSummarySum(param, keys) {
      let ret = {};
      keys.forEach((key) => {
        ret[key] = 0;
      });
      param.data.forEach((row) => {
        keys.forEach((key) => {
          let n = row[key];
          if (!isNaN(n)) {
            ret[key] += n;
          }
        });
      });
      for (let a in ret) {
        ret[a] = ret[a].fixFloatTail();
      }
      return ret;
    },

    /**
     * 定位到el-table指定行
     * @param {*} table 表格变量
     * @param {string} name 属性名称
     * @param {*} value 属性值
     */
    focusRow(myTable, name, value) {
      let ref = myTable.ref;
      ref.$nextTick(() => {
        for (let i = 0; i < ref.data.length; ++i) {
          if (ref.data[i][name] === value) {
            ref.setCurrentRow(ref.data[i]);
            let ele = ref.$el.querySelector(".el-table__body tbody tr");
            if (ele) {
              let height = ref.$el.querySelector(".el-table__body-wrapper").offsetHeight;
              let pos = ele.offsetHeight * i;
              if (pos < ref.bodyWrapper.scrollTop || pos > ref.bodyWrapper.scrollTop + height - ele.offsetHeight) {
                ref.bodyWrapper.scrollTop = pos;
              }
            }
            return;
          }
        }
      });
    },

    /**
     * 使用id定位到el-table指定行
     * @param {*} myTable 表格
     * @param {*} id 定位的id
     */
    focusRowById(myTable, id) {
      this.focusRow(myTable, "id", id);
    },

    // 带检查是否为空
    focusRowByOldRow(myTable, oldRow, key) {
      if (oldRow) {
        this.focusRow(myTable, key, oldRow[key]);
      }
    },

    /**
     * 弹出表格右键菜单
     * @param {*} row
     * @param {*} column
     * @param {*} event
     * @param {*} myTable
     */
    handleContextMenu(row, column, event, myTable) {
      event.preventDefault();
      if (row !== undefined) {
        myTable.ref.setCurrentRow(row);
        if (myTable.curCol) {
          myTable.curCol.index = column.index;
          myTable.curCol.label = column.label;
        }
      }
      let menu = document.querySelector("#" + myTable.menu.name);
      menu.style.width = myTable.menu.width;
      menu.style.position = "fixed";
      menu.style.zIndex = "999";
      menu.style.cursor = "pointer";
      menu.style.display = "block";
      menu.style.border = "1px solid #000";
      let clientRect = myTable.ref.$el.getBoundingClientRect();
      if (event.clientX - 8 + menu.offsetWidth > clientRect.right) {
        menu.style.left = clientRect.right - menu.offsetWidth + "px";
      } else {
        menu.style.left = event.clientX - 8 + "px";
      }
      if (event.clientY - 8 + menu.offsetHeight > clientRect.bottom) {
        menu.style.top = clientRect.bottom - menu.offsetHeight + "px";
      } else {
        menu.style.top = event.clientY - 8 + "px";
      }
      myTable.menu.isShow = true;
    },

    /**
     * 不弹出表格右键菜单，进定位行，由@contextmenu.native="onTestContextmenu"进行右键菜单操作。
     * @param {*} row
     * @param {*} column
     * @param {*} event
     * @param {*} myTable
     */
    handleContextMenuFocus(row, column, event, myTable) {
      event.preventDefault();
      if (row !== undefined) {
        myTable.ref.setCurrentRow(row);
        if (myTable.curCol) {
          myTable.curCol.index = column.index;
          myTable.curCol.label = column.label;
        }
      }
    },

    handleNativeDefaultContextmenu(event, contextmenu, myTable) {
      event.preventDefault();
      contextmenu({
        items: [
          {
            label: "导出表格",
            icon: "el-icon-download",
            onClick: () => {
              CommonUtil.Table.exportExcel(myTable);
            },
          },
        ],
        event,
        zIndex: 3,
      });
      return false;
    },

    // 删除当前选中行
    removeOneRowByKey(myTable, key) {
      if (myTable.data.length === 0) {
        CommonUtil.message("表格数据为空。");
        return;
      }
      let curRow = myTable.ref.store.states.currentRow;
      if (curRow === null) {
        CommonUtil.$message("请在表格中选择一行。");
        return;
      }
      let arr = myTable.data;
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i][key] === curRow[key]) {
          arr.splice(i, 1);
          break;
        }
      }
      this.refreshSummaryHeight(myTable);
    },

    // 删除勾选行
    removeSelectionByKey(myTable, key) {
      if (myTable.data.length === 0) {
        CommonUtil.message("表格数据为空");
        return;
      }
      if (myTable.ref.selection.length === 0) {
        CommonUtil.message("表格未勾选数据");
        return;
      }
      let sel = myTable.ref.selection;
      let arr = myTable.data;
      for (let i = sel.length - 1; i >= 0; --i) {
        for (let j = arr.length - 1; j >= 0; --j) {
          if (arr[j][key] === sel[i][key]) {
            arr.splice(j, 1);
            break;
          }
        }
      }
      this.refreshSummaryHeight(myTable);
    },

    // 全选
    selectAll(myTable) {
      myTable.data.forEach((row) => {
        myTable.ref.toggleRowSelection(row, true);
        // myTable.ref.selection.push(row);
      });
    },

    // 根据id数组，勾选行
    selectByIdList(myTable, idList) {
      idList.forEach((id) => {
        let row = CommonUtil.getArrayObject(myTable.data, "id", id);
        if (row !== null) {
          myTable.ref.toggleRowSelection(row, true);
          // myTable.ref.selection.push(row);
        }
      });
    },

    //单列排序
    sortByString(myTable, key) {
      myTable.data.sort((a, b) => {
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
        return 0;
      });
    },

    //多列排序
    sortByStringList(myTable, key) {
      myTable.data.sort((a, b) => {
        for (let i = 0; i < key.length; ++i) {
          if (a[key[i]] < b[key[i]]) {
            return -1;
          }
          if (a[key[i]] > b[key[i]]) {
            return 1;
          }
        }
        return 0;
      });
    },

    // 根据前一个字段的开始结束行号，判断合并。 有空再优化下
    // 注意，spanList顺序
    // 示例：
    // :span-method="(msg) => {return $CommonUtil.Table.spanMethod(qtcqTargetTable, msg);}"
    // spanList: [{ property: "unitName" }, { property: "empName" }, { property: "empNumber" }, { property: "deptName" }],
    spanMethod(myTable, msg) {
      for (let j = 0; j < myTable.spanList.length; ++j) {
        let property = myTable.spanList[j].property;
        if (property !== msg.column.property) {
          continue;
        }
        if (j === 0) {
          if (msg.rowIndex === 0) {
            myTable.spanList[j].begin = 0;
            myTable.spanList[j].end = 0;
            let rowCount = 1;
            for (let i = msg.rowIndex + 1; i < myTable.data.length; ++i) {
              if (msg.row[property] === myTable.data[i][property]) {
                ++rowCount;
              } else {
                break;
              }
            }
            myTable.spanList[j].begin = myTable.spanList[j].end;
            myTable.spanList[j].end = msg.rowIndex + rowCount;
            return {
              rowspan: rowCount,
              colspan: 1,
            };
          } else {
            if (msg.row[property] === myTable.data[msg.rowIndex - 1][property]) {
              return {
                rowspan: 0,
                colspan: 0,
              };
            } else {
              let rowCount = 1;
              for (let i = msg.rowIndex + 1; i < myTable.data.length; ++i) {
                if (msg.row[property] === myTable.data[i][property]) {
                  ++rowCount;
                } else {
                  break;
                }
              }
              myTable.spanList[j].begin = myTable.spanList[j].end;
              myTable.spanList[j].end = msg.rowIndex + rowCount;
              return {
                rowspan: rowCount,
                colspan: 1,
              };
            }
          }
        } else {
          if (msg.rowIndex === 0) {
            myTable.spanList[j].begin = 0;
            myTable.spanList[j].end = 0;
            let rowCount = 1;
            for (let i = msg.rowIndex + 1; i < myTable.data.length; ++i) {
              if (msg.row[property] === myTable.data[i][property] && msg.rowIndex + rowCount < myTable.spanList[j - 1].end) {
                ++rowCount;
              } else {
                break;
              }
            }
            myTable.spanList[j].begin = myTable.spanList[j].end;
            myTable.spanList[j].end = msg.rowIndex + rowCount;
            return {
              rowspan: rowCount,
              colspan: 1,
            };
          } else {
            if (msg.row[property] === myTable.data[msg.rowIndex - 1][property] && msg.rowIndex > myTable.spanList[j - 1].begin) {
              return {
                rowspan: 0,
                colspan: 0,
              };
            } else {
              let rowCount = 1;
              for (let i = msg.rowIndex + 1; i < myTable.data.length; ++i) {
                if (msg.row[property] === myTable.data[i][property] && msg.rowIndex + rowCount < myTable.spanList[j - 1].end) {
                  ++rowCount;
                } else {
                  break;
                }
              }
              myTable.spanList[j].begin = myTable.spanList[j].end;
              myTable.spanList[j].end = msg.rowIndex + rowCount;
              return {
                rowspan: rowCount,
                colspan: 1,
              };
            }
          }
        }
      }
    },

    // 导出excel表格，页面参考考核单元设置
    exportExcel(myTable) {
      let eleTable = document.querySelector("#" + myTable.name);
      if (!eleTable) {
        return null;
      }
      let eleFix = document.querySelector("#" + myTable.name + " .el-table__fixed");
      // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
      if (eleFix) {
        eleTable.removeChild(eleFix);
      }
      // 移除表头筛选等，还需多测试
      let headerList = document.querySelectorAll("#" + myTable.name + " .el-table__header .table-header > div");
      headerList.forEach((i) => {
        i.mParentElement = i.parentElement;
        i.parentElement.removeChild(i);
      });
      let wb = XLSX.utils.table_to_book(eleTable, { raw: true }); // true，全部使用字符串
      if (eleFix) {
        eleTable.appendChild(eleFix);
      }
      headerList.forEach((i) => {
        i.mParentElement.appendChild(i);
      });
      let wbout = XLSX.write(wb, { bookType: "xlsx", bookSST: true, type: "array" });
      try {
        FileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sheetjs" + new Date().format("yyyy_MM_dd_HH_mm_ss").replace(/_/g, "") + ".xlsx");
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
  },

  NlTable: {
    /**
     * 获取当前行
     * @param {*} myTable
     */
    getCurrentRow(myTable) {
      return myTable.ref.elTable.store.states.currentRow;
    },

    getCurrentRowId(myTable) {
      if (myTable.ref.elTable.store.states.currentRow === null) {
        return "";
      } else {
        return myTable.ref.elTable.store.states.currentRow.id;
      }
    },

    getCurrentRowAttr(myTable, key, defaultValue) {
      if (myTable.ref.elTable.store.states.currentRow === null) {
        return defaultValue;
      } else {
        return myTable.ref.elTable.store.states.currentRow[key];
      }
    },

    /**
     * 设置当前行，但没有定位
     * @param {*} myTable
     * @param {*} row
     */
    setCurrentRow(myTable, row) {
      myTable.ref.elTable.setCurrentRow(row);
    },

    // 刷新表格高度，可用于初始化等需要判断是否为空
    refreshHeight(myTable) {
      if (myTable) {
        if (myTable.ref) {
          myTable.height = myTable.ref.elTable.$el.parentElement.clientHeight;
        }
      }
    },

    /**
     * 修正刷新合计行高度
     * @param {*} myTable 可能是number，也可能是string例如300px
     */
    refreshSummaryHeight(myTable) {
      let value = myTable.height;
      if (typeof value === "number") {
        myTable.height -= 0.5;
      } else {
        myTable.height = myTable.height.replace("px", "") - 0.5 + "px";
      }
      myTable.ref.$nextTick(() => {
        myTable.height = value;
      });
    },

    /**
     * 定位到el-table指定行
     * @param {*} table 表格变量
     * @param {string} name 属性名称
     * @param {*} value 属性值
     */
    focusRow(myTable, name, value) {
      let ref = myTable.ref.elTable;
      ref.$nextTick(() => {
        for (let i = 0; i < ref.data.length; ++i) {
          if (ref.data[i][name] === value) {
            ref.setCurrentRow(ref.data[i]);
            let ele = ref.$el.querySelector(".el-table__body tbody tr");
            if (ele) {
              let height = ref.$el.querySelector(".el-table__body-wrapper").offsetHeight;
              let pos = ele.offsetHeight * i;
              if (pos < ref.bodyWrapper.scrollTop || pos > ref.bodyWrapper.scrollTop + height - ele.offsetHeight) {
                ref.bodyWrapper.scrollTop = pos;
              }
            }
            return;
          }
        }
      });
    },

    /**
     * 使用id定位到el-table指定行
     * @param {*} myTable 表格
     * @param {*} id 定位的id
     */
    focusRowById(myTable, id) {
      this.focusRow(myTable, "id", id);
    },

    // 全选
    selectAll(myTable) {
      myTable.data.forEach((row) => {
        myTable.ref.elTable.toggleRowSelection(row, true);
        // myTable.ref.elTable.selection.push(row);
      });
    },

    // 根据id数组，勾选行
    selectByIdList(myTable, idList) {
      idList.forEach((id) => {
        let row = CommonUtil.getArrayObject(myTable.data, "id", id);
        if (row !== null) {
          myTable.ref.elTable.toggleRowSelection(row, true);
          // myTable.ref.selection.push(row);
        }
      });
    },

    /**
     * 弹出表格右键菜单
     * @param {*} row
     * @param {*} column
     * @param {*} event
     * @param {*} myTable
     */
    handleContextMenu(row, column, event, myTable) {
      event.preventDefault();
      if (row !== undefined) {
        myTable.ref.elTable.setCurrentRow(row);
        if (myTable.curCol) {
          myTable.curCol.index = column.index;
          myTable.curCol.label = column.label;
        }
      }
      let menu = document.querySelector("#" + myTable.menu.name);
      menu.style.width = myTable.menu.width;
      menu.style.position = "fixed";
      menu.style.zIndex = "999";
      menu.style.cursor = "pointer";
      menu.style.display = "block";
      menu.style.border = "1px solid #000";
      let clientRect = myTable.ref.elTable.$el.getBoundingClientRect();
      if (event.clientX - 8 + menu.offsetWidth > clientRect.right) {
        menu.style.left = clientRect.right - menu.offsetWidth + "px";
      } else {
        menu.style.left = event.clientX - 8 + "px";
      }
      if (event.clientY - 8 + menu.offsetHeight > clientRect.bottom) {
        menu.style.top = clientRect.bottom - menu.offsetHeight + "px";
      } else {
        menu.style.top = event.clientY - 8 + "px";
      }
      myTable.menu.isShow = true;
    },

    /**
     * 不弹出表格右键菜单，进定位行，由@contextmenu.native="onTestContextmenu"进行右键菜单操作。
     * @param {*} row
     * @param {*} column
     * @param {*} event
     * @param {*} myTable
     */
    handleContextMenuFocus(row, column, event, myTable) {
      event.preventDefault();
      if (row !== undefined) {
        myTable.ref.elTable.setCurrentRow(row);
        if (myTable.curCol) {
          myTable.curCol.index = column.index;
          myTable.curCol.label = column.label;
        }
      }
    },

    handleNativeDefaultContextmenu(event, contextmenu, myTable) {
      return CommonUtil.Table.handleNativeDefaultContextmenu(event, contextmenu, myTable);
    },

    // 根据前一个字段的开始结束行号，判断合并。 有空再优化下
    // 注意，spanList顺序
    // 示例：
    // :span-method="(msg) => {return $CommonUtil.NlTable.spanMethod(qtcqTargetTable, msg);}"
    // spanList: [{ property: "unitName" }, { property: "empName" }, { property: "empNumber" }, { property: "deptName" }],
    spanMethod(myTable, msg) {
      for (let j = 0; j < myTable.spanList.length; ++j) {
        let property = myTable.spanList[j].property;
        if (property !== msg.column.property) {
          continue;
        }
        if (j === 0) {
          if (msg.rowIndex === 0) {
            myTable.spanList[j].begin = 0;
            myTable.spanList[j].end = 0;
            let rowCount = 1;
            for (let i = msg.rowIndex + 1; i < myTable.ref.filterData.length; ++i) {
              if (msg.row[property] === myTable.ref.filterData[i][property]) {
                ++rowCount;
              } else {
                break;
              }
            }
            myTable.spanList[j].begin = myTable.spanList[j].end;
            myTable.spanList[j].end = msg.rowIndex + rowCount;
            return {
              rowspan: rowCount,
              colspan: 1,
            };
          } else {
            if (msg.row[property] === myTable.ref.filterData[msg.rowIndex - 1][property]) {
              return {
                rowspan: 0,
                colspan: 0,
              };
            } else {
              let rowCount = 1;
              for (let i = msg.rowIndex + 1; i < myTable.ref.filterData.length; ++i) {
                if (msg.row[property] === myTable.ref.filterData[i][property]) {
                  ++rowCount;
                } else {
                  break;
                }
              }
              myTable.spanList[j].begin = myTable.spanList[j].end;
              myTable.spanList[j].end = msg.rowIndex + rowCount;
              return {
                rowspan: rowCount,
                colspan: 1,
              };
            }
          }
        } else {
          if (msg.rowIndex === 0) {
            myTable.spanList[j].begin = 0;
            myTable.spanList[j].end = 0;
            let rowCount = 1;
            for (let i = msg.rowIndex + 1; i < myTable.ref.filterData.length; ++i) {
              if (msg.row[property] === myTable.ref.filterData[i][property] && msg.rowIndex + rowCount < myTable.spanList[j - 1].end) {
                ++rowCount;
              } else {
                break;
              }
            }
            myTable.spanList[j].begin = myTable.spanList[j].end;
            myTable.spanList[j].end = msg.rowIndex + rowCount;
            return {
              rowspan: rowCount,
              colspan: 1,
            };
          } else {
            if (msg.row[property] === myTable.ref.filterData[msg.rowIndex - 1][property] && msg.rowIndex > myTable.spanList[j - 1].begin) {
              return {
                rowspan: 0,
                colspan: 0,
              };
            } else {
              let rowCount = 1;
              for (let i = msg.rowIndex + 1; i < myTable.ref.filterData.length; ++i) {
                if (msg.row[property] === myTable.ref.filterData[i][property] && msg.rowIndex + rowCount < myTable.spanList[j - 1].end) {
                  ++rowCount;
                } else {
                  break;
                }
              }
              myTable.spanList[j].begin = myTable.spanList[j].end;
              myTable.spanList[j].end = msg.rowIndex + rowCount;
              return {
                rowspan: rowCount,
                colspan: 1,
              };
            }
          }
        }
      }
    },

    // 导出excel表格，页面参考考核单元设置
    exportExcel(myTable) {
      let eleTable = myTable.ref.elTable.$el;
      if (!eleTable) {
        return null;
      }
      let eleFix = eleTable.querySelector(".el-table__fixed");
      // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
      if (eleFix) {
        eleTable.removeChild(eleFix);
      }
      // 移除表头筛选等，还需多测试
      let headerList = eleTable.querySelectorAll(".el-table__header .table-header > div");
      headerList.forEach((i) => {
        i.mParentElement = i.parentElement;
        i.parentElement.removeChild(i);
      });
      let wb = XLSX.utils.table_to_book(eleTable, { raw: true }); // true，全部使用字符串
      if (eleFix) {
        eleTable.appendChild(eleFix);
      }
      headerList.forEach((i) => {
        i.mParentElement.appendChild(i);
      });
      let wbout = XLSX.write(wb, { bookType: "xlsx", bookSST: true, type: "array" });
      try {
        FileSaver.saveAs(new Blob([wbout], { type: "application/octet-stream" }), "sheetjs" + new Date().format("yyyy_MM_dd_HH_mm_ss").replace(/_/g, "") + ".xlsx");
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
  },

  NlLazyFilterTable: {

    getCurrentRow(myTable) {
      return CommonUtil.NlTable.getCurrentRow(myTable);
    },

    getCurrentRowId(myTable) {
      return CommonUtil.NlTable.getCurrentRowId(myTable);
    },

    getCurrentRowAttr(myTable, key, defaultValue) {
      CommonUtil.NlTable.getCurrentRowAttr(myTable, key, defaultValue);
    },

    setCurrentRow(myTable, row) {
      CommonUtil.NlTable.setCurrentRow(myTable, row);
    },

    refreshHeight(myTable) {
      CommonUtil.NlTable.refreshHeight(myTable);
    },

    refreshSummaryHeight(myTable) {
      CommonUtil.NlTable.refreshSummaryHeight(myTable);
    },

    focusRow(myTable, name, value) {
      CommonUtil.NlTable.focusRow(myTable, name, value);
    },

    focusRowById(myTable, id) {
      CommonUtil.NlTable.focusRowById(myTable, id);
    },

    selectAll(myTable) {
      CommonUtil.NlTable.selectAll(myTable);
    },

    selectByIdList(myTable, idList) {
      CommonUtil.NlTable.selectByIdList(myTable, idList);
    },

    handleContextMenu(row, column, event, myTable) {
      CommonUtil.NlTable.handleContextMenu(row, column, event, myTable);
    },

    handleContextMenuFocus(row, column, event, myTable) {
      CommonUtil.NlTable.handleContextMenuFocus(row, column, event, myTable);
    },

    handleNativeDefaultContextmenu(event, contextmenu, myTable) {
      event.preventDefault();
      contextmenu({
        items: [
          {
            label: "导出表格",
            icon: "el-icon-download",
            onClick: () => {
              myTable.ref.exportTable();
            },
          },
        ],
        event,
        zIndex: 3,
      });
      return false;
    },

    // 根据前一个字段的开始结束行号，判断合并。 有空再优化下
    // 注意，spanList顺序
    // 示例：
    // :span-method="(msg) => {return $CommonUtil.NlTable.spanMethod(qtcqTargetTable, msg);}"
    // spanList: [{ property: "unitName" }, { property: "empName" }, { property: "empNumber" }, { property: "deptName" }],
    spanMethod(myTable, msg) {
      for (let j = 0; j < myTable.spanList.length; ++j) {
        let property = myTable.spanList[j].property;
        if (property !== msg.column.property) {
          continue;
        }
        if (j === 0) {
          if (msg.rowIndex === 0) {
            myTable.spanList[j].begin = 0;
            myTable.spanList[j].end = 0;
            let rowCount = 1;
            for (let i = msg.rowIndex + 1; i < myTable.ref.renderData.length; ++i) {
              if (msg.row[property] === myTable.ref.renderData[i][property]) {
                ++rowCount;
              } else {
                break;
              }
            }
            myTable.spanList[j].begin = myTable.spanList[j].end;
            myTable.spanList[j].end = msg.rowIndex + rowCount;
            return {
              rowspan: rowCount,
              colspan: 1,
            };
          } else {
            if (msg.row[property] === myTable.ref.renderData[msg.rowIndex - 1][property]) {
              return {
                rowspan: 0,
                colspan: 0,
              };
            } else {
              let rowCount = 1;
              for (let i = msg.rowIndex + 1; i < myTable.ref.renderData.length; ++i) {
                if (msg.row[property] === myTable.ref.renderData[i][property]) {
                  ++rowCount;
                } else {
                  break;
                }
              }
              myTable.spanList[j].begin = myTable.spanList[j].end;
              myTable.spanList[j].end = msg.rowIndex + rowCount;
              return {
                rowspan: rowCount,
                colspan: 1,
              };
            }
          }
        } else {
          if (msg.rowIndex === 0) {
            myTable.spanList[j].begin = 0;
            myTable.spanList[j].end = 0;
            let rowCount = 1;
            for (let i = msg.rowIndex + 1; i < myTable.ref.renderData.length; ++i) {
              if (msg.row[property] === myTable.ref.renderData[i][property] && msg.rowIndex + rowCount < myTable.spanList[j - 1].end) {
                ++rowCount;
              } else {
                break;
              }
            }
            myTable.spanList[j].begin = myTable.spanList[j].end;
            myTable.spanList[j].end = msg.rowIndex + rowCount;
            return {
              rowspan: rowCount,
              colspan: 1,
            };
          } else {
            if (msg.row[property] === myTable.ref.renderData[msg.rowIndex - 1][property] && msg.rowIndex > myTable.spanList[j - 1].begin) {
              return {
                rowspan: 0,
                colspan: 0,
              };
            } else {
              let rowCount = 1;
              for (let i = msg.rowIndex + 1; i < myTable.ref.renderData.length; ++i) {
                if (msg.row[property] === myTable.ref.renderData[i][property] && msg.rowIndex + rowCount < myTable.spanList[j - 1].end) {
                  ++rowCount;
                } else {
                  break;
                }
              }
              myTable.spanList[j].begin = myTable.spanList[j].end;
              myTable.spanList[j].end = msg.rowIndex + rowCount;
              return {
                rowspan: rowCount,
                colspan: 1,
              };
            }
          }
        }
      }
    },
  },

  /**
   * 树控件工具
   */
  Tree: {
    /**
     * 根据一个pid，创建此pid下面的树形结构，用于刷新树
     */
    getTreeData(treeNodeTableData, pid) {
      function sortSeq(a, b) {
        return a.seq - b.seq;
      }
      let treeArr = [];
      for (let i = 0; i < treeNodeTableData.length; ++i) {
        let node = treeNodeTableData[i];
        if (node.pid === pid) {
          let newNode = { ...node, children: this.getTreeData(treeNodeTableData, node.cid) };
          newNode.children.sort(sortSeq); // 根据seq排序
          treeArr.push(newNode);
        }
      }
      return treeArr;
    },

    /**
     * 遍历树形结构，生成搜索顺序表
     */
    refreshSortTable(myTree) {
      function setSortTable(node, arr) {
        arr.push(node);
        // 动态生成的节点，没有children属性
        if (node.children !== undefined) {
          for (let i = 0; i < node.children.length; ++i) {
            setSortTable(node.children[i], arr);
          }
        }
      }
      myTree.sortTable = [];
      setSortTable(myTree.data[0], myTree.sortTable);
    },

    /**
     * 添加一个展开节点
     */
    appendExpand(myTree, key) {
      for (var i = 0; i < myTree.expandKeys.length; ++i) {
        if (myTree.expandKeys[i] >= key) {
          if (myTree.expandKeys[i] > key) {
            myTree.expandKeys.splice(i, 0, key);
          }
          return;
        }
      }
      myTree.expandKeys.push(key);
    },

    /**
     * 简单移除一个展开节点，不移除子孙展开节点
     */
    removeExpandSimple(myTree, key) {
      for (var i = 0; i < myTree.expandKeys.length; ++i) {
        if (myTree.expandKeys[i] >= key) {
          if (myTree.expandKeys[i] === key) {
            myTree.expandKeys.splice(i, 1);
          }
          return;
        }
      }
    },

    /**
     * 移除一个展开节点，并且移除所有子孙展开节点
     */
    removeExpand(myTree, key) {
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
      let node = myTree.ref.getNode(key);
      searchTree(node, arr);
      for (let i = 0; i < arr.length; ++i) {
        this.removeExpandSimple(myTree, arr[i]);
      }
    },

    /**
     * 定位节点，并触发changeCurrentNodeData
     */
    focusNodeByKey(myTree, key) {
      let pnode = myTree.ref.getNode(key);
      myTree.ref.setCurrentNode(pnode.data);
      myTree.onChangeCurrentNodeData(pnode.data);
    },

    /**
     * 定位查询索引节点
     */
    focusSearchNode(myTree, index) {
      myTree.searchIndex = index;
      this.appendExpand(myTree, myTree.searchData[myTree.searchIndex].pid);
      this.focusNodeByKey(myTree, myTree.searchData[myTree.searchIndex].cid);
      myTree.ref.$nextTick(() => {
        // 节点展开需要时间
        setTimeout(() => {
          let node = document.querySelector("#" + myTree.name + " .is-current");
          node.scrollIntoView({ behavior: "smooth" });
        }, 200);
      });
    },

    /**
     * 点击查询树
     */
    handleClickSearchTree(myTree) {
      myTree.searchIndex = -1;
      myTree.searchData = [];
      if (myTree.searchInput.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
        CommonUtil.message("请输入要查找的内容！");
        return;
      }
      myTree.searchData = myTree.sortTable.filter((item) => {
        return item.name.indexOf(myTree.searchInput) > -1; //返回符合查询条件的节点
      });
      if (myTree.searchData.length === 0) {
        CommonUtil.message("未找到任何匹配数据！");
        return;
      }
      this.focusSearchNode(myTree, 0);
    },

    /**
     * 点击查询第一个
     */
    handleClickSearchFirst(myTree) {
      if (myTree.searchIndex === 0) {
        CommonUtil.message("已经是第一条");
        if (myTree.ref.getCurrentNode().cid !== myTree.searchData[myTree.searchIndex].cid) {
          this.focusSearchNode(myTree, myTree.searchIndex);
        }
        return;
      }
      this.focusSearchNode(myTree, 0);
    },

    /**
     * 查询前一个
     */
    handleClickSearchPrev(myTree) {
      if (myTree.searchIndex === 0) {
        CommonUtil.message("已经是第一条");
        if (myTree.ref.getCurrentNode().cid !== myTree.searchData[myTree.searchIndex].cid) {
          this.focusSearchNode(myTree, myTree.searchIndex);
        }
        return;
      }
      this.focusSearchNode(myTree, myTree.searchIndex - 1);
    },

    /**
     * 查询下一个
     */
    handleClickSearchNext(myTree) {
      if (myTree.searchIndex === myTree.searchData.length - 1) {
        CommonUtil.message("已经是最后一条");
        if (myTree.ref.getCurrentNode().cid !== myTree.searchData[myTree.searchIndex].cid) {
          this.focusSearchNode(myTree, myTree.searchIndex);
        }
        return;
      }
      this.focusSearchNode(myTree, myTree.searchIndex + 1);
    },

    /**
     * 查询最后一个
     */
    handleClickSearchLast(myTree) {
      if (myTree.searchIndex === myTree.searchData.length - 1) {
        CommonUtil.message("已经是最后一条");
        if (myTree.ref.getCurrentNode().cid !== myTree.searchData[myTree.searchIndex].cid) {
          this.focusSearchNode(myTree, myTree.searchIndex);
        }
        return;
      }
      this.focusSearchNode(myTree, myTree.searchData.length - 1);
    },
  },
};

export default CommonUtil;
