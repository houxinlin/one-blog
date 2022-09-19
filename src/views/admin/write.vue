<template>
  <el-button @click="loadCacheBlog(true)" style="margin-bottom:10px" size="mini">加载草稿</el-button>
  <div id="markdown"></div>
  <el-form ref="form">
    <el-form-item label="标题">
      <el-input v-model="title"></el-input>
    </el-form-item>
    <el-form-item label="类别">
      <el-select v-model="type" placeholder="选择分类">
        <el-option v-for="item in typeList" :key="item.id" :label="item.classify" :value="item.classify"></el-option>
        <el-option label="日记" value="日记"></el-option>
        <el-option label="随笔" value="随笔"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="描述">
      <el-input v-model="desc" type="textarea"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">发布</el-button>
    </el-form-item>
  </el-form>

  <el-dialog v-model="cacheDialogTableVisible" title="操作">
    <el-scrollbar height="400px">
      <el-table :data="cacheBlog">
        <el-table-column property="title" label="标题" width="150"></el-table-column>
        <el-table-column property="address" label="操作">
          <template #default="scope">
            <el-button size="mini" @click="loadCacheToEdit(scope.$index, scope.row)">加载</el-button>
            <el-button size="mini" type="danger" @click="deleteCacheBlog(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

  </el-dialog>

</template>

<script>
import { onMounted, onUnmounted, reactive, toRefs } from "vue";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Editor from "@toast-ui/editor";
import "../../assets/css/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { ElLoading } from "element-plus";
import { ElMessage } from "element-plus";
import {
  addBlogApi,
  listClassifyApi,
  getMarkdownContentApi,
} from "../../apis/blog";
import router from "../../router/index";

export default {

  mounted() {
    this.cacheBlog = JSON.parse(localStorage.getItem("cacheblog")) || {};
    this.cacheRandomKey = this.randomKey();
    console.log(this.autoSaveIntervalId);

    this.autoSaveIntervalId = setInterval(() => { this.autoSave(); }, 1000);
    let id = router.currentRoute.value.query.id;
    listClassifyApi().then((res) => {
      this.typeList = res.data.data;
    });
    //如果存在id，则表示编辑，先获取对应id下的内容
    if (id) {
      getMarkdownContentApi({ id }).then((res) => {
        let blog = res.data.data;
        this.title = blog.blogTitle;
        this.type = blog.classifyId;
        this.desc = blog.blogDescribe;
        this.editor = new Editor({
          el: document.querySelector("#markdown"),
          height: "500px",
          previewStyle: "vertical",
          initialValue: blog.markdownContent,
        });
      });
      return;
    }
    this.editor = new Editor({
      el: document.querySelector("#markdown"),
      height: "500px",
      previewStyle: "vertical",
      initialValue: "## ",
    });
  },

  setup() {

    const state = reactive({
      autoSaveFlag: true,
      cacheBlog: [],
      title: "",
      desc: "",
      type: "",
      typeList: [],
      cacheDialogTableVisible: false,
      editor: null,
      cacheRandomKey: "",
      autoSaveIntervalId: null
    });

    const randomKey = () => {
      let strs = "qwertyuiopsdfghjklzxcvbnm123456789QWERTYUIOPASDFGHJKLZXCVBNM";
      let result = "";
      for (let i = 0; i < 15; i++) {
        let index = Math.floor(Math.random() * strs.length);
        result += strs.charAt(index);
      }
      return result;
    }
    /**
     * 自动保存
     *
     */
    const autoSave = () => {
      //有id不保存，意思为编辑文章，markdown数量小于10不保存，
      if (state.editor.getMarkdown().length < 10) return;
      let cache = JSON.parse(localStorage.getItem("cacheblog")) || {};
      cache[state.cacheRandomKey] = JSON.stringify({ title: state.title, content: state.editor.getMarkdown() });
      let str = JSON.stringify(cache);
      if (state.autoSaveFlag) localStorage.setItem("cacheblog", str);

    };
    /**
     * 编辑草稿
     */
    const loadCacheToEdit = (i, item) => {
      state.title = item.title;
      state.cacheRandomKey = item.key;
      state.editor = new Editor({
        el: document.querySelector("#markdown"),
        height: "500px",
        previewStyle: "vertical",
        initialValue: item.content,
      });
      state.cacheDialogTableVisible = false;
    };

    /**
     * 加载草稿
     */
    const loadCacheBlog = (show = false) => {
      let cacheArrays = [];
      let cache = JSON.parse(localStorage.getItem("cacheblog")) || {};
      for (let val of Object.keys(cache)) {
        let item = JSON.parse(cache[val]);
        item.key = val;
        cacheArrays.push(item);
      }
      state.cacheDialogTableVisible = show;
      state.cacheBlog = cacheArrays;
    };
    /**
     * 删除本地草稿，并重新加载草稿列表
     */
    const deleteCacheBlog = (i, item, showCacheDialog = true) => {
      state.autoSaveFlag = false;
      let cache = JSON.parse(localStorage.getItem("cacheblog")) || {};
      delete cache[item.key];
      state.cacheBlog.length = 0;
      localStorage.setItem("cacheblog", JSON.stringify(cache));
      // loadCacheBlog(showCacheDialog);
      ElMessage({ message: "删除成功", type: "success", duration: 1000, });
      state.autoSaveFlag = true;
    };
    onUnmounted(() => {
      clearInterval(state.autoSaveIntervalId);
    })
    const onSubmit = () => {
      let body = {
        id: router.currentRoute.value.query.id,
        blogTitle: state.title,
        markdownContent: state.editor.getMarkdown(),
        classifyId: state.type,
        blogDescribe: state.desc,
      };
      // return
      const loading = ElLoading.service({
        lock: true,
        text: "发布中",
        spinner: "el-icon-loading",
        background: "#ffffffcf",
      });

      autoSave();
      state.autoSaveFlag = false;

      addBlogApi(body).then((res) => {
        loading.close();
        setTimeout(() => {
          deleteCacheBlog(0, { "key": state.cacheRandomKey }, false);
          router.push({ path: "/article", });
        }, 1500);
        ElMessage({ message: "发布成功", type: "success", duration: 1000, });
      });
    };
    return {
      ...toRefs(state),
      deleteCacheBlog,
      loadCacheBlog,
      loadCacheToEdit,
      onSubmit,
      autoSave,
      randomKey
    };
  },
};
</script>,

<style lang="less" scoped>
#markdown {
  margin-bottom: 10px;
}
</style>