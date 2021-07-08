<template>
  <div :id="editorId" type="text/plain" :style="{ height: height, width: width }"></div>
</template>

<script>
//  utf8-jsp
// ueditor-gbk-jsp
import "./utf8-jsp/ueditor.config.js";
import "./utf8-jsp/ueditor.all.min.js";
import "./utf8-jsp/lang/zh-cn/zh-cn.js";
import "./utf8-jsp/themes/default/css/ueditor.css";

const toolbarsFull = ["fullscreen"]; //'source', '|',]
const toolbarsEdit = ["undo", "redo"]; // '|',]
const toolbarsFont = ["bold", "italic", "underline", "fontborder", "strikethrough", "superscript", "subscript", "removeformat", "formatmatch", "autotypeset", "blockquote", "pasteplain"]; // '|',]
const toolbarsStyle = ["forecolor", "backcolor", "insertorderedlist", "insertunorderedlist", "selectall", "cleardoc"]; //'|',]
const toolbarsP = ["rowspacingtop", "rowspacingbottom", "lineheight"]; //'|',]
const toolbarsSpan = ["customstyle", "paragraph", "fontfamily", "fontsize"]; //'|',]
const toolbarsDir = [
  "directionalityltr",
  "directionalityrtl",
  "indent", //'|',
  "justifyleft",
  "justifycenter",
  "justifyright",
  "justifyjustify",
]; // '|', ]
const toolbarsCase = ["touppercase", "tolowercase"]; // '|',]
const toolbarsHref = ["link", "unlink", "anchor"]; //'|',]
//'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
//'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
const toolbarsTool = ["horizontal", "date", "time", "spechars"]; //'snapscreen', 'wordimage', '|',]
const toolbarsTable = [
  "inserttable",
  "deletetable",
  "insertparagraphbeforetable",
  "insertrow",
  "deleterow",
  "insertcol",
  "deletecol",
  "mergecells",
  "mergeright",
  "mergedown",
  "splittocells",
  "splittorows",
  "splittocols",
  "charts",
]; // '|',]
const toolbarsExtra = ["print", "preview", "searchreplace", "drafts", "help"];

export default {
  // name: "editor",
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          // eslint-
          toolbars: [
            [
              ...toolbarsFull,
              ...toolbarsFont,
              "|",
              ...toolbarsStyle,
              "|",
              ...toolbarsP,
              "|",
              ...toolbarsSpan,
              "|",
              ...toolbarsEdit,
              "|",
              ...toolbarsDir,
              "|",
              ...toolbarsCase,
              "|",
              ...toolbarsHref,
              "|",
              ...toolbarsTool,
              "|",
              ...toolbarsTable,
              "|",
              ...toolbarsExtra,
            ],
          ],
        };
      },
    },
    editorId: { type: String, default: "editor" },
    value: { type: String, default: "" },
    height: { type: String, default: "300px" },
    width: { type: String, default: "1000px" },
  },
  data() {
    return { editor: null };
  },
  mounted() {
    const _this = this;
    this.editor = window.UE.getEditor(this.editorId, this.config);
    this.editor.addListener("ready", function() {
      _this.editor.setContent(_this.value);
    });
  },
  destroyed() {
    this.editor.destroy();
  },
  methods: {
    // 文字内容相关
    hasContents() {
      return this.editor.hasContents();
    },
    getPlainText() {
      return this.editor.getPlainTxt();
    },
    getContent() {
      return this.editor.getContent();
    },
    setContent(data) {
      return this.editor.setContent(data);
    },
    getAllHtml() {
      return this.editor.getAllHtml();
    },
    // 焦点
    setFocus(toEnd) {
      return this.editor.focus(isEnd);
    },
    // 命令相关
    execCommand(cmdName) {
      return this.editor.execCommand(cmdName);
    },
    queryCommandState(cmdName) {
      return this.editor.queryCommandState(cmdName);
    },
    queryCommandValue(cmdName) {
      return this.editor.queryCommandValue(cmdName);
    },
    // 是否可用
    setEnabled() {
      return this.editor.setEnabled();
    },
    setDisabled() {
      return this.editor.setDisabled();
    },
    setHide() {
      return this.editor.setHide();
    },
    setShow() {
      return this.editor.setShow();
    },
  },
};
</script>

<style scoped>
div {
  line-height: 0;
}
</style>
<style>
.edui-default .edui-editor-breadcrumb {
  text-align: left !important;
}
</style>
