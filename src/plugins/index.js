/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'

console.log(import.meta.env.VITE_API_KEY)
export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
