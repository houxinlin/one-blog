<template>
  <div>

    <el-aside>
      <v-sidebar />
    </el-aside>
    <el-main>
      <router-view>

      </router-view>
    </el-main>
  </div>
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
.el-aside {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 200px;
  background: #ffffff;
  box-shadow:2px 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-main {
    position: absolute;
    bottom: 0px;
    top: 0px;
    left: 210px;
    right: 0px;
    box-sizing: border-box;
}
</style>