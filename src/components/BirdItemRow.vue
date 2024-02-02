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
  </td>
</template>
<script setup>

import { findBirdInBirdsList } from "@/helpers/birdHelpers";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import {format} from "date-fns";

const observationStore = useObservationsStore()
const { currentObservationListItem, currentObservationToHandle } = storeToRefs(observationStore)
const { updateBirdsListFromCurrentObservation } = observationStore

const props = defineProps({
  bird: {type: Object, default: null}
})

function addBird() {
  currentObservationToHandle.value.observedBirds.push({id: props.bird.id, date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), customId: crypto.randomUUID()})
  if (!currentObservationToHandle.value.endDate) {
    updateBirdsListFromCurrentObservation(currentObservationListItem.value)
  }
}
</script>
