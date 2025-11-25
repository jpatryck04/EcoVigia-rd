import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Estilos globales
import './assets/main.css'

// Opción 1: Usar Font Awesome via CDN (recomendado)
// Agrega esto en public/index.html en lugar de importarlo aquí

// Opción 2: Si prefieres el paquete npm, descomenta:
// import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')