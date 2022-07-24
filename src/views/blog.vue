<template>
  <div class="body">
    <!-- 左侧aside -->
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
    <!-- 左侧aside end -->
    <section>
      <div class="diary-layout layout-item" :style="{'transform':'translateY('+(dirayLayoutY)+')'}">
        <diary ref="refDiary"></diary>
      </div>
      <!-- //transform: translateY(10px); -->
      <div :style="{'transform':'translateY('+blogLayoutY+')'}" class="blog-layout layout-item">
        <!-- 自动补全结果 -->
        <div v-if="componentsList.length>0" class="search-result">
          <template v-for="item in componentsList" :key="item">
            <div @click="onArticleItemClick(item.hit.sourceAsMap.id)">{{item.hit.sourceAsMap.blogTitle}}</div>
          </template>
        </div>
        <nav>
          <!-- 文章分类导航 -->
          <div class="list" :style="{ transform: hideNavBar ? 'translateY(-55px)' : 'none', }">
            <li @click="listByType(1, item.classify,index)" v-for="(item ,index) in classify" :key="item" :class="{'select':currentNavIndex==index}">
              {{ item.classify }}
            </li>
          </div>
          <!-- 搜索input -->
          <div class="search">
            <input @keyup="search" v-model="searchInput" @input="autoCompletion" placeholder="搜索" type="text">

          </div>
          <!-- 文章标题 -->
          <div :style="{ transform: showTitle ? 'translateY(0)' : 'translateY(50px)',}" @click="onHideArticleList" class="bottom-title" style="display:flex; align-items: center;">
            <h2 class="article-title"> {{ currentBlogTitle }} </h2>
            <span v-if="hideAarticleList" class="iconfont icon-fanhui"></span>
          </div>
        </nav>
        <!-- 文章分类导航 -->

        <div class="container">
          <!-- 文章预览 -->
          <div :class="{ 'show-blog-viewer': hideAarticleList }" class="article-viewer">
            <div id="md"></div>
          </div>
          <!-- 文章预览 end -->
          <el-main class="el-main" v-loading="loading">
            <!-- 文章列表 -->
            <div :class="{ 'hide-article-list': hideAarticleList }" class="article-list">
              <div v-for="item in blogs" :key="item" @click="onArticleItemClick(item.id)" class="article-item">
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
              <button :class="{ select: currentPage == index }" @click="listByType(index, currentClassify,currentNavIndex)" class="page-button" v-for="index in pageSize" :key="index">
                {{ index }}
              </button>
            </div>
          </el-main>

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
import diary from "./book.vue";
import "@toast-ui/editor/dist/toastui-editor.css";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import bus from "../event/event";
import {
  getListApi,
  getMarkdownContentApi,
  listClassifyApi,
  listDiaryApi,
  clientWidth,
  clientHeight,
  addBlogApi,
  autoCompletionApi,
  searchApi
} from "../apis/blog";
export default {
  mounted() {
    this.init();
    let that = this;
    this.clientWidth = `${document.documentElement.clientWidth}`;
    this.clientHeight = `${document.documentElement.clientWidth}`;
    window.onresize = function () {
      that.clientWidth = `${document.documentElement.clientWidth}`;
      that.clientHeight = `${document.documentElement.clientWidth}`;
    };
    this.dirayLayoutY = -this.clientHeight + "px";
  },
  setup(props, { emit }) {
    const state = reactive({
      clientWidth: 0,
      clientHeight: 0,
      hideDiaryLayout: false,
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
      loading: true,
      blogLayoutY: "0px",
      dirayLayoutY: "0px",
      searchInput: "",
      componentsList: [],
      searchResult: false
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
    /**
     * 搜索
     */
    const search = (e) => {

      if (e.keyCode === 13) {
        state.loading = true;
        state.searchResult = true
        state.componentsList.length = 0;
        state.currentPage=1;
        searchApi(state.searchInput, 1).then((res) => {
          state.blogs = res.data.hits.map((item, index, arr) => { return item.sourceAsMap });
          state.pageSize = res.data.totalHits.value % 10 == 0 ? parseInt(res.data.totalHits.value / 10) : parseInt(res.data.totalHits.value / 10) + 1
          state.loading = false;
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
    const onArticleItemClick = (id) => {
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
      state.loading = true;
      if (state.searchResult) {
        searchApi(state.searchInput, page).then((res) => {
          state.blogs = res.data.hits.map((item, index, arr) => { return item.sourceAsMap });
          state.pageSize = res.data.totalHits.value % 10 == 0 ? parseInt(res.data.totalHits.value / 10) : parseInt(res.data.totalHits.value / 10) + 1
          state.loading = false;
        })
        return;
      }
      getListApi({ page: page, type: type }).then((res) => {
        state.searchResult = false;
        state.blogs = res.data.data.records;
        state.pageSize = res.data.data.pages;
        state.loading = false;
      });
    };
    const setBottomPage = () => { };
    /**
     * 初始化
     */
    const resetPage = () => {
      state.blogLayoutY = "0px";
      state.dirayLayoutY = -state.clientHeight + "px";
    };
    const init = () => {
      bus.on("action", (data) => {
        if (data.page == "diary" && data.opt == "close") {
          resetPage();
        }
      });
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
    const onShowArticleList = () => {
      reset();
    };
    const onHideArticleList = () => {
      if (state.hideAarticleList) {
        reset();
      }
    };
    const intoDiaryPage = () => {
      state.blogLayoutY = state.clientHeight + "px";
      state.dirayLayoutY = "0px";
      listDiaryApi().then((res) => {
        bus.trigger("action", { page: "diary", data: res.data.data });
      });
    };
    const indexPage = () => {
      resetPage();
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
      autoCompletion,
      search
    };
  },
  components: {
    diary,
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
    top: 5px;
    right: 0px;
    bottom: 5px;
    left: 322px;
    .blog-layout {
      display: flex;
      flex-direction: column;
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
