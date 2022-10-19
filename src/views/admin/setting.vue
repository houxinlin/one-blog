<template>
  <div class="sys-config">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>系统值</span>
          <el-button class="button" type="text"></el-button>
        </div>
      </template>
      <div style="display:flex">
        <el-select @change="onConfigKeyChange" v-model="configSelectKey" placeholder="Select">
          <el-option v-for="(item, index) in sysConfigs" :key="index" :label="item.sysKey" :value="item.sysKey">
          </el-option>
        </el-select>
        <el-input v-model="currentValue" style="width:200px"></el-input>
      </div>
      <el-button @click="onSaveConfig" type="primary">保存</el-button>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文章分类管理</span>
          <el-button class="button" type="text"></el-button>
        </div>
      </template>
      <div style="">
        <div style="margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addTab()">
            添加分类
          </el-button>
        </div>
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <el-tab-pane v-for="item in editableTabs" :key="item.classify" :label="item.classify" :name="item.classify">
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

      <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>博主信息</span>
          <el-button class="button" type="text"></el-button>
        </div>
      </template>
      <div style="">
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import {
  getSysConfigApi,
  setSysConfig,
  addClassifyApi,
  removeClassifyApi,
} from "../../apis/admin";
import { listClassifyApi } from "../../apis/blog";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  setup() {
    const state = reactive({
      sysConfigs: [],
      sysConfigsMap: {},
      configSelectKey: "",
      currentValue: "",

      editableTabsValue: "2",
      editableTabs: [],
      tabIndex: 2,
    });

    const list = () => {
      getSysConfigApi().then((res) => {
        let value = res.data.data;
        let map = new Map();
        for (const item of value) {
          map.set(item.sysKey, item.sysValue);
        }
        state.sysConfigs = value;
        state.sysConfigsMap = map;
      });
      listClassifyApi().then((res) => {
        state.editableTabs = res.data.data["list"];
      });
    };
    const onConfigKeyChange = (val) => {
      state.currentValue = state.sysConfigsMap.get(val);
      console.log(state.configSelectKey, val);
    };
    const onSaveConfig = () => {
      state.sysConfigsMap.set(state.configSelectKey, state.currentValue);
      const obj = Object.fromEntries(state.sysConfigsMap);
      setSysConfig(obj).then((res) => {
        ElMessage({
          message: "保存成功",
          type: "success",
        });
      });
    };

    const addTab = () => {
      openInputDialog();

    };

    const openInputDialog = () => {
      ElMessageBox.prompt("输入分类名称", "提示", {
        confirmButtonText: "添加",
        cancelButtonText: "取消",
        inputErrorMessage: "输入错误",
      })
        .then(({ value }) => {
          addClassifyApi({ classify: value }).then(() => {
            ElMessage({
              type: "success",
              message: "添加成功",
            });
            state.editableTabs.push({ classify: value });
          });
        })
        .catch(() => {});
    };

    const removeTab = (targetName) => {
      let index = state.editableTabs.findIndex(
        (item) => item.classify == targetName
      );
      removeClassifyApi({ classify: state.editableTabs[index].classify }).then(
        (res) => {
          ElMessage({
            message: res.data.data ? "删除成功" : "删除失败",
          });
          if (res.data.data) {
            state.editableTabs.splice(index, 1);
          }
        }
      );
    };
    return {
      list,
      ...toRefs(state),
      onConfigKeyChange,
      onSaveConfig,
      removeTab,
      addTab,
    };
  },
  mounted() {
    this.list();
  },
};
</script>

<style lang="less" scoped>
.sys-config .el-button {
  margin-top: 10px;
}
.el-card {
  margin-bottom: 10px;
}
</style>