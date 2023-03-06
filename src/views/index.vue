<template>
  <div class="container line-numbers">
    <div class="index-body" :style="{ transform: 'translateX(' + (state.hideIndexPage ? state.clientWidth : 0) + 'px)' }">
      <nav>
        <li @click="entryBlogPage()">Blog</li>
        <!-- <li @click="entrySoftware()">软件</li> -->
      </nav>
      <img class="blob1" src="../assets/imgs/blob1.svg" alt="" />
      <img class="blob2" src="../assets/imgs/blob2.svg" alt="" />
      <div v-html="state.welcomeText" class="name">
      </div>
    </div>
    <div class="blog-body" :style="{
      transform: 'translateX(' + (state.hideIndexPage ? 0 : -state.clientWidth) + 'px)',
      display: state.hideBlogPage ? 'none' : 'block',
    }">
      <blogPage />
    </div>

  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import blogPage from "./blog.vue";
import bus from "../event/event";
import { getConfigInfo } from "../apis/blog";

import router from "../router/index";
let state = reactive({
  hideIndexPage: false,
  clientWidth: 0,
  clientHeight: 0,
  hideBlogPage: true,
  welcomeText: ""
});

onMounted(() => {
  let config = localStorage.getItem("config") || null;
  let back = new Image();
  // back.src = `${import.meta.env.VITE_APP_REQUEST_URL}static/bck`;
  if (config != null) {
    state.welcomeText = JSON.parse(config)["blog_welcome_text"];
    bus.trigger("onConfig", JSON.parse(config));
  }
  getConfigInfo().then((res) => {
    localStorage.setItem("config", JSON.stringify(res.data))
    state.welcomeText = res.data["blog_welcome_text"]
    bus.trigger("onConfig", res.data);
  })
  state.clientWidth = `${document.documentElement.clientWidth}`;
  state.clientHeight = `${document.documentElement.clientWidth}`;
  window.onresize = function () {
    state.clientWidth = `${document.documentElement.clientWidth}`;
    state.clientHeight = `${document.documentElement.clientWidth}`;
  };
  setTimeout(() => {
    state.hideBlogPage = false;
  }, 500);

  bus.on("action", (data) => {
    if (data == "TO-INDEX") {
      entryIndexPage();
    }
  })
})
/**
 * 进入软件页面
 */
// const entrySoftware = () => {
//   console.log(router);
//   router.push("/software")
//   // window.
// }

/**
 * 进入首页界面
 */
const entryIndexPage = () => {
  state.hideIndexPage = false;
};
/**
 * 进入博客界面
 */
const entryBlogPage = () => {
  state.hideIndexPage = true;
};
</script>

<style lang="less" scoped>
.diary-body {
  position: fixed;
  transform-origin: bottom left;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;
  background: #ffffff00;
}

.hide-diary-page {
  transform: translateY(-800px);
}

@keyframes wave-animation {
  0% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(14deg);
  }

  40% {
    transform: rotate(-8deg);
  }

  70% {
    transform: rotate(14deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes blobAnimation {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}

.fixed-full {
  position: fixed;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
}

.container {
  overflow: hidden;
  .fixed-full;

  .blog-body {
    transform: translateX(-9000px);
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    transition: all 0.5s;
    overflow: hidden;
    //  display: none;
  }

  .index-body {
    height: 100%;
    transition: all 0.5s;

    nav {
      display: flex;
      justify-content: center;
      height: 132px;
      align-items: center;

      li {
        cursor: pointer;
        margin: 0px 50px;
        font-size: 22px;
        color: #4f4f4f;
        text-shadow: 0px 2px 5px #0003;
        position: relative;
        z-index: 99999;
      }
    }

    .blob1 {
      transition: all 0.5s;
      position: fixed;
      top: 0px;
      right: 0px;
      width: 441px;
      animation-name: blobAnimation;
      animation-duration: 0.5s;
      transform-origin: right top;
    }

    .blob2 {
      position: fixed;
      bottom: 0px;
      left: 0px;
      height: 432px;
      animation-name: blobAnimation;
      animation-duration: 0.5s;
      transform-origin: left bottom;
    }

    .name span:nth-of-type(3) {
      position: relative;
      left: 100px;
    }

    .name {
      position: fixed;
      font-size: 30px;
      text-align: center;
      /* position: relative; */
      /* left: -100px; */
      top: 0px;
      color: #4b4b4b;
      bottom: 0px;
      right: 0px;
      left: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .name span:nth-of-type(2) {
      transition: all 0.5s;
      animation-name: wave-animation;
      animation-duration: 0.5s;
      display: inline-block;
    }
  }
}

.add {
  transition: all 0.5s;
}
</style>
