<template>
  <h3 class="py-2 text-center"><v-icon icon="mdi-map"></v-icon>{{ currentObservationListItem.location }}</h3>
  <EndObservation @endObservation="endObservation"/>
  <v-dialog
    v-model="displayBirdRemoveDialog"
    width="auto"
  >
    <v-card title="Retirer une espèce">
      <v-card-text>
        Souhaitez-vous retirer cette espèce de vos observation ?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red"
          prepend-icon="mdi-cancel"
          @click="displayBirdRemoveDialog = false"
        >Annuler
        </v-btn>
        <v-btn
          color="green"
          prepend-icon="mdi-check"
          @click="removeBirdFormList"
        >Supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-autocomplete
    variant="solo-filled"
    :items="birdsList"
    item-value="value"
    item-title="text"
    class="mt-5"
    label="Chercher un oiseau"
    v-model="selectedBird"
  >
  </v-autocomplete>
  <v-data-table
    :headers="headers"
    :items="currentObservationListItem.observedBirds"
    no-data-text="Aucun oiseau observé."
  >
    <template v-slot:item="{ item }">
      <BirdItemRow :bird="item" @removeBird="tryToRemoveBirdFromList($event)"/>
    </template>
    <template v-slot:bottom>
    </template>
  </v-data-table>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import {ref, watch} from "vue";
import BirdItemRow from "@/components/BirdItemRow";
import EndObservation from "@/components/EndObservation";
import {format} from "date-fns";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";

const observationStore = useObservationsStore()
const {clearCurrentObservationItem} = observationStore
const {currentObservationListItem} = storeToRefs(observationStore)
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)

function removeBirdFormList() {
  currentObservationListItem.value.observedBirds.splice(birdToRemoveIndex.value, 1)
  birdToRemoveIndex.value = null
  displayBirdRemoveDialog.value = false
}

function tryToRemoveBirdFromList(index) {
  birdToRemoveIndex.value = index
  displayBirdRemoveDialog.value = true
}

function endObservation() {
  currentObservationListItem.value.endDate = format(new Date(), "yyyy-MM-dd'T'HH:mm")
  clearCurrentObservationItem()
}

const selectedBird = ref(null)

const headers = ref([{title: 'Nom', key: 'name'}, {title: 'Nombre et compte', key: 'number'}])

watch(
  () => selectedBird.value,
  (id) => {
    if (id !== null) {
      const existingBird = currentObservationListItem.value.observedBirds.find(bird => bird.id === id)
      if (existingBird) {
        existingBird.count++
      } else {
        currentObservationListItem.value.observedBirds.push({id: id, count: 1})
      }
    }
  }
)

</script>
