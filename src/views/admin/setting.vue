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
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { getSysConfigApi,setSysConfig } from "../../apis/admin";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const state = reactive({
      sysConfigs: [],
      sysConfigsMap: {},
      configSelectKey: "",
      currentValue: "",
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
    };
    const onConfigKeyChange = (val) => {
      state.currentValue = state.sysConfigsMap.get(val);
      console.log(state.configSelectKey, val);
    };
    const onSaveConfig = () => {
        state.sysConfigsMap.set(state.configSelectKey,state.currentValue)
        const obj = Object.fromEntries(state.sysConfigsMap);
        setSysConfig(obj).then((res)=>{
            ElMessage({
                message:"保存成功",
                type:"success"
            })
        })
    };

    return { list, ...toRefs(state), onConfigKeyChange, onSaveConfig };
  },
  mounted() {
    this.list();
  },
};
</script>

<style lang="less" scoped>
.sys-config .el-button{
        margin-top: 10px;
}
</style>