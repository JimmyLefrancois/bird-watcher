<template>
  <v-alert
    border="top"
    border-color="themeDarkGreenColor"
    v-if="geolocationPermissionStore !== 'granted'"
    style="font-size: 13px;"
  >
    Vous pouvez si vous le souhaitez activer la géolocalisation afin d'améliorer la précision des statistiques de vos observations en
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
    coordinates.value.latitude = value.latitude
    coordinates.value.longitude = value.longitude
  }
)

</script>


<style scoped>

</style>
