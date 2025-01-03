import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => {
    return {
      displayed: false,
      type: '',
      text: ''
    }
  },
  actions: {
    updateSnackbar ({
      type,
      text
    }) {
      this.displayed = true
      this.type = type
      this.text = text
    },
    errorSnackbar (message = null) {
      this.updateSnackbar({
        type: 'error',
        text: message ? message : 'Une erreur est survenue'
      })
    },
    resetSnackbar () {
      this.displayed = false
      this.type = ''
      this.text = ''
    }
  }
})
