<template>
  <v-dialog width="500">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-comment"
        color="themeDarkGreenColor"
        elevation="2"
        :block="true"
        :disabled="observationLoader"
        :loading="observationLoader"
        text="Ajouter un commentaire"
      />
    </template>

    <template #default="{ isActive }">
      <v-card title="Ajouter un commentaire">
        <v-card-text>
          <v-textarea
            :auto-grow="true"
            :clearable="true"
            hide-details
            rows="4"
            v-model="commentaire"
            class="mt-5 mb-0 pb-0"
            variant="solo-filled"
            label="Commenter l'observation"
          />
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
  import {useSnackbarStore} from "@/store/snackbar";
  import {useObservationsStore} from "@/store/observations";
  import {storeToRefs} from "pinia";

  const commentaire = computed({
    get() {
      if (currentObservationListItem.value.commentaire) {
        return currentObservationListItem.value.commentaire
      } else {
        return null
      }
    },
    set(newValue) {
      currentObservationListItem.value.commentaire = newValue
    }
  })
  const observationLoader = ref(false)
  const {errorSnackbar} = useSnackbarStore()
  const observationStore = useObservationsStore()
  const { addCommentaireToObservation } = observationStore
  const { currentObservationListItem } = storeToRefs(observationStore)

  async function addCommentaire(isActive) {
    observationLoader.value = true
    try {
      await addCommentaireToObservation(commentaire.value)
      isActive.value = false
    } catch (error) {
      errorSnackbar()
    }
    observationLoader.value = false
  }
</script>
