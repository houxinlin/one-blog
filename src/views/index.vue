<template>
  <div class="container">
    <div
      class="index-body"
      :style="{
        transform: 'translateX(' + (hideIndexPage ? clientWidth : 0) + 'px)',
      }"
    >
      <nav>
        <li @click="enterBlogPage">Blog</li>
        <li>联系我</li>
      </nav>
      <img class="blob1" src="../assets/imgs/blob1.svg" alt="" />
      <img class="blob2" src="../assets/imgs/blob2.svg" alt="" />
      <div class="name">
        <span>Heyo, I'm </span>
        <span>👋</span>
        <br />
        <span @click="test"></span>
      </div>
    </div>
    <div
      class="blog-body"
      :style="{
        transform: 'translateX(' + (hideIndexPage ? 0 : -clientWidth) + 'px)',
        display: hideBlogPage ? 'none' : 'block',
      }"
    >
      <blogPage @goBack="goBack" />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

import blogPage from "./blog-page.vue";
import BlogPage from "./blog-page.vue";
export default {
  setup() {
    let state = reactive({
      hideIndexPage: false,
      clientWidth: 0,
      hideBlogPage: true,
    });
    const enterBlogPage = () => {
      state.hideIndexPage = true;
    };
    const goBack = () => {
      state.hideIndexPage = false;
    };
    return { ...toRefs(state), enterBlogPage, goBack };
  },
  components: {
    blogPage,
  },
  created() {},
  mounted() {
    let that = this;
    this.clientWidth = `${document.documentElement.clientWidth}`;
    window.onresize = function () {
      var widheight = `${document.documentElement.clientHeight}`;
      that.clientWidth = `${document.documentElement.clientWidth}`;
    };
    setTimeout(() => {
      that.hideBlogPage = false;
    }, 500);
    // console.log(document.querySelector("#editor"));

    // const editor = new Editor({
    //   el: document.querySelector("#editor"),
    //   height: "500px",
    //   initialEditType: "markdown",
    //   previewStyle: "vertical",
    // });
  },
};
</script>

<style lang="less" scoped>
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
.container {
  overflow: hidden;
  position: fixed;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
}
.add {
  transition: all 0.5s;
}
.container {
  .blog-body {
    background: #923939;
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
      font-size: 16px;
      color: #4f4f4f;
      text-shadow: 0px 2px 5px #0003;
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
  .name {
    position: fixed;
    top: 29%;
    left: 26%;
    font-size: 41px;
    // animation-name: blobAnimation;
    // animation-duration: 0.5s;
    color: #4b4b4b;
  }
  .name span:nth-of-type(2) {
    transition: all 0.5s;
    animation-name: wave-animation;
    animation-duration: 0.5s;
    display: inline-block;
  }
}
</style>