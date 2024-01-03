<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="red"
        size="small"
        prepend-icon="mdi-delete"
      >
        Supprimer
      </v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="Supprimer l'observation">
        <v-card-text>
          Souhaitez-vous vraiment supprimer cette observation ?
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
            @click="removeObservation"
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

const emit = defineEmits(['removeObservation'])

function removeObservation() {
  emit('removeObservation')
}
</script>
