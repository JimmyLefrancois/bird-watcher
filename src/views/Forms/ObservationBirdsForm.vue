<template>
  <h3 class="py-2 text-center">Observations à '{{ currentObservationListItem.location }}'</h3>
  <EndObservation @endObservation="endObservation"/>
  <v-autocomplete
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
      <BirdItemRow :bird="item" @removeBird="removeBirdFormList($event)"/>
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
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";

const observationStore = useObservationsStore()
const { clearCurrentObservationItem } = observationStore
const { currentObservationListItem } = storeToRefs(observationStore)

function removeBirdFormList(index) {
  currentObservationListItem.value.observedBirds.splice(index, 1)
}

function endObservation() {
  currentObservationListItem.value.endDate = format(new Date(), "yyyy-MM-dd'T'HH:mm")
  clearCurrentObservationItem()
}

const selectedBird = ref(null)

const headers = ref([{title: 'Nom', key: 'name'}, {title: 'Nombre', key: 'number'}, {title: 'Actions', key: 'actions', sortable: false}])

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
