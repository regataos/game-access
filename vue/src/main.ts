import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { init } from "@neutralinojs/lib"

const app = createApp(App)
app.use(router)
app.mount('#app')

init();