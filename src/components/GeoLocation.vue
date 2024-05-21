<template>
  <v-alert
    border="top"
    border-color="themeDarkGreenColor"
    v-if="!isUsingGeolocation"
    style="font-size: 13px;"
  >
    Vous pouvez si vous le souhaitez, activer la géolocalisation afin d'améliorer la précision des statistiques de vos observations en
    <span
      @click="watchPosition"
      style="text-decoration: underline; cursor: pointer"
    >cliquant ici</span>.
  </v-alert>
</template>

<script setup>

import {useGeolocationStore} from "@/store/geolocation";
import {storeToRefs} from "pinia";
const locationStore = useGeolocationStore()
const {isUsingGeolocation} = storeToRefs(locationStore)
const {watchPosition} = locationStore

</script>


<style scoped>

</style>
