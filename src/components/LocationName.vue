<template>
  <v-icon
    :icon="observationLocationName.icon"
    v-if="displayIcon"
  />
  {{ observationLocationName.name }}
</template>

<script setup>
import {useObservationsPlacesStore} from "@/store/places";
import {computed} from "vue";

const observationPlaceStore = useObservationsPlacesStore()
const {getPlaceByObservation} = observationPlaceStore

const props = defineProps({
  observation: {
    type: Object,
    default: null
  },
  displayIcon: {
    type: Boolean,
    default: true
  }
})

const placeByObservation = getPlaceByObservation(props.observation)

const observationLocationName = computed(() => {
  if (placeByObservation?.value) {
    return {
      name: placeByObservation.value.name,
      icon: 'mdi-home'
    }
  } else {
    return {
      name: props.observation.location,
      icon: 'mdi-walk'
    }
  }
})

</script>

<style scoped>

</style>
