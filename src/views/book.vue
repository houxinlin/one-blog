<template>
  <div class="desktop">
    <div :class="{'shadow':active<bookeSize-1,'center':active>0 &&active<=bookeSize-1,'center-back':active==bookeSize}" class="book">
      <div @click.stop="handlerPage(index)" :style="{'z-index':zIndex[index]}" :class="{'active':active==index,'flipped':active>index}" v-for="(item,index) in bookeSize " :key="index" class="book-page">
        <div class="front">
          <div class="opt">
            <div class="iconfont icon-tuichu" @click.stop="closePage()"></div>
            <div class="iconfont icon-shouye" @click.stop="goHome()"></div>
          </div>

          <div v-if="index==0" class="conver">
            <div> </div>
            <img src="../assets/imgs/jihe.jpeg" alt="">
          </div>
          <div v-if="index>=1 && index <bookeSize-1" class="content">

            <header>{{articleList[index-1][0].blogTitle}}</header>
            <div class="date">{{articleList[index-1][0].createDate}}</div>
            <el-scrollbar height="400px">
              <article>{{articleList[index-1][0].markdownContent}}</article>
            </el-scrollbar>
          </div>
        </div>
        <div class="after">
          <div class="catalogue" v-if="index==0">
            <h3>目录</h3>
            <div>
              <el-scrollbar height="400px">
                <template v-for="(item ,i) in articleList" :key="item.id">
                  <li @click.stop="goToPage(i+1,it)" v-for="(el ,it) in item" :key="el.id">

                    <span>{{el.blogTitle}}</span>
                    <span>
                      <template v-for="item in 100" :key="item">.</template>
                    </span>
                    <span><span>{{(i*2+it)+1}}</span></span>
                  </li>
                </template>
              </el-scrollbar>

            </div>
          </div>
          <div v-if="index>=1 && index <bookeSize-1" class="content">
            <header>{{articleList[index-1].length>1?articleList[index-1][1].blogTitle:''}}</header>
            <div class="date">{{articleList[index-1].length>1?articleList[index-1][1].createDate:''}}</div>

            <el-scrollbar height="400px">
              <article>{{articleList[index-1].length>1?articleList[index-1][1].markdownContent:''}}</article>
            </el-scrollbar>
          </div>
          <div v-if="index==bookeSize-1" class="conver">
            <div>感谢阅读</div>
            <img src="../assets/imgs/jihe.jpeg" alt="">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { reactive, toRefs } from "vue";

import "../assets/font/font-icon/iconfont.css";
import bus from "../event/event";
export default {
  setup() {
    const state = reactive({
      lastTimeStamp: 0,
      articleList: [],
      active: 0,
      dataSource: null,
      zIndex: [],
      stateMap: new Map(),
      palying: false,
      icon: "",
      bookeSize: 1,
    });
    const closePage = () => {
      bus.trigger("action", { page: "diary", opt: "close", data: null });
    };

    const handlerPage = (index) => {
      let nowTimer = new Date().getTime();
      if (nowTimer - state.lastTimeStamp < 50) {
        return;
      }
      if (!state.stateMap.get(index) || false) {
        nextPage(index);
        state.stateMap.set(index, true);
        return;
      }

      upPage(index);
      state.stateMap.set(index, false);
    };
    const filp = (index) => {
      setTimeout(() => {
        let newIndex = index;
        state.zIndex[newIndex] = state.bookeSize - state.zIndex[newIndex] + 1;
      }, 150);
    };
    const nextPage = (index) => {
      state.palying = true;
      filp(index);
      state.active = state.active + 1;
      state.lastTimeStamp = new Date().getTime();
    };
    const upPage = (index) => {
      filp(index);
      state.active = state.active - 1;
      state.lastTimeStamp = new Date().getTime();
    };
    const goToPage = (page, i) => {
      page = i == 1 ? page + 1 : page;
      console.log(page);
      state.stateMap.clear();
      for (let i = 0; i < page; i++) {
        state.stateMap.set(i, true);
      }
      state.active = page;
      setTimeout(() => {
        for (let i = 0; i < page; i++) {
          state.zIndex[i] = i + 1;
        }
      }, 200);
    };
    const goHome = () => {
      state.active = 1;
      state.stateMap.clear();
      state.stateMap.set(0, true);
      setTimeout(() => {
        for (let i = state.bookeSize - 1; i > 0; i--) {
          console.log(i);
          state.zIndex[i] = state.bookeSize - i;
        }
        state.zIndex[0] = 1;
      }, 200);
    };
    const initPage = (data) => {
      if (data == null) {
        return;
      }
      state.dataSource = data;
      state.active = 0;
      state.zIndex.length = 0;
      state.stateMap.clear();
      state.bookeSize = Math.ceil(data.length / 2) + 2;
      var result = [];
      for (var i = 0; i < data.length; i += 2) {
        result.push(data.slice(i, i + 2));
      }
      state.articleList = result;

      for (let i = 0; i < state.bookeSize; i++) {
        state.zIndex.push(state.bookeSize - i);
      }
    };

    return {
      ...toRefs(state),
      upPage,
      goHome,
      handlerPage,
      closePage,
      nextPage,
      goToPage,
      initPage,
    };
  },
  mounted() {
    bus.on("action", (data) => {
      if (data.page == "diary") {
        if (data.data != null) {
          this.initPage(data.data);
        }
      }
    });
  },
};
</script>


