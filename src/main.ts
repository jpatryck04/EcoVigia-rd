import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerDirectives } from './directives'

// Importar estilos globales
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// Usar plugins
app.use(pinia)
app.use(router)

// Registrar directivas personalizadas
registerDirectives(app)

app.mount('#app')