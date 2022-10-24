<template>
  <div class="body">
    <!-- 左侧aside -->
    <aside :style="{'background-image': 'url('+host+'static/bck'}" @click="toIndexPage()">
      <div class="background">
        <div class="masker"></div>
      </div>
      <!-- 头像和网名 -->
      <img class="avatar" :src="host+'static/av'" alt="" />
      <div>
        <span class="title">{{state.blogTitle}}</span>
      </div>
      <div class="menu-list">
        <!-- 单击首页 -->
        <div @click.stop="listBlogIndex()" class="menu-item">首页</div>
        <!-- 单击随笔 -->
        <div @click.stop="listNote()" class="menu-item">随笔</div>
        <!-- 单击日记 -->
        <div @click.stop="showDiary()" class="menu-item">日记</div>
        <a href="/manager">
          <div class="menu-item">管理</div>
        </a>
      </div>
      <div class="site">
        <a target="_blank" href="https://github.com/houxinlin"> <img src="../assets/imgs/github.svg" alt="" /> </a>
        <a target="_blank" href="https://juejin.cn/user/588993963758215/posts"> <img src="../assets/imgs/juejin.svg" alt="" /></a>
      </div>
    </aside>
    <!-- 左侧aside end -->
    <section>
      <div class="diary-layout layout-item" :style="{'transform':state.dirayTransformValue,'background-image': 'url('+host+'static/bck'}">
        <div class="mask"></div>
        <diary ref="refDiary"></diary>
      </div>
      <div :style="{'transform':'translateY('+state.blogLayoutY+')'}" class="blog-layout layout-item">
        <!-- 自动补全结果 -->
        <!-- <div v-if="componentsList.length>0" class="search-result">
          <template v-for="item in componentsList" :key="item">
            <div @click="articleDetail(item.hit.sourceAsMap.id)">{{item.hit.sourceAsMap.blogTitle}}</div>
          </template>
        </div> -->
        <nav>
          <!-- 文章分类导航 -->
          <div class="list" :style="{ transform: state.hideNavBar ? 'translateY(-55px)' : 'none', }">
            <li @click="listBlogByType(1, item.classify,index)" v-for="(item ,index) in state.classify" :key="item" :class="{'select':state.currentNavIndex==index}">
              {{ item.classify }}
            </li>
          </div>
          <!-- 搜索input -->
          <!-- <div class="search">
            <input @keyup="search" v-model="searchInput" @input="autoCompletion" placeholder="搜索" type="text">

          </div> -->
          <!-- 文章标题 -->
          <div :style="{ transform: state.showTitle ? 'translateY(0)' : 'translateY(50px)',}" @click="hideArticleList" class="bottom-title" style="display:flex; align-items: center;">
            <h2 class="article-title"> {{ state.currentBlogTitle }} </h2>
            <span v-if="state.hideAarticleList" class="iconfont icon-fanhui"></span>
          </div>
        </nav>
        <!-- 文章分类导航 -->
        <div class="container">
          <!-- 文章预览 -->
          <div :class="{ 'show-blog-viewer': state.hideAarticleList }" class="article-viewer">
            <div id="md"></div>
          </div>
          <!-- 文章预览 end -->
          <el-main class="el-main" v-loading="state.loading">
            <!-- 文章列表 -->
            <div :class="{ 'hide-article-list': state.hideAarticleList }" class="article-list">
              <div v-for="item in state.blogs" :key="item" @click="articleDetail(item.id)" class="article-item">
                <header>
                  <span class="title">{{ item.blogTitle }}</span>
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
              <!-- 分页 -->
              <button :class="{ select: state.currentPage == index }" @click="listByType(index, state.currentClassify,state.currentNavIndex)" class="page-button" v-for="index in state.pageSize" :key="index">
                {{ index }}
              </button>
            </div>
          </el-main>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js";
