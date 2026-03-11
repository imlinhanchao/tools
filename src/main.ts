import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:uno.css'
import { addCollection } from '@iconify/vue'
import epIcons from '@iconify-json/ep/icons.json'
import mdiIcons from '@iconify-json/mdi/icons.json'
import App from './App.vue'
import router from './router'

// Pre-load icon collections for offline use
addCollection(epIcons as any)
addCollection(mdiIcons as any)

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
