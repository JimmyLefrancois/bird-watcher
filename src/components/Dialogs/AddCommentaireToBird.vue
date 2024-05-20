<template>
  <v-dialog
    fullscreen
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="themeLightgreenColor"
        density="comfortable"
        :icon="selectedBird.commentaire ? 'mdi-comment-text' : 'mdi-comment'"
        class="me-auto pa-1"
      />
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-text class="py-0">
          <v-textarea
            :auto-grow="true"
            :clearable="true"
            hide-details
            rows="4"
            v-model="selectedBird.commentaire"
            class="mt-5 mb-0 pb-0"
            variant="solo-filled"
            label="Ajouter un commentaire sur l'oiseau"
          />
          <div class="d-flex justify-space-between mt-5">
            <v-btn
              color="red"
              variant="outlined"
              prepend-icon="mdi-cancel"
              @click="isActive.value = false"
            >
              Annuler
            </v-btn>
            <v-btn
              variant="outlined"
              color="themeLightgreenColor"
              prepend-icon="mdi-check"
              @click="addCommentaire(isActive)"
            >
              Ajouter
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import {computed} from 'vue'
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";

const props = defineProps({
  bird: {
    type: Object,
    default: null
  }
})

const observationStore = useObservationsStore()
const {updateBirdsListFromCurrentObservation} = observationStore
const {currentObservationToHandle} = storeToRefs(observationStore)

const selectedBird = computed(() => {
  return currentObservationToHandle.value.observedBirds.find((observedBird) => props.bird.customId === observedBird.customId)
})

async function addCommentaire(isActive) {
  updateBirdsListFromCurrentObservation(currentObservationToHandle.value)
  isActive.value = false
}
</script>
