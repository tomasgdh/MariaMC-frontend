import { createApp } from "vue";
import axios from 'axios';
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import './scss/fonts.scss'
import { createPinia } from 'pinia'
import App from "./App.vue";


// Vuetify

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'; // Importa los estilos de los iconos MDI
// import * as mdi from '@mdi/js'; // Importa los iconos MDI
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { es } from 'vuetify/locale'
const vuetify = createVuetify({
  locale: {
    locale: 'es',
    messages: { es },
  },
  components,
  directives
})

const pinia = createPinia()
const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.use(vuetify)
app.use(pinia)
app.use(router)
app.mount("#app")