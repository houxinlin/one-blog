<template>
  <div class="body">
    <aside>
      <div class="background">
        <img src="../assets/background/bck.jpg" alt="" />
        <div class="masker"></div>
      </div>
      <img class="avatar" src="../assets/avd.png" alt="" />
      <div>
        <span class="title">HouXinLin Blog</span>
      </div>
      <div class="menu-list">
        <div @click="indexPage()" class="menu-item">首页</div>
        <!-- <div class="menu-item">归档</div> -->
        <div @click="listNote(1)" class="menu-item">随笔</div>
        <div @click="intoDiaryPage()" class="menu-item">日记</div>
        <a href="/manager">
          <div class="menu-item">管理</div>
        </a>
        <div class="menu-item">
        </div>
      </div>
      <div class="site">
        <a target="_blank" href="https://github.com/houxinlin">
          <img src="../assets/imgs/github.svg" alt="" />
        </a>
        <a target="_blank" href="https://juejin.cn/user/588993963758215/posts">
          <img src="../assets/imgs/juejin.svg" alt="" />
        </a>
      </div>
    </aside>
    <section>
      <nav>
        <div class="list" :style="{
            transform: hideNavBar ? 'translateY(-50px)' : 'none',
          }">
          <li @click="listByType(1, item.classify,index)" v-for="(item ,index) in classify" :key="item" :class="{'select':currentNavIndex==index}">
            {{ item.classify }}
          </li>
        </div>
        <div :style="{
            transform: showTitle ? 'translateY(0)' : 'translateY(50px)',
          }" @click="onHideArticleList" class="bottom-title" style="display:flex">
          <h2 class="article-title">
            {{ currentBlogTitle }}
          </h2>
          <div v-if="hideAarticleList" class="iconfont icon-fanhui"></div>

        </div>
      </nav>

      <div class="container">
        <div :class="{ 'show-blog-viewer': hideAarticleList }" class="article-viewer">
          <div id="md"></div>
        </div>
        <div :class="{ 'hide-article-list': hideAarticleList }" class="article-list">
          <div v-for="item in blogs" :key="item" @click="onArticleItemClick(item.id)" class="article-item">
            <header>
              <h3 class="title">{{ item.blogTitle }}</h3>
            </header>
            <article class="outline">
              {{ item.blogDescribe }}
            </article>
            <footer>
              <span class="iconfont icon-liulan"></span>
              <span class="text">{{ item.watchCount }}</span>
              <span class="iconfont icon-riqi"></span>
              <span class="text">{{ item.createDate }}</span>
            </footer>
          </div>
          <button :class="{ select: currentPage == index }" @click="listByType(index, currentClassify,currentNavIndex)" class="page-button" v-for="index in pageSize" :key="index">
            {{ index }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import "../assets/css/toastui-editor-plugin-code-syntax-highlight.css";
import { reactive, toRefs } from "vue";
import "../assets/font.css";
import "../assets/font/font-icon/iconfont.css";

import "@toast-ui/editor/dist/toastui-editor.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import bus from "../event/event";
import {
  getListApi,
  getMarkdownContentApi,
  listClassifyApi,
  listDiaryApi,
} from "../apis/blog";
export default {
  mounted() {
    this.init();
  },
  setup(props, { emit }) {
    const state = reactive({
      hideAarticleList: false,
      blogs: [],
      classify: [],
      currentBlogTitle: "",
      pageSize: 0,
      currentClassify: "",
      showTitle: false,
      currentPage: 1,
      currentNavIndex: 0,
      hideNavBar: false,
    });
    const listNote = (page) => {
      reset();
      state.showTitle = true;
      state.hideNavBar = true;
      state.currentBlogTitle = "随笔";
      listByType(page, "随笔", 0);
    };
    const goBack = () => {
      emit("goBack");
    };
    const onArticleItemClick = (id) => {
      getBlogContent(id);
    };
    /**
     * 获取博客内容
     */
    const getBlogContent = (id) => {
      getMarkdownContentApi({ id: id }).then((res) => {
        const value = res.data.data.markdownContent;
        state.currentBlogTitle = res.data.data.blogTitle;
        // state.hideAarticleList = !state.hideAarticleList;
        /**
         * 博客预览
         */
        new Viewer({
          el: document.querySelector("#md"),
          previewStyle: "vertical",
          height: "500px",
          plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
          initialValue: value,
        });
        state.showTitle = true;
        state.hideNavBar = true;
        state.hideAarticleList = !state.hideAarticleList;
      });
    };
    /**
     * 根据类型、页获取数据
     */
    const listByType = (page, type, navIndex) => {
      state.currentNavIndex = navIndex;
      state.currentClassify = type;
      state.currentPage = page;
      getListApi({ page: page, type: type }).then((res) => {
        state.blogs = res.data.data.records;
        state.pageSize = res.data.data.pages;
      });
    };
    const setBottomPage = () => {};
    /**
     * 初始化
     */
    const init = () => {
      listClassifyApi()
        .then((res) => {
          state.classify = res.data.data;
          state.currentClassify = state.classify[0].classify;
          return getListApi({ page: 1, type: state.classify[0].classify });
        })
        .then((res) => {
          state.blogs = res.data.data.records;
          state.pageSize = res.data.data.pages;
        });
    };
    const reset = () => {
      state.showTitle = false;
      state.hideAarticleList = false;
      state.hideNavBar = false;
    };
    const onShowArticleList = () => {
      reset();
    };
    const onHideArticleList = () => {
      if (state.hideAarticleList) {
        reset();
      }
    };
    const intoDiaryPage = () => {
      listDiaryApi().then((res) => {
        bus.trigger("action", { page: "diary", data: res.data.data });
      });
    };
    const indexPage = () => {
      state.showTitle = false;
      state.hideAarticleList = false;
      state.hideNavBar = false;
      listByType(1, state.classify[0].classify, 0);
    };
    return {
      ...toRefs(state),
      goBack,
      onShowArticleList,
      listNote,
      indexPage,
      setBottomPage,
      intoDiaryPage,
      onHideArticleList,
      init,
      onArticleItemClick,
      listByType,
    };
  },
};
</script>

<style lang="less" scoped>
.hide-article-list {
  transform: scale(0) !important;
}

.show-blog-viewer {
  transform: scale(1) !important;
}
#md {
  width: 70%;
}

