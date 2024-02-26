<template>
  <v-alert
    border="top"
    icon="mdi-map-marker-radius"
    border-color="themeDarkGreenColor"
    v-if="geolocationPermission !== 'granted'"
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
const { coords, resume } = useGeolocation({immediate: false})

const geolocationPermission = defineModel('geolocationPermission', { type: String })
const coordinates = defineModel('coordinates', { type: Object })

navigator.permissions.query({ name: "geolocation" }).then((result) => {
  geolocationPermission.value = result.state
  if (result.state === 'granted') {
    resume()
  }
})

watch(
  () => coords.value,
  (value) => {
    if (geolocationPermission.value !== 'granted' && coords.value.accuracy !== 0) {
      geolocationPermission.value = 'granted'
    }
    coordinates.value.latitude = value.latitude
    coordinates.value.longitude = value.longitude
  }
)

</script>


<style scoped>

</style>
