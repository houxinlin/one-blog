<template>
  <div>
    <div class="summary">
      <el-card class="box-card">
        <div class="item">
          <img src="../../assets/svg/total.svg" alt="">
          <div>
            <div>浏览总数</div>
            <div>{{dashboardMap.total_visit}}</div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <img src="../../assets/svg/blog.svg" alt="">
          <div>
            <div>文章总数</div>
            <div>{{dashboardMap.blog_count}}</div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <img src="../../assets/svg/today.svg" alt="">
          <div>
            <div>今日浏览</div>
            <div>{{dashboardMap.today_count}}</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="art-num">
      <div id="echarts" style="width: 900px;height:400px;"></div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import { dashboardApi } from "../../apis/admin";

import * as echarts from "echarts";

// 基于准备好的dom，初始化echarts实例

export default {
  setup() {
    const state = reactive({
      dashboardMap: {},
      articleNumMap: {},
    });
    const init = () => {
      dashboardApi().then((res) => {
        state.dashboardMap = res.data.data;
        state.articleNumMap = res.data.data.article_num;
        setArticleNum(
          Object.keys(state.articleNumMap),
          Object.values(state.articleNumMap)
        );
      });
    };
    const setArticleNum = (key, value) => {
      console.log(Array.from(key).length)
      console.log(key);

      var myChart = echarts.init(document.getElementById("echarts"));
      let option = {
        title:{
          text:"文章数量"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data:key,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            title:"a",
            name: "值",
            type: "bar",
            barWidth: "60%",
            data: value,
            label:"a"
          },
        ],
      };
      myChart.setOption(option);
    };
    return { ...toRefs(state), init };
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.summary {
  display: flex;
  .box-card:nth-of-type(1) {
    margin: 0px 0;
  }

  .box-card {
    width: 220px;
    height: 112px;
    margin: 0px 30px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 17px;
      img {
        width: 62px;
      }
    }
  }
}
.art-num {
  margin-top: 32px;
}
</style>