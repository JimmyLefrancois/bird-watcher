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
    errorSnackbar () {
      this.updateSnackbar({
        type: 'error',
        text: 'Une erreur est survenue'
      })
    },
    resetSnackbar () {
      this.displayed = false
      this.type = ''
      this.text = ''
    }
  }
})
