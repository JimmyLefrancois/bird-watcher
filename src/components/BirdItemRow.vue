<template>
  <tr>
    <td>{{ findBird(bird.id).text }}</td>
    <td>
      <span class="mr-2">{{ bird.count }}</span>
      <v-btn
        v-if="bird.count > 0"
        class="mr-2"
        density="compact"
        icon="mdi-minus"
        @click="decrementCount(bird.id)">
      </v-btn>
      <v-btn
        density="compact"
        icon="mdi-plus"
        @click="incrementCount(bird.id)">
      </v-btn>
    </td>
    <td>
      <v-icon
          size="small"
          class="me-2"
          color="red"
          @click="removeBirdFromobservedBirds(bird.id)"
      >
        mdi-delete
      </v-icon>
    </td>
  </tr>
</template>
<script setup>

import { findBird } from "@/helpers/birdHelpers";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";

const observationStore = useObservationsStore()
const { currentObservationListItem } = storeToRefs(observationStore)

defineProps({
  bird: Object
})

const emit = defineEmits(['removeBird'])

function incrementCount(birdId) {
  const existingBird = currentObservationListItem.value.observedBirds.find(bird => bird.id === birdId)
  existingBird.count++
}

function decrementCount(birdId) {
  const existingBird = currentObservationListItem.value.observedBirds.find(bird => bird.id === birdId)
  existingBird.count--
}

function removeBirdFromobservedBirds(birdId) {
  const observedBirdsIndex = currentObservationListItem.value.observedBirds.findIndex((bird) => {
    return bird.id === birdId
  })

  emit('removeBird', observedBirdsIndex)
}
</script>
