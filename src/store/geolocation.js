import {defineStore} from "pinia";
import {ref} from "vue";

export const useGeolocationStore = defineStore('geolocation', () => {

  const geolocationPermissionStore = ref('')

  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    geolocationPermissionStore.value = result.state
  })

  return {
    geolocationPermissionStore
  }
})
