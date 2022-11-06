<template>
  <div>
    <div>
      <span class="f-lable">分类</span>
      <el-select @change="refreshList" v-model="state.filterType" placeholder="选择分类">
        <el-option label="无" value=""></el-option>
        <el-option v-for="item in state.typeList" :key="item.id" :label="item.classify" :value="item.classify"></el-option>
        <el-option label="日记" value="日记"></el-option>
        <el-option label="随笔" value="随笔"></el-option>
      </el-select>

      <span class="f-lable">浏览量</span>
      <el-select @change="refreshList" v-model="state.orderBy" placeholder="选择">
        <el-option label="无" value=""></el-option>
        <el-option label="降序" value="des"></el-option>
        <el-option label="升序" value="asc"></el-option>
      </el-select>
    </div>

    <el-table v-loading="loading" :data="state.listBlogs" style="width: 100%">
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

    <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :page-size="state.pageSize" :total="state.blogTotal">
    </el-pagination>
  </div>

</template>

<script setup>
import { reactive, toRefs, onMounted } from "vue";
import { getListApi, listClassifyApi } from "../../apis/blog";
import router from "../../router/index";
import { deleteArticleApi } from "../../apis/admin";
import { ElMessage } from "element-plus";
const state = reactive({
  listBlogs: [],
  loading: false,
  blogTotal: 0,
  pageSize: 0,
  filterType: "",
  orderBy: ""
});
onMounted(() => {
  listClassifyApi().then((res) => {
    state.typeList = res.data.data;
  });
  listBlog(1);
})
const refreshList = () => {
  listBlog(1)
}
const listBlog = (page) => {
  state.loading = true;

  getListApi({ page: page, type: state.filterType, orderBy: state.orderBy }).then((res) => {
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
    listBlog(1);
  });
};

const handleCurrentChange = (val) => {
  listBlog(val);
};

const editArticle = (index, id) => {
  router.push({
    path: "/write",
    query: { "id": id }
  })
}

</script>
<style lang="less" scoped>
.f-lable {
  font-size: 10px;
  margin-right: 10px;
  margin-left: 10px;
  color: #767171;
}
</style>