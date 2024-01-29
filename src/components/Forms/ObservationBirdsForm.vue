<template>
  <div v-if="currentObservationListItem">
    <h3
      class="py-3 text-center"
      style="color: #37474f"
    >
      <LocationName :observation="currentObservationListItem" />
    </h3>
    <v-row class="mb-1">
      <v-col
        cols="10"
        class="pr-0"
      >
        <EndObservation
          :observation-loader="observationLoader"
          @end-observation="finaliseObservation"
        />
      </v-col>
      <v-col
        cols="2"
      >
        <CancelObservation
          @cancel-observation="cancelObservation"
        />
      </v-col>
    </v-row>

    <v-dialog
      v-model="displayBirdRemoveDialog"
      width="auto"
    >
      <v-card title="Retirer une espèce">
        <v-card-text>
          Souhaitez-vous retirer cette espèce de vos observation ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            prepend-icon="mdi-cancel"
            @click="displayBirdRemoveDialog = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="green"
            prepend-icon="mdi-check"
            @click="removeBirdFormList"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-divider />
    <v-autocomplete
      variant="solo-filled"
      :items="birdsList"
      item-value="value"
      item-title="text"
      :custom-filter="normalizedFilter"
      class="mt-3"
      hide-details
      label="Chercher et ajouter un oiseau"
      v-model="selectedBird"
    />
    <v-data-table
      :headers="headers"
      :custom-key-sort="sortBirds"
      :items="currentObservationListItem.observedBirds"
      class="mt-3 mb-3"
      no-data-text="Aucun oiseau observé."
    >
      <template #item="{ item }">
        <BirdItemRow
          :bird="item"
          @remove-bird="tryToRemoveBirdFromList($event)"
        />
      </template>
      <template #bottom />
    </v-data-table>

    <AddCommentaireToObservation />
  </div>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import {sortBirds} from "@/helpers/birdHelpers";
import BirdItemRow from "@/components/BirdItemRow";
import EndObservation from "@/components/Dialogs/EndObservation.vue";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import CancelObservation from "@/components/Dialogs/CancelObservation.vue";
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbar";
import AddCommentaireToObservation from "@/components/Dialogs/AddCommentaireToObservation.vue";
import LocationName from "@/components/LocationName.vue";
import {ref, watch} from "vue";

const observationStore = useObservationsStore()
const {
  updateBirdsListFromCurrentObservation,
  endObservation,
  removeObservation,
  clearCurrentObservation
} = observationStore
const {currentObservationListItem} = storeToRefs(observationStore)
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)
const observationLoader = ref(false)

function normalizedFilter(itemTitle, queryText, item) {
  const bird = normalizeText(item.raw.text)
  const birdQuery = normalizeText(queryText)
  return bird.indexOf(birdQuery) > -1
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ' ')
}

async function finaliseObservation() {
  observationLoader.value = true
  try {
    await endObservation()
    updateSnackbar({
      type: 'success',
      text: 'Votre observation a bien été enregistrée.'
    })
    await router.push({name: 'mes-observations'})
  } catch (error) {
    errorSnackbar()
  }
  observationLoader.value = false
}

async function cancelObservation() {
  try {
    await removeObservation(currentObservationListItem.value)
    await clearCurrentObservation()
  } catch (error) {
    errorSnackbar()
  }
  await router.push({name: 'accueil'})
}

function removeBirdFormList() {
  currentObservationListItem.value.observedBirds.splice(birdToRemoveIndex.value, 1)
  birdToRemoveIndex.value = null
  displayBirdRemoveDialog.value = false
}

function tryToRemoveBirdFromList(index) {
  birdToRemoveIndex.value = index
  displayBirdRemoveDialog.value = true
}

const selectedBird = ref(null)

const headers = ref([{title: 'Nom', key: 'id'}, {title: 'Nombre et compte', key: 'count'}])

watch(
  () => selectedBird.value,
  (id) => {
    if (id !== null) {
      document.activeElement.blur();
      const existingBird = currentObservationListItem.value.observedBirds.find(bird => bird.id === id)
      if (existingBird) {
        existingBird.count++
      } else {
        currentObservationListItem.value.observedBirds.push({id: id, count: 1})
      }
      updateBirdsListFromCurrentObservation(currentObservationListItem.value)
      selectedBird.value = null
    }
  }
)

</script>
