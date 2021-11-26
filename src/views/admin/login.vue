<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
      <div class="admin-logo">
        <!-- <img class="logo" src="../../assets/logo.png" alt="logo" /> -->
        <h1 class="name">后台登陆</h1>
      </div>
      <el-form-item prop="password">
        <el-input ref="passwordRef" :class="{
            'no-autofill-pwd': passwordType === 'password',
          }" placeholder="请输入密码" v-model="loginForm.passwd" type="password" autocomplete="off" tabindex="2" />
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button type="primary" style="width: 100%; margin-bottom: 30px" :loading="loading" @click="handleLogin">确定</el-button>
    </el-form>
  </div>
</template>

<script >
import { loginApi } from "../../apis/admin";
import { reactive, toRefs } from "vue";
import router from "../../router/index";
import { ElMessage } from "element-plus";
export default {
  name: "Login",

  setup() {
    const loginState = reactive({
      loading: false,
      loginForm: {
        passwd: "",
      },
      loginRules: {
        passwd: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码！",
          },
        ],
      },
      passwordType: "password",
    });
    const handleLogin = () => {
      loginState.loading = true;
      loginApi(loginState.loginForm).then((res) => {
        let msgType = res.data.data == true ? "success" : "error";
        ElMessage({
          message: msgType == "success" ? "登陆成功" : "密码错误",
          type: msgType,
        });

        sessionStorage.setItem("login", res.data.data);
        loginState.loading = false;
        if (msgType == "success") {
          router.push({
            path: "/manager",
          });
        }
      });
    };
    return {
      ...toRefs(loginState),
      handleLogin,
    };
  },
};
</script>

<style lang="less" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  //   background-image: url('../../assets/images/login.svg');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  .icon {
    width: 20px;
    height: 20px;
  }
  .el-form-item {
    border-radius: 5px;
    .el-input {
      display: inline-block;
      height: 40px;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        height: 40px;
      }
    }
  }
  .no-autofill-pwd {
    // 解决自动填充问题
    .el-input__inner {
      // 模仿密码框原点
      -webkit-text-security: disc !important;
    }
  }
  .login-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    margin: 0 auto;
    padding: 140px 35px 0;
    overflow: hidden;
    box-sizing: border-box;
    .svg-container {
      padding: 0 10px;
    }
    .show-pwd {
      font-size: 16px;
      cursor: pointer;
      margin-left: 7px;
    }
    .admin-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .logo {
        width: 60px;
        height: 60px;
      }
      .name {
        font-weight: normal;
        margin-left: 10px;
      }
    }
  }
}
</style>
