<template>
  <v-form
    @submit.prevent="updateObservation"
    v-if="currentObservationListItem"
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
      v-model="currentObservationListItem.location"
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
    <v-row>
      <v-col
        cols="12"
        class="pb-0"
      >
        <label
          for="start"
          class="pl-1"
        >Date de début :</label>
        <input
          id="start"
          type="datetime-local"
          required
          v-model="currentObservationListItem.startDate"
          @blur="v$.startDate.$touch()"
        >
      </v-col>
    </v-row>
    <v-row class="mt-3 mb-2">
      <v-col
        cols="12"
      >
        <label
          for="end"
          class="pl-1"
        >Date de fin :</label>
        <input
          id="end"
          type="datetime-local"
          required
          v-model="currentObservationListItem.endDate"
          @blur="v$.endDate.$touch()"
        >
      </v-col>
    </v-row>
    <v-autocomplete
      variant="solo-filled"
      :items="birdsList"
      item-value="value"
      item-title="text"
      :error-messages="v$.observedBirds.$errors.length > 0 ? v$.observedBirds.$errors[0].$message :''"
      @blur="v$.observedBirds.$touch()"
      label="Chercher un oiseau"
      v-model="selectedBird"
    />
    <v-data-table
      :headers="headers"
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
  </v-form>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import {ref, watch} from "vue";
import BirdItemRow from "@/components/BirdItemRow";
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import {useVuelidate} from "@vuelidate/core";
import {minLength, required} from "@vuelidate/validators";

const observationStore = useObservationsStore()
const { editObservation } = observationStore
const { currentObservationListItem, observationLoader } = storeToRefs(observationStore)
const birdToRemoveIndex = ref(null)
const displayBirdRemoveDialog = ref(false)

const rules = {
  observedBirds: {minLength: minLength(1), required},
  location: {required},
  startDate: {required},
  endDate: {required},
}

let v$ = useVuelidate(rules, currentObservationListItem.value)

function updateObservation()
{
  v$.value.$touch()
  if (!v$.value.$invalid) {
    editObservation()
  }
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

//todo On peut faire mieux ?
watch(
  () => currentObservationListItem.value,
  () => {
    v$ = useVuelidate(rules, currentObservationListItem.value)
  }
)

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
      selectedBird.value = null
    }
  }
)

</script>
