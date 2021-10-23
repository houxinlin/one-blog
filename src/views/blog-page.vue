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
        <div class="menu-item">首页</div>
        <div class="menu-item">归档</div>
        <div class="menu-item">随手记</div>
        <div @click="goDiary" class="menu-item">日记</div>
        <div class="menu-item">
          <a @click.stop href="/manager">管理</a>
        </div>
      </div>
      <div class="site">
        <img src="../assets/imgs/github.svg" alt="" />
        <img src="../assets/imgs/juejin.svg" alt="" />
        <img src="../assets/imgs/weichat.svg" alt="" />
      </div>
    </aside>
    <section>
      <nav>
        <div class="list" :style="{
            transform: hideAarticleList ? 'translateY(-50px)' : 'none',
          }">
          <li @click="getListForType(1, item.classify)" v-for="item in classify" :key="item">
            {{ item.classify }}
          </li>
        </div>
        <h2 @click="onArticleItemClick" :style="{
            transform: hideAarticleList ? 'translateY(0)' : 'translateY(50px)',
          }" class="article-title">
          {{ currentBlogTitle }}
        </h2>
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
          <button :class="{ select: currentPage == index }" @click="getListForType(index, currentClassify)" class="page-button" v-for="index in pageSize" :key="index">
            {{ index }}
          </button>
        </div>
      </div>
    </section>
    <div @click="goBack" class="return"></div>
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
import {
  getListApi,
  getMarkdownContentApi,
  listClassifyApi,
  listDiaryApi
} from "../apis/blog";
export default {
  mounted() {
    this.init();
    // this.getListForType(1, "Java");
  },
  setup(props, { emit }) {
    const state = reactive({
      hideAarticleList: false,
      blogs: [1, 2, 4],
      classify: [],
      currentBlogTitle: "",
      pageSize: 0,
      currentClassify: "",
      currentPage: 1,
    });
    const goBack = () => {
      emit("goBack");
    };
    const onArticleItemClick = (id) => {
      getBlogContent(id);
      state.hideAarticleList = !state.hideAarticleList;
    };
    const getBlogContent = (id) => {
      getMarkdownContentApi({ id: id }).then((res) => {
        const value = res.data.data.markdownContent;
        state.currentBlogTitle = res.data.data.blogTitle;
        // state.hideAarticleList = !state.hideAarticleList;

        const editor = new Viewer({
          el: document.querySelector("#md"),
          previewStyle: "vertical",
          height: "500px",
          plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
          initialValue: value,
        });
      });
    };
    const getListForType = (page, type) => {
      state.currentClassify = type;
      state.currentPage = page;
      getListApi({ page: page, type: type }).then((res) => {
        state.blogs = res.data.data.records;
        state.pageSize = res.data.data.pages;
      });
    };
    const setBottomPage = () => {};
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
    const goDiary = () => {
      listDiaryApi().then((res) => {
        emit("goDiary", res.data.data);
      });
    };
    return {
      ...toRefs(state),
      goBack,
      setBottomPage,
      goDiary,
      init,
      onArticleItemClick,
      getListForType,
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
.return {
  position: fixed;
  top: 0px;
  right: -800px;
  background: #00000014;
  bottom: 0px;
  width: 900px;
  border-radius: 1000px;
  opacity: 0;
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
      .article-title {
        transition: all 0.5s;
        transform: translateY(50px);
        color: #383838;
        font-size: 15px;
      }
      .list {
        position: absolute;
        transition: all 0.5s;
        display: flex;
        align-items: center;
        li:nth-of-type(1) {
          margin-left: 0px;
        }
        li:nth-last-of-type(1) {
          margin-right: 0px;
        }
        li {
          margin: 0 20px;
          cursor: pointer;
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
