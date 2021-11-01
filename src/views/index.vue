<template>
  <div class="container">
    <div class="index-body" :style="{
        transform: 'translateX(' + (hideIndexPage ? clientWidth : 0) + 'px)'}">
      <nav>
        <li @click="intoBlogPage()">Blog</li>
      </nav>
      <img class="blob1" src="../assets/imgs/blob1.svg" alt="" />
      <img class="blob2" src="../assets/imgs/blob2.svg" alt="" />
      <div class="name">
        <div> <span>Hello, I'm HouXinLin </span>
          <span>👋</span>
        </div>
        <span>欢迎来到这里</span>
      </div>
    </div>
    <div class="blog-body" :style="{
        transform: 'translateX(' + (hideIndexPage ? 0 : -clientWidth) + 'px)',
        display: hideBlogPage ? 'none' : 'block',}">
      <blogPage />
    </div>


  </div>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import blogPage from "./blog.vue";
import bus from "../event/event";

export default {
  setup() {
    let state = reactive({
      hideIndexPage: false,
      clientWidth: 0,
      clientHeight: 0,
      hideBlogPage: true,
    });
    const refDiary = ref();

    const goBack = () => {
      state.hideIndexPage = false;
    };
    const intoDiaryPage = () => {
      // state.hideDiaryPage = !state.hideDiaryPage;
    };
    const clseDiary = () => {
      // state.hideDiaryPage = true;
    };
    const intoBlogPage = () => {
      state.hideIndexPage = true;
    };
    return {
      ...toRefs(state),
      clseDiary,
      intoDiaryPage,
      intoBlogPage,
      goBack,
    };
  },
  components: {
    blogPage,
  },
  mounted() {
    let that = this;
    this.clientWidth = `${document.documentElement.clientWidth}`;
    that.clientHeight = `${document.documentElement.clientWidth}`;
    window.onresize = function () {
      that.clientWidth = `${document.documentElement.clientWidth}`;
      that.clientHeight = `${document.documentElement.clientWidth}`;
    };


    setTimeout(() => {
      that.hideBlogPage = false;
    }, 500);
  },
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
  // background: #0003;
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
