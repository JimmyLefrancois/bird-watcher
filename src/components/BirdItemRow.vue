<template>
  <tr>
    <td>{{ findBird(bird.id).text }}</td>
    <td>
      <span class="mr-2">{{ currentBird.count }}</span>
      <v-btn
        :disabled="currentBird.count <= 1"
        class="mr-2"
        density="compact"
        icon="mdi-minus"
        @click="decrementCount()"
      />
      <v-btn
        density="compact"
        class="mr-2"
        icon="mdi-plus"
        @click="incrementCount()"
      />
      <RemoveBirdFromObservation @remove-bird-from-observation="removeBirdFromObservedBirds" />
    </td>
  </tr>
</template>
<script setup>

import { findBird } from "@/helpers/birdHelpers";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import {watch, computed} from "vue";
import RemoveBirdFromObservation from "@/components/RemoveBirdFromObservation";
import router from "@/router";

const observationStore = useObservationsStore()
const { currentObservationListItem, currentEditingObservationListItem } = storeToRefs(observationStore)
const { updateBirdsListFromCurrentObservation } = observationStore

const currentObservation = router.currentRoute.value.name === 'nouvelle-observation' ? currentObservationListItem : currentEditingObservationListItem

const props = defineProps({
  bird: {type: Object, default: null}
})

const currentBird = computed(() => {
  return currentObservation.value.observedBirds.find(bird => bird.id === props.bird.id)
})

function incrementCount() {
  currentBird.value.count++
}

function decrementCount() {
  currentBird.value.count--
}

function removeBirdFromObservedBirds() {
  const observedBirdsIndex = currentObservation.value.observedBirds.findIndex((bird) => {
    return bird.id === props.bird.id
  })

  currentObservation.value.observedBirds.splice(observedBirdsIndex, 1)
  if (!currentObservation.value.endDate) {
    updateBirdsListFromCurrentObservation(currentObservation.value)
  }
}

watch(
  () => currentBird.value.count,
  () => {
    if (!currentObservation.value.endDate) {
      updateBirdsListFromCurrentObservation(currentObservation.value)
    }
  }
)
</script>
