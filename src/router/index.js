import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index.vue'
import Index2 from '../views/book-page.vue'
import manage from '../views/admin/manager.vue'
import write from '../views/admin/write.vue'
const writePage = resolve => require.ensure([], () => resolve(index), 'list');
const routes = [
  {
    path: '/',
    name: 'Index',
    component:  () => import ( /* webpackChunkName: "index" */ "../views/index.vue")

    // children: [{
		// 	path: '/write',
		// 	component: write,
		// 	meta: [],
		// }]
  },
  {
    path: '/manager',
    name: 'Manager',
    component:  () => import ( /* webpackChunkName: "manager" */ "../views/admin/manager.vue"),
    children: [{
			path: '/write',
			component:  () => import ( /* webpackChunkName: "write" */ "../views/admin/write.vue"),
			meta: [],
		}]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
