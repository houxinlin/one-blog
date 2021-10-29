import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import mitt from 'mitt';
const emitter = mitt();

let app =createApp(App).use(ElementPlus).use(store).use(router)
app.config.globalProperties.emitter = emitter;

app.mount('#app')

