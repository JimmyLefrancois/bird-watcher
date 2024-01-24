<template>
  <v-form
    @submit.prevent="updateObservation"
    v-if="currentEditingObservationListItem"
    class="mt-4"
  >
    <v-btn
      @click="updateObservation"
      :loading="observationLoader"
      :disabled="observationLoader"
      prepend-icon="mdi-check"
      color="themeLightgreenColor"
      elevation="2"
      :block="true"
      text="Modifier la sortie"
    />
    <v-text-field
      class="pt-5"
      v-model="currentEditingObservationListItem.location"
      :error-messages="v$.location.$errors.length > 0 ? v$.location.$errors[0].$message :''"
      required
      label="Lieu"
      @blur="v$.location.$touch()"
      variant="solo-filled"
    />
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
    <p>Date de début : </p>
    <VueDatePicker
      required
      locale="fr"
      placeholder="Select Date"
      cancel-text="Fermer"
      select-text="Valider"
      class="mb-2"
      auto-apply
      format="dd/MM/yyy HH:mm"
      :model-value="currentEditingObservationListItem.startDate"
      @update:model-value="setFormatedStartDate"
      @blur="v$.endDate.$touch()"
    />
    <p>Date de fin : </p>
    <VueDatePicker
      required
      locale="fr"
      cancel-text="Fermer"
      select-text="Valider"
      class="mb-5"
      auto-apply
      format="dd/MM/yyy HH:mm"
      :model-value="currentEditingObservationListItem.endDate"
      @update:model-value="setFormatedEndDate"
      @blur="v$.startDate.$touch()"
    />
    <v-autocomplete
      variant="solo-filled"
      :items="birdsList"
      item-value="value"
      item-title="text"
      :error-messages="v$.observedBirds.$errors.length > 0 ? v$.observedBirds.$errors[0].$message :''"
      @blur="v$.observedBirds.$touch()"
      label="Chercher et ajouter un oiseau"
      v-model="selectedBird"
    />
    <v-data-table
      :headers="headers"
      :custom-key-sort="sortBirds"
      :items="currentEditingObservationListItem.observedBirds"
      class="mb-3"
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
  </v-form>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import { sortBirds } from "@/helpers/birdHelpers";
import {ref, watch} from "vue";
import BirdItemRow from "@/components/BirdItemRow";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import {useVuelidate} from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";
import { format } from 'date-fns'
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbar";
import AddCommentaireToObservation from "@/components/AddCommentaireToObservation";

const observationStore = useObservationsStore()
const { editObservation } = observationStore
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const { currentEditingObservationListItem } = storeToRefs(observationStore)
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)
const observationLoader = ref(false)

birdsList.unshift({value: -1, text: "Oiseau non reconnu", link: "#"})

const rules = {
  observedBirds: {minLength: minLength(1), required},
  location: {required},
  startDate: {required},
  endDate: {required},
}

function setFormatedStartDate(date) {
  currentEditingObservationListItem.value.startDate = format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}
function setFormatedEndDate(date) {
  currentEditingObservationListItem.value.endDate = format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}

let v$ = useVuelidate(rules, currentEditingObservationListItem)

async function updateObservation()
{
  v$.value.$touch()
  if (!v$.value.$invalid) {
    observationLoader.value = true
    try {
      await editObservation()
      updateSnackbar({
        type: 'success',
        text: 'Votre observation a bien été modifié.'
      })
      await router.push({ name: 'observation', params: { observation: router.currentRoute.value.params.observation } })
    } catch (error) {
      console.log(error)
      errorSnackbar()
    }
    observationLoader.value = false
  }
}

function removeBirdFormList() {
  currentEditingObservationListItem.value.observedBirds.splice(birdToRemoveIndex.value, 1)
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
      const existingBird = currentEditingObservationListItem.value.observedBirds.find(bird => bird.id === id)
      if (existingBird) {
        existingBird.count++
      } else {
        currentEditingObservationListItem.value.observedBirds.push({id: id, count: 1})
      }
      selectedBird.value = null
    }
  }
)

</script>