import "../assets/css/toastui-editor-plugin-code-syntax-highlight.css";
import { reactive, toRefs, onMounted } from "vue";
import "../assets/font.css";
import "../assets/font/font-icon/iconfont.css";
import diary from "./book.vue";
import "@toast-ui/editor/dist/toastui-editor.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import bus from "../event/event";
import {
  getListApi,
  getMarkdownContentApi,
  listClassifyApi,
  listDiaryApi,
  getConfigInfo,
  autoCompletionApi,
  searchApi
} from "../apis/blog";
const host = import.meta.env.VITE_APP_REQUEST_URL;

const state = reactive({
  clientWidth: 0,
  clientHeight: 0,
  hideDiaryLayout: false,
  hideAarticleList: false,
  blogTitle: "",
  blogs: [],
  classify: [],
  currentBlogTitle: "",
  pageSize: 0,
  currentClassify: "",
  showTitle: false,
  currentPage: 1,
  currentNavIndex: 0,
  hideNavBar: false,
  loading: true,
  blogLayoutY: "0px",
  dirayLayoutY: "0px",
  searchInput: "",
  componentsList: [],
  searchResult: false,
  classifyCount: {},
  dirayVisable: false,
  dirayTransformValue: "0px"
});
onMounted(() => {
  init();
  state.clientWidth = `${document.documentElement.clientWidth}`;
  state.clientHeight = `${document.documentElement.clientWidth}`;
  window.onresize = function () {
    state.clientWidth = `${document.documentElement.clientWidth}`;
    state.clientHeight = `${document.documentElement.clientWidth}`;
  };
  state.dirayLayoutY = -state.clientHeight + "px";
  state.dirayTransformValue = `translateX(${state.dirayLayoutY})`;
})
/**
 * 转到首页
 */
const toIndexPage = () => {
  bus.trigger("action", "TO-INDEX");
}
/**
 * 根据类类型列举博客
 */
const listBlogByType = (page, type, navIndex) => {
  state.searchResult = false;
  listByType(page, type, navIndex);
}
/**
 * 列举随笔
 */
const listNote = () => {
  reset();
  state.searchResult = false;
  state.showTitle = true;
  state.hideNavBar = true;
  state.currentBlogTitle = "随笔";
  listByType(1, "随笔", 0);
};

/**
 * 搜索
 */
const search = (e) => {
  if (e.keyCode === 13) {
    state.loading = true;
    state.searchResult = true
    state.componentsList.length = 0;
    state.currentPage = 1;
    state.showTitle = false;
    searchApi(state.searchInput, 1).then((res) => {
      state.blogs = res.data.hits.map((item, index, arr) => { return item.sourceAsMap });
      state.pageSize = res.data.totalHits.value % 10 == 0 ? parseInt(res.data.totalHits.value / 10) : parseInt(res.data.totalHits.value / 10) + 1
      state.loading = false;
      state.hideAarticleList = false;
    })

  }
}
/**
 * 自动补全
 */
const autoCompletion = () => {
  autoCompletionApi(state.searchInput).then((res) => {
    state.componentsList = res.data
  })
}
/**
 * 文章详细
 */
const articleDetail = (id) => {
  state.componentsList.length = 0;
  getBlogContent(id);
};
/**
 * 获取博客内容
 */
const getBlogContent = (id) => {
  state.loading = true;
  getMarkdownContentApi({ id: id }).then((res) => {
    state.loading = false;
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
    state.hideAarticleList = true;
  });
};
/**
 * 根据类型、页获取数据
 */
const listByType = (page, type, navIndex) => {
  state.currentNavIndex = navIndex;
  state.currentClassify = type;
  state.currentPage = page;
  state.loading = true;
  /**
   * 如果是搜索查询
   */
  if (state.searchResult) {
    searchApi(state.searchInput, page).then((res) => {
      state.blogs = res.data.hits.map((item, index, arr) => { return item.sourceAsMap });
      state.pageSize = res.data.pages
      state.loading = false;
    })
    return;
  }
  getListApi({ page: page, type: type }).then((res) => {
    state.searchResult = false;
    state.blogs = res.data.data.records;
    state.pageSize = res.data.data.pages;
    state.hideAarticleList = false;
    state.loading = false;
  });
};


/**
 * 重置页面
 */
