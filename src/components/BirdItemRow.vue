<template>
  <td>{{ findBirdInBirdsList(bird.id).text }}</td>
  <td>
    <span class="mr-2">{{ bird.count }}</span>
    <v-btn
      density="comfortable"
      class="mr-2"
      icon="mdi-plus"
      @click="addBird()"
    />
  </td>
</template>
<script setup>

import { findBirdInBirdsList } from "@/helpers/birdHelpers";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import {format} from "date-fns";
import {useGeolocationStore} from "@/store/geolocation";

const observationStore = useObservationsStore()
const { currentObservationListItem, currentObservationToHandle } = storeToRefs(observationStore)
const { updateBirdsListFromCurrentObservation } = observationStore

const geolocationStore = useGeolocationStore()
const {isUsingGeolocation, coordinates} = storeToRefs(geolocationStore)

const props = defineProps({
  bird: {type: Object, default: null},
  type: {type: String, default: 'create'}
})

function addBird() {
  const birdToAdd = {id: props.bird.id, date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), customId: crypto.randomUUID()}
  if (isUsingGeolocation.value && props.type === 'create') {
    birdToAdd.longitude = coordinates.value.longitude
    birdToAdd.latitude = coordinates.value.latitude
  }
  currentObservationToHandle.value.observedBirds.push(birdToAdd)
  if (!currentObservationToHandle.value.endDate) {
    updateBirdsListFromCurrentObservation(currentObservationListItem.value)
  }
}
</script>
