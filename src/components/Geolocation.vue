<template>
  <v-alert
    border="top"
    icon="mdi-map-marker-radius"
    border-color="themeDarkGreenColor"
    v-if="geolocationPermissionStore !== 'granted'"
  >
    Vous pouvez si vous le souhaitez activer la géolocalisation afin d'améliorer la précision des statistique en
    <span
      @click="resume"
      style="text-decoration: underline; cursor: pointer"
    >cliquant ici</span>.
  </v-alert>
</template>

<script setup>
import { useGeolocation } from '@vueuse/core'
import {defineModel, watch} from "vue";
import {useGeolocationStore} from "@/store/geolocation";
import {storeToRefs} from "pinia";
const locationStore = useGeolocationStore()
const {geolocationPermissionStore} = storeToRefs(locationStore)
const { coords, resume } = useGeolocation({immediate: false})

const coordinates = defineModel('coordinates', { type: Object })

watch(
  () => geolocationPermissionStore.value,
  (geolocationPermissionStore) => {
    if (geolocationPermissionStore === 'granted' && coords.value.accuracy === 0) {
      resume()
    }
  }
)

if (geolocationPermissionStore.value === 'granted' && coords.value.accuracy === 0) {
  resume()
}

watch(
  () => coords.value,
  (value) => {
    if (geolocationPermissionStore.value !== 'granted' && coords.value.accuracy !== 0) {
      geolocationPermissionStore.value = 'granted'
    }
    coordinates.value.latitude = value.latitude
    coordinates.value.longitude = value.longitude
  }
)

</script>


<style scoped>

</style>
