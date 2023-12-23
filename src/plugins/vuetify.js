/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
          themeBlackColor: '#202426',
          themeDarkGreenColor: '#6C733D',
          themeLightgreenColor: '#9DA65D',
          themeGreyColor: '#8C8C88',
          themeWhiteColor: '#F2F2F2',
        },
      },
    },
  },
})
