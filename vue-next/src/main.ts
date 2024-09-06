import './assets/main.css'
import MediaApron from './components'
import IconApron from '@icon-apron/vue-next'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(MediaApron)
app.use(IconApron)
app.mount('#app')