<style lang="less" scoped>
.conver {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #30374a;

  div {
    flex: 1;
    color: #ffffff;
    font-size: 15px;
    text-align: center;
    margin-top: 10px;
  }
  img {
    flex: 1;
    object-fit: cover;
  }
}
.flipped {
  transform: rotateY(-180deg);
}
.center {
  transform: translateX(180px);
}
.center-back {
  transform: translateX(360px);
}

.shadow {
  box-shadow: 4px 4px 11px 0px #9a9a9a;
}
.book {
  position: relative;
  width: 360px;
  height: 540px;
  transition: all 0.5s;
  perspective: 2000px;
  border-radius: 0px 8px;

  .book-page:nth-of-type(1) .front {
    // box-shadow: 3px -1px 7px #000000;
  }
  .book-page:nth-of-type(1) .after {
    box-shadow: -3px 0px 2px #dadada;
  }
  .book-page {
    cursor: pointer;
    position: absolute;
    color: black;
    width: 100%;
    height: 100%;
    transition: 0.5s transform;
    transform-style: preserve-3d;
    transform-origin: left center;
  }
  .book-page:nth-of-type(1) {
    .opt {
      .iconfont {
        color: #ffffff !important;
      }
    }
  }
  .catalogue {
    height: 100%;
    overflow-y: auto;
    h3 {
      padding: 20px;
      text-align: center;
    }
    li:hover {
      background: #bbbbbb17;
    }
    li {
      // transition: all 0.6s;
      display: flex;
      font-size: 12px;
      margin: 10px 0px;
      padding: 4px 10px;
      color: #000000;
      span:nth-of-type(1) {
      }
      span:nth-of-type(2) {
        overflow: hidden;
        flex: 2;
        margin: 0px 10px;
      }
      span:nth-of-type(3) {
        width: 100px;
      }
      span {
        display: inline;
      }
    }
  }
  .content {
    padding: 20px;
    color: #000000;
    font-size: 14px;
  }
  header {
    font-size: 16px;
    color: #000000;
    text-align: center;
    margin-top: 20px;
  }
  .date {
    font-size: 12px;
    color: #000000;
    margin-top: 10px;
  }
  article {
    overflow-y: auto;
    white-space: pre-wrap;
    padding: 10px 0px;
    font-size: 12px;
    color: #000000;
    text-indent: 2rem;
  }

  .front {
    .opt {
      position: absolute;
      right: 10px;
      top: 4px;
      color: #000000;
      display: flex;
      .iconfont {
        padding: 8px;
        color: #000000;
        font-size: 15px;
      }
      .iconfont:hover {
        // background: #f4f4f4;
        // border-radius: 2px;
      }
    }
  }
  .front,
  .after {
    background: linear-gradient(to right, #ffffff, #f8f8f8);
    backface-visibility: hidden;
    width: 100%;
    height: 100%;
    position: absolute;
    transition: 0.5s transform;
    box-sizing: border-box;
  }
  // overflow: hidden;
}

.after {
  transform: rotateY(180deg);
}
.back {
  transform: rotateY(180deg);
}
</style>