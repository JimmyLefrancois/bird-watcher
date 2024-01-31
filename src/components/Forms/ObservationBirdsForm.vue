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
      v-model:expanded="expanded"
      :headers="headers"
      :custom-key-sort="sortBirds"
      :items="birdsFromCurrentObservation"
      class="mt-3 mb-3"
      no-data-text="Aucun oiseau observé."
      show-expand
    >
      <template #item="{ item, toggleExpand, isExpanded, internalItem }">
        <tr>
          <BirdItemRow
            :bird="item"
            :key="item.id"
            @remove-bird="tryToRemoveBirdFromList($event)"
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
          <td
            :colspan="columns.length"
            class="pl-8"
          >
            Observé à {{ getHoursAndMinutes(bird.date) }}
            <v-btn
              class="ml-2"
              density="compact"
              icon="mdi-gender-male"
              :color="bird.gender === 'male' ? 'themeDarkGreenColor' : 'white'"
              @click="setGender('male', bird)"
            />
            <v-btn
              class="ml-2"
              density="compact"
              icon="mdi-gender-female"
              :color="bird.gender === 'female' ? 'themeDarkGreenColor' : 'white'"
              @click="setGender('female', bird)"
            />
          </td>
        </tr>
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
import {computed, ref, watch} from "vue";
import {format} from "date-fns";

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
const expanded = ref([])

const birdsFromCurrentObservation = computed(() => {
  return Object.entries(currentObservationListItem.value.observedBirds.reduce((acc, { id }) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {})).map( ([k,v]) => ({id: parseInt(k,10), count:v}));
})

function setGender(gender, bird) {
  // const selectedBird = currentObservationListItem.value.observedBirds.find((observedBird) => bird.customId === observedBird.customId).gender = gender
  const selectedBird = currentObservationListItem.value.observedBirds.find((observedBird) => bird.customId === observedBird.customId)
  if (selectedBird.gender === gender) {
    delete selectedBird.gender
  } else {
    selectedBird.gender = gender
  }
  updateBirdsListFromCurrentObservation(currentObservationListItem.value)
}

const getHoursAndMinutes = (date) => {
  return format(new Date(date), 'HH:mm')
}

const getBirdInformationById = (id) => {
  return currentObservationListItem.value.observedBirds.filter((bird) => {
    return bird.id === id
  }).sort((a, b) => {
    return new Date(a.date) < new Date(b.date) ? 1 : -1
  })
}

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
      currentObservationListItem.value.observedBirds.push({id: id, date: format(new Date(), "yyyy-MM-dd'T'HH:mm"), customId: crypto.randomUUID()})
      updateBirdsListFromCurrentObservation(currentObservationListItem.value)
      selectedBird.value = null
    }
  }
)

</script>
