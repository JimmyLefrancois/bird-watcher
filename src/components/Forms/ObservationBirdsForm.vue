<template>
  <div v-if="currentObservationListItem">
    <h3
      class="py-3 text-center"
      style="color: #37474f"
    >
      <v-icon icon="mdi-map" />
      {{ currentObservationListItem.location }}
    </h3>
    <EndObservation @end-observation="finaliseObservation" />
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
    <v-autocomplete
      variant="solo-filled"
      :items="birdsList"
      item-value="value"
      item-title="text"
      class="mt-5"
      label="Chercher un oiseau"
      v-model="selectedBird"
    />
    <v-data-table
      :headers="headers"
      :custom-key-sort="sortBirds"
      :items="currentObservationListItem.observedBirds"
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
  </div>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import { sortBirds } from "@/helpers/birdHelpers";
import {ref, watch} from "vue";
import BirdItemRow from "@/components/BirdItemRow";
import EndObservation from "@/components/EndObservation";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import {minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";

const observationStore = useObservationsStore()
const {updateBirdsListFromCurrentObservation, endObservation} = observationStore
const { currentObservationListItem } = storeToRefs(observationStore)
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)



//const rules = {
//  birds: {minLengthValue: minLength(1), required}
//}

//const v$ = useVuelidate(rules, currentObservationListItem)

function finaliseObservation()
{
  //v$.value.$touch()
  //if (!v$.value.$invalid) {
    endObservation()
  //}
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
