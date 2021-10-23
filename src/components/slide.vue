<template>
  <div class="sidebar">

    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>

      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index">
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}</el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const items = [
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "系统总览",
      },
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "来访记录",
      },

      {
        icon: "el-icon-lx-calendar",
        index: "2",
        title: "文章管理",
        subs: [
          {
            index: "/write",
            title: "写文章",
          },
          {
            index: "/upload",
            title: "文章管理",
          },
        ],
      },
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "系统设置",
      },

      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "资源管理",
      },
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "退出登陆",
      },
    ];

    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    return {
      items,
      onRoutes,
      collapse,
    };
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 0px;
  bottom: 0px;
  overflow-y: scroll;
  /* width: 14rem; */
  font-size: 15px;
  background: #324157;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
}
.sidebar > ul {
  height: 100%;
}
.el-sub-menu .el-menu-item {
  padding-left: 70px !important;
}
</style>
