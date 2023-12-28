<template>
  <tr>
    <td>{{ findBird(bird.id).text }}</td>
    <td>
      <span class="mr-2">{{ currentBird.count }}</span>
      <v-btn
        :disabled="currentBird.count <= 0"
        class="mr-2"
        density="compact"
        icon="mdi-minus"
        @click="decrementCount()">
      </v-btn>
      <v-btn
        density="compact"
        class="mr-2"
        icon="mdi-plus"
        @click="incrementCount()">
      </v-btn>
      <v-btn
        color="red"
        density="compact"
        icon="mdi-delete"
        @click="removeBirdFromobservedBirds()">
      </v-btn>
    </td>
  </tr>
</template>
<script setup>

import { findBird } from "@/helpers/birdHelpers";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import {watch, computed} from "vue";

const observationStore = useObservationsStore()
const { currentObservationListItem } = storeToRefs(observationStore)
const { updateBirdsListFromCurrentObservation } = observationStore

const props = defineProps({
  bird: Object
})

const currentBird = computed(() => {
  return currentObservationListItem.value.observedBirds.find(bird => bird.id === props.bird.id)
})

function incrementCount() {
  currentBird.value.count++
}

function decrementCount() {
  currentBird.value.count--
}

function removeBirdFromobservedBirds() {
  const observedBirdsIndex = currentObservationListItem.value.observedBirds.findIndex((bird) => {
    return bird.id === props.bird.id
  })

  currentObservationListItem.value.observedBirds.splice(observedBirdsIndex, 1)
  updateBirdsListFromCurrentObservation(currentObservationListItem.value)
}

watch(
  () => currentBird.value.count,
  () => {
    updateBirdsListFromCurrentObservation(currentObservationListItem.value)
  }
)
</script>
