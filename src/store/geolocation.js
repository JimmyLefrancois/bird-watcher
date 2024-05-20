import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {useStorage} from "@vueuse/core";

export const useGeolocationStore = defineStore('geolocation', () => {

  const currentGeolocationPermission = ref('')
  const coordinates = ref(null)
  const watchId = useStorage('watchId', -1)
  const isUsingGeolocation = ref(false)

  function updateCurrentPermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      currentGeolocationPermission.value = result.state
    })
  }

  updateCurrentPermission()

  watch(
    () => currentGeolocationPermission.value,
    (currentGeolocationPermission) => {
      if (currentGeolocationPermission === 'granted' && watchId.value && !isUsingGeolocation.value) {
        watchPosition()
        isUsingGeolocation.value = true
      }
    }
  )

  function watchPosition() {
    watchId.value = navigator.geolocation.watchPosition(success)
  }

  function stopWatching() {
    navigator.geolocation.clearWatch(watchId.value)
    watchId.value = null
    coordinates.value = null
    isUsingGeolocation.value = false
  }

  function success(position) {
    const { coords } = position;
    coordinates.value = coords
    if (currentGeolocationPermission.value !== 'granted') {
      currentGeolocationPermission.value = 'granted'
    }
    if (!isUsingGeolocation.value) {
      isUsingGeolocation.value = true
    }
  }

  return {
    currentGeolocationPermission,
    watchPosition,
    coordinates,
    stopWatching,
    isUsingGeolocation,
    watchId
  }
})
