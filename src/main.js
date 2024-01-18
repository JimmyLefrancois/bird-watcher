/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { registerSW } from 'virtual:pwa-register'


// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.component('VueDatePicker', VueDatePicker);
registerSW({ immediate: true })

registerPlugins(app)

app.mount('#app')
