<template>
  <v-dialog
    fullscreen
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-comment"
        color="themeDarkGreenColor"
        elevation="2"
        :block="true"
        :disabled="observationLoader"
        :loading="observationLoader"
        :text="observationToComment.commentaire === '' ? 'Commenter l\'observation' : 'Modifier le commentaire'"
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
            v-model="observationToComment.commentaire"
            class="mt-5 mb-0 pb-0"
            variant="solo-filled"
            label="Commenter l'observation"
          />
          <div class="d-flex justify-space-between mt-5">
            <v-btn
              variant="outlined"
              color="red"
              prepend-icon="mdi-cancel"
              @click="isActive.value = false"
            >
              Annuler
            </v-btn>
            <v-btn
              variant="outlined"
              :disabled="observationLoader"
              :loading="observationLoader"
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
import {ref} from 'vue'
import {useSnackbarStore} from "@/store/snackbar";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import router from "@/router";

const observationLoader = ref(false)
const {errorSnackbar} = useSnackbarStore()
const observationStore = useObservationsStore()
const {addCommentaireToObservation} = observationStore
const {currentObservationListItem, currentEditingObservationListItem} = storeToRefs(observationStore)

const mode = router.currentRoute.value.name === 'nouvelle-observation' ? 'create' : 'update'
const observationToComment = mode === 'create' ? currentObservationListItem : currentEditingObservationListItem

async function addCommentaire(isActive) {
  observationLoader.value = true
  try {
    await addCommentaireToObservation(observationToComment.value.commentaire, mode)
    isActive.value = false
  } catch (error) {
    errorSnackbar()
  }
  observationLoader.value = false
}
</script>
