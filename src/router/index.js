import { createRouter, createWebHistory } from "vue-router";

const constantRoutes = [
  {
    path: "/",
    name: "Index",
    // component(resolve) {
    //   require(['../views/index.vue'], resolve)
    // }
    component: () =>
    import(/* webpackChunkName: "Index" */ "../views/index.vue")
   },

  {
    path: "/login",
    name: "Login",
    // component(resolve) {
    //   require(['../views/index.vue'], resolve)
    // }
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/admin/login.vue"),
  },
  {
    path: "/manager",
    name: "Manager",
    meta: {
      login: true,
    },
    component(resolve) {
      require(['../views/admin/manager.vue'], resolve)
    },
    children: [
      {
        path: "/dashboard",
        component(resolve) {
          require(['../views/admin/dashboard.vue'], resolve)
        },
        meta: {
          login: true,
        },
      },
      {
        path: "/article",
        component(resolve) {
          require(['../views/admin/article.vue'], resolve)
        }
     ,
        meta: {
          login: true,
        },
      },
      
      {
        path: "/setting",
        name: "Setting",

        component(resolve) {
          require(['../views/admin/setting.vue'], resolve)
        }

      },
      {
        path: "/write",
        component(resolve) {
          require(['../views/admin/write.vue'], resolve)
        },
        meta: {
          login: true,
        },
      },
      {
        path: "/browseRecord",
        component(resolve) {
          require(['../views/admin/browseRecord.vue'], resolve)
        },

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