.scale-view {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: all 0.3s;
  overflow-y: auto;
}

.body {
  overflow: hidden;
  height: 100%;
  width: 100%;
  section {
    padding: 20px 0px 0px 20px;
    background: #ffffff;
    padding-left: 350px;
    height: 100%;
    .container {
      height: calc(100% - 101px);
      position: relative;
      margin-top: 61px;
      .article-viewer {
        transform: scale(0);
        background: #ffffff;
        .scale-view;
      }
      .article-list {
        .scale-view;
        button.select {
          background: #424242;
          color: #ffffff;
        }

        .page-button {
          cursor: pointer;
          background: #fff;
          border: none;
          padding: 3px 14px;
          color: #000000;
          border-radius: 4px;
          margin: 0 7px;
          border: 1px #424242 solid;
        }

        .article-item {
          cursor: pointer;
          margin-bottom: 20px;
          border-bottom: 1px #f7f7f7 solid;
          .title {
            color: #383838;
            font-size: 15px;
          }
          .outline {
            margin-top: 6px;
            font-size: 13px;
            color: #464646;
            width: 70%;
            padding: 2px 0px;
          }
          footer {
            text-align: justify;
            align-items: center;
            height: 33px;
            display: flex;
            span.text {
              font-size: 10px;
              margin-left: 3px;
              margin-right: 15px;
            }
          }
        }
      }
    }
    nav {
      padding-bottom: 10px;
      border-bottom: 1px #dadada solid;
      height: 40px;
      position: fixed;
      left: 350px;
      right: 50px;
      display: flex;
      align-items: center;
      overflow: hidden;
      .bottom-title {
        transition: all 0.5s;
        transform: translateY(50px);
      }
      .article-title {
        margin-right: 10px;
        color: #383838;
        font-size: 15px;
      }
      .list {
        position: absolute;
        transition: all 0.5s;
        display: flex;
        align-items: center;
        height: 100%;
        li:nth-of-type(1) {
          margin-left: 0px;
        }
        li:nth-last-of-type(1) {
          margin-right: 0px;
        }
        li {
          margin: 0 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        li.select {
          border-bottom: 2px #000000 solid;
          height: 100%;
        }
      }
    }
  }
  aside {
    text-align: center;
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    width: 300px;
    background: #ffffff;
    background-image: url("/background/bck1.jpg");
    .menu-list {
      color: #ffffff;
      .menu-item {
        margin: 20px 0px;
        cursor: pointer;
      }
    }
    .background {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: -1;
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        position: absolute;
      }
      div {
        height: 100%;
        width: 100%;
        background: #000000de;
        position: absolute;
        left: 0px;
        top: 0px;
      }
    }
    .bck::before {
      content: "2";
      position: relative;
      left: 0px;
      width: 100%;
      height: 100%;
      background: #ff0000;
    }
    .site {
      margin-top: 20px;
      position: absolute;
      bottom: 10px;
      width: 100%;
      img {
        width: 23px;
        margin: 0px 20px;
        /* border: 2px #dadadd solid; */
        // border-radius: 50%;
        // padding: 5px;
        // background: #ffffff;
      }
    }
    .title {
      display: inline-block;
      margin-top: 20px;
      font-family: "Windsong";
      font-size: 2.8rem;
      color: #ffffff;
    }
    .avatar {
      margin-top: 3rem;
      width: 8rem;
      height: 8rem;
      border-radius: 50%;
      border: 4px solid #fff;
      box-shadow: 0 1px 4px #0000004d;
      object-fit: cover;
    }
  }
}
</style>
