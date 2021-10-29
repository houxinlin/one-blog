import { createRouter, createWebHistory } from "vue-router";

const constantRoutes = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "index" */ "../views/index.vue"),
  },

  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/admin/login.vue"),
  },
  {
    path: "/manager",
    name: "Manager",
    meta: {
      login: true,
    },
    component: () =>
      import(/* webpackChunkName: "manager" */ "../views/admin/manager.vue"),
    children: [
      {
        path: "/dashboard",
        component: () =>
          import(
            /* webpackChunkName: "article" */ "../views/admin/dashboard.vue"
          ),
        meta: {
          login: true,
        },
      },
      {
        path: "/article",
        component: () =>
          import(
            /* webpackChunkName: "article" */ "../views/admin/article.vue"
          ),
        meta: {
          login: true,
        },
      },
      {
        path: "/setting",
        name: "Setting",
        component: () =>
          import(
            /* webpackChunkName: "Setting" */ "../views/admin/setting.vue"
          ),
      },
      {
        path: "/write",
        component: () =>
          import(/* webpackChunkName: "write" */ "../views/admin/write.vue"),
        meta: {
          login: true,
        },
      },
      {
        path: "/browseRecord",
        component: () =>
          import(
            /* webpackChunkName: "browseRecord" */ "../views/admin/browseRecord.vue"
          ),
        meta: {
          login: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes,
});
router.beforeEach((to, from, next) => {
  if (to.meta.login) {
    if (sessionStorage.getItem("login")) {
      next();
    } else {
      next({ path: "/login" });
    }
  } else {
    next();
  }
});
export default router;
