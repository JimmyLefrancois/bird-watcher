<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="red"
        density="comfortable"
        icon="mdi-delete"
      />
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-text>
          Souhaitez-vous vraiment retirer cet oiseau ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            prepend-icon="mdi-cancel"
            @click="isActive.value = false"
          >
            Annuler
          </v-btn>
          <v-btn
            :disabled="observationLoader"
            :loading="observationLoader"
            color="green"
            prepend-icon="mdi-check"
            @click="removeBirdFromObservation"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
const store = useObservationsStore()
const { observationLoader } = storeToRefs(store)

const emit = defineEmits(['remove-bird-from-observation'])

function removeBirdFromObservation() {
  emit('remove-bird-from-observation')
}
</script>
