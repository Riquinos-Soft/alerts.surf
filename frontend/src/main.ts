import { createApp } from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'
import { initializeLocale } from './composables/useLocale'
import './style.css'

initializeLocale()
createApp(App).use(Vant).mount('#app')
