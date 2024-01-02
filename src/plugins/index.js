/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/conf/firebase'
// import { ReCaptchaV3Provider } from 'firebase/app-check'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueFire, {
      firebaseApp,
      modules: [
        VueFireAuth,
        // VueFireAppCheck({
        //   provider: new ReCaptchaV3Provider('6LeUVTspAAAAADuVR3bQQaUlyvzH0gJxHpVVeuk7'),
        //   isTokenAutoRefreshEnabled: true,
        //   debug: import.meta.env.VITE_API_KEY !== 'production',
        // })
      ]
    })
}
