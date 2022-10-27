import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Markdown from 'vue3-markdown-it';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


let app =createApp(App).use(ElementPlus).use(store).use(Markdown).use(router)

app.mount('#app')

