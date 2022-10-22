<template>
  <div>
    <div class="summary">
      <el-card class="box-card">
        <div class="item">
          <img src="../../assets/imgs/total.svg" alt="">
          <div>
            <div>浏览总数</div>
            <div>{{dashboardMap.total_visit}}</div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <img src="../../assets/imgs/blog.svg" alt="">
          <div>
            <div>文章总数</div>
            <div>{{dashboardMap.blog_count}}</div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <img src="../../assets/imgs/today.svg" alt="">
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
    <div class="art-num">
      <div id="city-echarts" style="width: 900px;height:400px;"></div>
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
    });
    const init = () => {
      
      dashboardApi().then((res) => {
        state.dashboardMap = res.data.data;
        setEchartsBarData("echarts", "文章数量", "#03a9f4", Object.keys(res.data.data.article_num), Object.values(res.data.data.article_num));
        setEchartsBarData("city-echarts", "城市top", "#70cda1", Object.keys(res.data.data.city_top), Object.values(res.data.data.city_top))
      })
    };
    const setEchartsBarData = (domName, title, color, key, value) => {
      var myChart = echarts.init(document.getElementById(domName));
      let option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        color: color,
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: key,
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
            title: "a",
            name: "值",
            type: "bar",
            barWidth: "60%",
            data: value,
            label: ""
          },
        ],
      };
      myChart.setOption(option);
    }

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