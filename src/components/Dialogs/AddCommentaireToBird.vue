<template>
  <v-dialog
    fullscreen
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="red"
        density="compact"
        icon="mdi-comment"
        :disabled="birdCommentaryLoader"
        :loading="birdCommentaryLoader"
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
            label="Commenter l'observation"
          />
        </v-card-text>

        <v-card-actions class="pr-4">
          <v-spacer />
          <v-btn
            color="red"
            prepend-icon="mdi-cancel"
            @click="isActive.value = false"
          >
            Annuler
          </v-btn>
          <v-btn
            :disabled="birdCommentaryLoader"
            :loading="birdCommentaryLoader"
            color="themeLightgreenColor"
            prepend-icon="mdi-check"
            @click="addCommentaire(isActive)"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";

const props = defineProps({
  bird: {
    type: Object,
    default: null
  }
})

const birdCommentaryLoader = ref(false)
const observationStore = useObservationsStore()
const {updateBirdsListFromCurrentObservation} = observationStore
const {currentObservationToHandle} = storeToRefs(observationStore)

const selectedBird = computed(() => {
  return currentObservationToHandle.value.observedBirds.find((observedBird) => props.bird.customId === observedBird.customId)
})

async function addCommentaire(bird, isActive) {
  updateBirdsListFromCurrentObservation(currentObservationToHandle.value)
  isActive.value = false
}
</script>
