<template>
  <div v-if="currentObservationListItem">
    <h3
        class="py-3 text-center"
        style="color: #37474f">
      <v-icon icon="mdi-map"></v-icon>
      {{ currentObservationListItem.location }}
    </h3>
    <EndObservation @endObservation="finaliseObservation"/>
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
  </div>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import {ref, watch} from "vue";
import BirdItemRow from "@/components/BirdItemRow";
import EndObservation from "@/components/EndObservation";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import router from "@/router";

const observationStore = useObservationsStore()
const {updateBirdsListFromCurrentObservation, endObservation} = observationStore
const { currentObservationListItem } = storeToRefs(observationStore)
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)

function finaliseObservation()
{
  endObservation()
  router.push({name: 'Mes observations'})
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

const headers = ref([{title: 'Nom', key: 'name'}, {title: 'Nombre et compte', key: 'number'}])

watch(
  () => selectedBird.value,
  (id) => {
    if (id !== null) {
      //todo trouver plus propre
      document.activeElement.blur();
      const existingBird = currentObservationListItem.value.observedBirds.find(bird => bird.id === id)
      if (existingBird) {
        existingBird.count++
      } else {
        currentObservationListItem.value.observedBirds.push({id: id, count: 1})
      }
      updateBirdsListFromCurrentObservation(currentObservationListItem.value)
    }
  }
)

</script>
