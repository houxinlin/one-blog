<template>
  <el-table v-loading="loading" :data="listBlogs" height="93%" style="width: 100%">
    <el-table-column prop="id" label="id" width="180" />
    <el-table-column prop="blogTitle" label="标题" width="180" />
    <el-table-column prop="createDate" label="创建时间" />
    <el-table-column prop="watchCount" label="浏览数" />
    <el-table-column prop="classifyId" label="分类" />
    <el-table-column prop="address" label="操作">
      <template #default="scope">
        <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" icon="el-icon-info" icon-color="red" title="是否确定删除?" @confirm="confirmDeleteEvent( scope.$index, scope.row.id)" @cancel="cancelEvent">
          <template #reference>
            <el-button type="danger">删除</el-button>
          </template>
        </el-popconfirm>

        <el-button @click="editArticle(scope.$index, scope.row.id)" type="success">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="prev, pager, next" :page-size="pageSize" :total="blogTotal">
  </el-pagination>
</template>

<script>
import { reactive, toRefs } from "vue";
import { getListApi } from "../../apis/blog";
// import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import router from "../../router/index";
import { deleteArticleApi } from "../../apis/admin";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const listBlog = (type, page) => {
      state.loading = true;
      getListApi({ page: page, type: type }).then((res) => {
        state.listBlogs = res.data.data.records;
        state.loading = false;
        state.blogTotal = res.data.data.total;
        state.pageSize = res.data.data.size;
      });
    };
    const confirmDeleteEvent = (index, id) => {
      state.loading = true;
      deleteArticleApi({ id: id }).then((res) => {
        ElMessage({
          message: res.data.data,
          type: "success",
        });
        listBlog("", 1);
      });
    };
    const handleSizeChange = (val) => {
    };
    const handleCurrentChange = (val) => {
      listBlog("", val);
    };
    const state = reactive({
      listBlogs: [],
      loading: false,
      blogTotal: 0,
      pageSize: 0,
    });
    const editArticle=(index,id)=>{
        router.push({
          path:"/write",
          query:{"id":id}
        })
    }
    return {
      ...toRefs(state),
      editArticle,
      handleSizeChange,
      handleCurrentChange,
      listBlog,
      confirmDeleteEvent,
    };
  },
  mounted() {
    this.listBlog("", 1);
  },
};
</script>
<style lang="less" scoped>
</style>