const resetPage = () => {
  state.blogLayoutY = "0px";
  state.dirayLayoutY = -state.clientHeight + "px";
  state.dirayVisable = false;

  state.dirayTransformValue = `translateX(${state.dirayLayoutY})`;
};

/**
初始化
 */
const init = () => {
  bus.on("action", (data) => { if (data.page == "diary" && data.opt == "close") resetPage(); });
  bus.on("onConfig", (data) => { state.blogTitle = data["sys_blog_title"]; });
  listClassifyApi()
    .then((res) => {
      state.classify = res.data.data;
      state.currentClassify = state.classify[0].classify;
      return getListApi({ page: 1, type: state.classify[0].classify });
    })
    .then((res) => {
      state.blogs = res.data.data.records;
      state.pageSize = res.data.data.pages;
      state.loading = false;
    });

};
const reset = () => {
  state.showTitle = false;
  state.hideAarticleList = false;
  state.hideNavBar = false;
  resetPage();
};


const hideArticleList = () => {
  if (state.hideAarticleList) {
    reset();
  }
};
/**
 * 进入日记
 */
const showDiary = () => {
  state.blogLayoutY = state.clientHeight + "px";
  state.dirayLayoutY = "0px";
  state.dirayVisable = true;
  state.dirayTransformValue = `none`;
  listDiaryApi().then((res) => { bus.trigger("action", { page: "diary", data: res.data.data }); });
};
/**
 * 进入首页
 */
const listBlogIndex = () => {
  resetPage();
  state.showTitle = false;
  state.hideAarticleList = false;
  state.hideNavBar = false;
  //获取分类下第一个列表文章
  if (state.currentBlogTitle == "随笔") {
    listByType(1, state.classify[0].classify, 0);
  }
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
  width: 57%;
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
  display: flex;

  section {
    position: absolute;
    background: #ffffff;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 300px;
    .blog-layout {
      display: flex;
      flex-direction: column;
      margin: 20px;
      .search-result {
        position: absolute;
        right: 4px;
        background: #ffffff;
        top: 51px;
        z-index: 9999;
        border-left: 1px #00000021 solid;
        border-right: 1px #00000021 solid;
        border-bottom: 1px #00000021 solid;
        border-radius: 0px;
        min-width: 300px;
        padding: 4px;
        div {
          cursor: pointer;
          margin: 6px 0px;
          padding: 5px 3px;
        }
        div:hover {
          background: #fafafa;
        }
      }
    }
    .diary-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s;
      background-attachment: scroll;
      background-size: auto;
      background-position-x: -300px;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
      .mask {
        background: #000000b5;
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
      }
    }
    .layout-item {
      transition: all 0.5s;
      position: absolute;
      bottom: 0px;
      left: 0px;
      top: 0px;
      right: 0px;
    }
    .container {
      position: relative;
      margin-top: 61px;
      flex: 1;
      .el-main {
        // height: 100%;
        padding: 0px;
      }
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
        }

        .article-item {
          cursor: pointer;
          margin-bottom: 20px;
          border-bottom: 1px #f7f7f7 solid;
          .title {
            font-size: 15px;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            color: #323030;
          }
          .outline {
            margin-top: 2px;
            font-size: 13px;
            color: #6c6c6c;
            width: 70%;
            padding: 5px 0px;
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
      position: absolute;
      left: 0px;
      right: 0px;
      align-items: center;
      overflow: hidden;
      display: flex;
      align-items: center;

      .search {
        position: absolute;
        right: 0px;
        input {
          border: 1px #dadada solid;
          border-radius: 100px;
          padding: 10px 5px;
          width: 200px;
          outline: none;
          transition: all 0.5s;
        }
        input:focus {
          width: 300px;
        }
      }
      .bottom-title {
        transition: all 0.5s;
        transform: translateY(50px);
      }
      .article-title {
        margin-right: 10px;
        color: #383838;
        font-size: 14px;
        margin-top: 13px;
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
    padding-top: 60px;
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    width: 300px;
    z-index: 999;
    background-attachment: scroll;
    background-size: auto;
    width: 300px;
    z-index: 999;
    // background-image: url();

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
        background: #000000b5;
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
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 20px;
    }
  }
}
</style>
