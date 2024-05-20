<template>
  <v-form
    @submit.prevent="updateObservation"
    v-if="currentObservationToHandle"
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
      class="mb-3"
    />
    <TypeSortie
      :scope="validationScope"
      :observation="currentObservationToHandle"
      @set-type-sortie="currentObservationToHandle.type = $event"
    />
    <ChoosePlaceOrLocation
      :observation="currentObservationToHandle"
      @update-existing-location="currentObservationToHandle.existingLocation = $event"
      @update-location="currentObservationToHandle.location = $event"
      :scope="validationScope"
      :creation-available="false"
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
      :model-value="currentObservationToHandle.startDate"
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
      :model-value="currentObservationToHandle.endDate"
      @update:model-value="setFormatedEndDate"
      @blur="v$.startDate.$touch()"
    />
    <v-autocomplete
      variant="solo-filled"
      :items="birdsList"
      item-value="value"
      item-title="text"
      :custom-filter="normalizedFilter"
      :error-messages="v$.observedBirds.$errors.map(e => e.$message)"
      @blur="v$.observedBirds.$touch()"
      label="Chercher et ajouter un oiseau"
      v-model="selectedBird"
    />
    <v-data-table
      v-model:expanded="expanded"
      :headers="headers"
      :custom-key-sort="sortBirds"
      :items="birdsFromCurrentObservation"
      class="mb-3"
      :items-per-page="-1"
      show-expand
      no-data-text="Aucun oiseau observé."
    >
      <template #item="{ item, toggleExpand, isExpanded, internalItem }">
        <tr>
          <BirdItemRow
            :bird="item"
            :key="item.id"
            type="edit"
          />
          <td>
            <v-btn
              variant="text"
              :icon="isExpanded(internalItem) ? 'mdi-chevron-down' : 'mdi-chevron-up'"
              @click="toggleExpand(internalItem)"
            />
          </td>
        </tr>
      </template>
      <template #expanded-row="{ columns, item }">
        <tr
          v-for="(bird, index) in getBirdInformationById(item.id)"
          :key="index"
          style="background-color: rgb(236, 236, 236)"
        >
          <BirdInformations
            :bird="bird"
            :columns="columns"
            :key="bird.customId"
          />
        </tr>
      </template>
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
import {helpers, minLength, required} from "@vuelidate/validators";
import { format } from 'date-fns'
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbar";
import AddCommentaireToObservation from "@/components/Dialogs/AddCommentaireToObservation.vue";
import TypeSortie from "@/components/Forms/TypeSortie.vue";
import ChoosePlaceOrLocation from "@/components/Forms/ChoosePlaceOrLocation.vue";
import BirdInformations from "@/components/BirdInformations.vue";

const observationStore = useObservationsStore()
const { editObservation, getBirdInformationById } = observationStore
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const { currentObservationToHandle, birdsFromCurrentObservation } = storeToRefs(observationStore)
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)
const observationLoader = ref(false)
const validationScope = 'observationScope'
const expanded = ref([])

function normalizedFilter(itemTitle, queryText, item) {
  const bird = normalizeText(item.raw.text)
  const birdQuery = normalizeText(queryText)
  return bird.indexOf(birdQuery) > -1
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ' ')
}

const rules = {
  observedBirds: {
    minLength: helpers.withMessage('Au moins un oiseau doit être dans la liste.', minLength(1)),
    required: helpers.withMessage('Ce champs est obligatoire.', required)
  },
  startDate: {required: helpers.withMessage('Ce champs est obligatoire.', required)},
  endDate: {required: helpers.withMessage('Ce champs est obligatoire.', required)},
}

function setFormatedStartDate(date) {
  currentObservationToHandle.value.startDate = format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}
function setFormatedEndDate(date) {
  currentObservationToHandle.value.endDate = format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}

let v$ = useVuelidate(rules, currentObservationToHandle, { $scope: validationScope })

async function updateObservation()
{
  v$.value.$touch()
  if (!v$.value.$invalid) {
    observationLoader.value = true
    try {
      await editObservation()
      updateSnackbar({
        type: 'success',
        text: 'Votre observation a bien été modifiée.'
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
  currentObservationToHandle.value.observedBirds.splice(birdToRemoveIndex.value, 1)
  birdToRemoveIndex.value = null
  displayBirdRemoveDialog.value = false
}

const selectedBird = ref(null)

const headers = ref([{title: 'Nom', key: 'id'}, {title: 'Compteur', key: 'count'}])

watch(
  () => selectedBird.value,
  (id) => {
    if (id !== null) {
      document.activeElement.blur();
      currentObservationToHandle.value.observedBirds.push({id: id, date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), customId: crypto.randomUUID()})
      selectedBird.value = null
    }
  }
)

</script>

<style>
.v-data-table-footer {
  display: none !important;
}
</style>
