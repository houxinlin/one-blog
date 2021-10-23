<template>
  <el-container>

    <el-aside>
      <v-sidebar />

    </el-aside>
    <el-main>
      <router-view>

      </router-view>
    </el-main>
  </el-container>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import vSidebar from "../../components/slide.vue";
export default {
  components: {
    vSidebar,
  },
  setup() {
    const store = useStore();
    // const tagsList = computed(() =>
    //     // store.state.tagsList.map((item) => item.name)
    // );
    // const collapse = computed(() => store.state.collapse);
    return {
      // tagsList,
      // collapse,
    };
  },
};
</script>

<style lang="less" scoped>
.content-box {
}
.el-aside{
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
}
.el-main{
    padding-left: 300px;
}
</style>