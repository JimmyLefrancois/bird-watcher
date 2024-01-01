<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        color="red"
        density="compact"
        icon="mdi-delete">
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Retirer cette espèce">
        <v-card-text>
          Souhaitez-vous vraiment retirer cette espèce de votre liste ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            prepend-icon="mdi-cancel"
            @click="isActive.value = false"
          >Annuler</v-btn>
          <v-btn
            :disabled="observationLoader"
            :loading="observationLoader"
            color="green"
            prepend-icon="mdi-check"
            @click="removeBirdFromObservation"
          >Supprimer</v-btn>
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

const emit = defineEmits(['removeBirdFromObservation'])

function removeBirdFromObservation() {
  emit('removeBirdFromObservation')
}
</script>
