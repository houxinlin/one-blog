<template>
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
</template>

<script>
import { reactive, toRefs } from "vue";
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
    this.editor = new Editor({
      el: document.querySelector("#markdown"),
      height: "500px",
      previewStyle: "vertical",
    });
    let id = router.currentRoute.value.query.id;

    listClassifyApi().then((res) => {
      this.typeList = res.data.data;
    });
    if (id) {
      getMarkdownContentApi({ id: id }).then((res) => {
        console.log(res);
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
      initialValue: " ",
    });
  },

  setup() {
    const state = reactive({
      title: "",
      desc: "",
      type: "",
      typeList: [],
      editor: null,
    });

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
      addBlogApi(body).then((res) => {
        console.log(res);
        loading.close();
        ElMessage({
          message: "发布成功",
          type: "success",
        });
        router.push({
          path:"/article"
        })
      });
    };
    return { ...toRefs(state), onSubmit };
  },
};
</script>,

<style lang="less" scoped>
#markdown {
  margin-bottom: 10px;
}
</style>