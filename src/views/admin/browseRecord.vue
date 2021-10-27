<template>
  <el-table v-loading="loading" :data="ipList" height="550" style="width: 100%">
    <el-table-column prop="ipAddress" label="ip" width="180" />
    <el-table-column prop="ipCity" label="城市" width="180" />
    <el-table-column prop="ipProvince" label="省份" />

  </el-table>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background layout="prev, pager, next" :page-size="pageSize" :total="dataTotal">
  </el-pagination>
</template>

<script>
import { reactive, toRefs } from "vue";

import { getBrowseRecordApi } from "../../apis/admin";

export default {
  setup() {
    const listIps = (page) => {
      state.loading = true;
      getBrowseRecordApi({ page: page }).then((res) => {
        state.ipList = res.data.data.records;
        state.loading = false;
        state.dataTotal = res.data.data.total;
        state.pageSize = res.data.data.size;
      });
    };
    const handleCurrentChange = (val) => {
      listIps( val);
    };
    const state = reactive({
      ipList: [],
      loading: false,
      dataTotal: 0,
      pageSize: 0,
    });
    return {
      ...toRefs(state),
      listIps,
      handleCurrentChange,
    };
  },
  mounted() {
    this.listIps(1);
  },
};
</script>
<style lang="less" scoped>
</style>