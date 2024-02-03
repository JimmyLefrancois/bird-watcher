<template>
  <td
    :colspan="columns.length"
  >
    <div class="d-flex">
      <p class="d-flex align-center pl-4">
        Observé à {{ getHoursAndMinutes(bird.date) }}
      </p>
      <v-btn
        density="compact"
        icon="mdi-gender-male"
        :color="bird.gender === 'male' ? 'themeDarkGreenColor' : 'white'"
        @click="setGender('male', bird)"
        class="mx-2"
      />
      <v-btn
        density="compact"
        icon="mdi-gender-female"
        :color="bird.gender === 'female' ? 'themeDarkGreenColor' : 'white'"
        @click="setGender('female', bird)"
        class="me-auto"
      />
      <RemoveBirdFromObservation
        @remove-bird-from-observation="removeBirdFromObservedBirds"
        :key="bird.customId"
      />
    </div>
  </td>
</template>

<script setup>
import RemoveBirdFromObservation from "@/components/Dialogs/RemoveBirdFromObservation.vue";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import {format} from "date-fns";

const observationStore = useObservationsStore()
const {currentObservationToHandle} = storeToRefs(observationStore)
const {updateBirdsListFromCurrentObservation} = observationStore

const props = defineProps({
  bird: {type: Object, default: null},
  columns: {type: Array, default: () => []}
})

function removeBirdFromObservedBirds() {
  const observedBirdsIndex = currentObservationToHandle.value.observedBirds.findIndex((bird) => {
    return bird.customId === props.bird.customId
  })

  currentObservationToHandle.value.observedBirds.splice(observedBirdsIndex, 1)
  if (!currentObservationToHandle.value.endDate) {
    updateBirdsListFromCurrentObservation(currentObservationToHandle.value)
  }
}

const getHoursAndMinutes = (date) => {
  return format(new Date(date), 'HH:mm')
}

function setGender(gender, bird) {
  const selectedBird = currentObservationToHandle.value.observedBirds.find((observedBird) => bird.customId === observedBird.customId)
  if (selectedBird.gender === gender) {
    delete selectedBird.gender
  } else {
    selectedBird.gender = gender
  }
  if (!currentObservationToHandle.value.endDate) {
    updateBirdsListFromCurrentObservation(currentObservationToHandle.value)
  }
}
</script>

<style scoped>

</style>
