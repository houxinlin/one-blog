<template>
  <div class="container">
    <div class="index-body" :style="{
        transform: 'translateX(' + (hideIndexPage ? clientWidth : 0) + 'px)'}">
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
        <span>欢迎来到这里</span>
      </div>
    </div>
    <div class="blog-body" :style="{
        transform: 'translateX(' + (hideIndexPage ? 0 : -clientWidth) + 'px)',
        display: hideBlogPage ? 'none' : 'block',}">
      <blogPage @goDiary="goDiary" @goBack="goBack" />
    </div>

    <div @click="goDiary" :class="{'hide-diary-page':hideDiaryPage}" class="diary-body">
      <diary ref="diaryRef" @goDiary="goDiary"></diary>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs,ref } from "vue";
import diary from "./book-page.vue";
import blogPage from "./blog-page.vue";
export default {
  setup() {
    let state = reactive({
      hideIndexPage: false,
      clientWidth: 0,
      hideBlogPage: true,
      hideDiaryPage: true,
    });
    　const diaryRef = ref();
    const enterBlogPage = () => {
      state.hideIndexPage = true;
    };
    const goBack = () => {
      state.hideIndexPage = false;
    };
    const goDiary = (res) => {
      diaryRef.value.initPage(res)
      state.hideDiaryPage = !state.hideDiaryPage;
    };
    return { ...toRefs(state), goDiary, enterBlogPage, goBack ,diaryRef};
  },
  components: {
    blogPage,
    diary,
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
  transform: translateY(800px);
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
    .name span:nth-of-type(3) {
      position: relative;
      left: 100px;
    }
    .name {
      width: 100%;
      height: 100%;
      font-size: 41px;
      text-align: center;
      position: relative;
      left: -100px;
      top: 70px;
      color: #4b4b4b;
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
