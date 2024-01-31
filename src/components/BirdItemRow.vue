<template>
  <td>{{ findBirdInBirdsList(bird.id).text }}</td>
  <td>
    <span class="mr-2">{{ bird.count }}</span>
    <v-btn
      density="compact"
      class="mr-2"
      icon="mdi-plus"
      @click="addBird()"
    />
    <!--      <RemoveBirdFromObservation @remove-bird-from-observation="removeBirdFromObservedBirds" />-->
  </td>
</template>
<script setup>

import { findBirdInBirdsList } from "@/helpers/birdHelpers";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import router from "@/router";
import {format} from "date-fns";

const observationStore = useObservationsStore()
const { currentObservationListItem, currentEditingObservationListItem } = storeToRefs(observationStore)
const { updateBirdsListFromCurrentObservation } = observationStore

const currentObservation = router.currentRoute.value.name === 'nouvelle-observation' ? currentObservationListItem : currentEditingObservationListItem

const props = defineProps({
  bird: {type: Object, default: null}
})

function addBird() {
  currentObservation.value.observedBirds.push({id: props.bird.id, date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), customId: crypto.randomUUID()})
  if (!currentObservation.value.endDate) {
    updateBirdsListFromCurrentObservation(currentObservationListItem.value)
  }
}

// function removeBirdFromObservedBirds() {
//   const observedBirdsIndex = currentObservation.value.observedBirds.findIndex((bird) => {
//     return bird.id === props.bird.id
//   })
//
//   currentObservation.value.observedBirds.splice(observedBirdsIndex, 1)
//   if (!currentObservation.value.endDate) {
//     updateBirdsListFromCurrentObservation(currentObservation.value)
//   }
// }
</script>
