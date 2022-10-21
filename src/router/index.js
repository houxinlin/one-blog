import { createRouter, createWebHistory } from "vue-router";

const constantRoutes = [
  {
    path: "/",
    name: "Index",
    component:()=>import("../views/index.vue"),

  },

  {
    path: "/login",
    name: "Login",
    component:()=>import("../views/admin/login.vue"),

  },
  {
    path: "/manager",
    name: "Manager",
    meta: {
      login: true,
    },
    component:()=>import("../views/admin/manager.vue"),

    children: [
      {
        path: "/dashboard",
        component:()=>import("../views/admin/dashboard.vue"),
 
        meta: {
          login: true,
        },
      },
      {
        path: "/article",
        component:()=>import("../views/admin/article.vue"),

        meta: {
          login: true,
        },
      },
      {
        path: "/setting",
        name: "Setting",
        component:()=>import("../views/admin/setting.vue")
   
      },
      {
        path: "/write",
        component:()=>import("../views/admin/write.vue"),
        meta: {
          login: true,
        },
      },
      {
        path: "/browseRecord",
        component:()=>import("../views/admin/browseRecord.vue"),
  
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
    console.log(to)
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