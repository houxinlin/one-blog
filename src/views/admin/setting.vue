<template>
  <div class="sys-config">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>登录密码</span>
          <el-button class="button" type="text"></el-button>
        </div>
      </template>
      <div style="display:flex">
        <el-input type="password" v-model="password" style="width:200px" placeholder="输入密码"></el-input>
      </div>
      <el-button @click="onRestPassword" type="primary">保存</el-button>
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
      <div>
        <el-form ref="form" :model="configForm" label-width="180px">
          <el-form-item label="网名">
            <el-input v-model="configForm.sysBlogTitle" style="width:200px"></el-input>
          </el-form-item>

          <el-form-item label="头像">
            <img class="avatar" @click="selectPicture(configForm.userAvatar)" :src="configForm.userAvatar.src" />
          </el-form-item>
          <el-form-item label="主页背景">
            <img class="index-background-img" @click="selectPicture(configForm.background)" :src="configForm.background.src" />
          </el-form-item>
          <el-form-item label="主页欢迎文本(支持HTML)">
            <textarea v-model="configForm.blogWelcomeText" style="width: 496px;height: 131px;"></textarea>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="onConfigInfo()">
          保存
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { getSysConfigApi, setSysConfig, addClassifyApi, removeClassifyApi, restPassword, configInfo, } from "../../apis/admin";
import { getConfigInfo } from "../../apis/blog"
import { listClassifyApi } from "../../apis/blog";
import { ElMessage, ElMessageBox } from "element-plus";
const host = import.meta.env.VITE_APP_REQUEST_URL;
export default {
  setup() {
    const state = reactive({
      sysConfigs: [],
      sysConfigsMap: {},
      configSelectKey: "",
      currentValue: "",
      password: "",
      editableTabsValue: "2",
      editableTabs: [],
      tabIndex: 2,
      imageUrl: "",
      configForm: {
        "sysBlogTitle": "",
        "userAvatar": {
          "src": host + "static/av",
          "blob": null
        },
        "background": {
          "src": host + "static/bck",
          "blob": null
        },
        "imgFile": null,
        "blogWelcomeText": ""
      }
    });
    /**
     * 发送配置信息
     */
    const onConfigInfo = () => {
      const form = new FormData();
      form.append('sysBlogTitle', state.configForm.sysBlogTitle);
      form.append("blogWelcomeText", state.configForm.blogWelcomeText)
      if (state.configForm.userAvatar.blob != null) {
        form.append('userAvatar', state.configForm.userAvatar.blob, "userAvatar");
      }
      if (state.configForm.background.blob != null) {
        form.append('background', state.configForm.background.blob, "background");
      }
      configInfo(form).then((res) => {
        ElMessage({
          message: res.data,
          type: "success",
        });
      })

    }
    /**
     * 选择文件
     */

    const selectPicture = (toTarget) => {
      let setload = document.createElement("input");
      setload.type = "file";
      setload.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        toTarget.blob = file;
        reader.addEventListener('load', () => {
          toTarget.src = reader.result;
        });
        reader.readAsDataURL(file);
      }

      setload.click();

    }
    const onRestPassword = () => {
      restPassword({ "passwd": state.password }).then((res) => {
        ElMessage({
          message: res.data,
          type: "success",
        });
      })
    }
    const init = () => {
      getConfigInfo().then((res) => {
        state.configForm.sysBlogTitle = res.data["sys_blog_title"];
        state.configForm.blogWelcomeText = res.data["blog_welcome_text"];
      })

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
        state.editableTabs = res.data;
      });
    };
    const onConfigKeyChange = (val) => {
      state.currentValue = state.sysConfigsMap.get(val);
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
        .catch(() => { });
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
      init,
      ...toRefs(state),
      onConfigInfo,
      onConfigKeyChange,
      onSaveConfig,
      removeTab,
      addTab,
      onRestPassword,
      selectPicture
    };
  },
  mounted() {
    this.init();

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
.index-background-img {
  width: 100px;
  height: 200px;
  object-fit: cover;
}
</style>