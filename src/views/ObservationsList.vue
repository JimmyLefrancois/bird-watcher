<template>
  <v-autocomplete
    variant="solo-filled"
    :items="birdsList"
    item-value="value"
    item-title="text"
    class="mt-3 mb-3"
    label="Filtrer par oiseau"
    v-model="selectedBirds"
    :clearable="true"
    :multiple="true"
    hide-details
    @click:clear="blur"
  />
  <v-text-field
    variant="solo-filled"
    v-model="locationFilter"
    label="Filtrer par lieu"
    :clearable="true"
    hide-details
    class="mt-0"
    @click:clear="blur"
  />
  <hr class="mt-3">
  <template v-if="filteredObservations && filteredObservations.length > 0">
    <v-card
      class="mt-3"
      v-for="(observation, index) in filteredObservations"
      :key="index"
    >
      <ObservationsListItem :observation="observation" />
    </v-card>
  </template>
  <template v-if="filteredObservations && filteredObservations.length === 0">
    <p class="text-center mt-3">
      Aucune observation à afficher.
    </p>
    <v-btn
      :block="true"
      :to="{name: 'nouvelle-observation'}"
      prepend-icon="mdi-plus"
      color="themeLightgreenColor"
      class="mt-3"
    >
      Nouvelle observation
    </v-btn>
  </template>
</template>

<script setup>
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import ObservationsListItem from "@/components/ObservationsListItem";
const observationStore = useObservationsStore()
const { endedObservations } = storeToRefs(observationStore)
import {birdsList} from '@/conf/birds.js'
import {computed} from "vue";
import { ref } from 'vue'

const selectedBirds = ref([])
const locationFilter = ref('')

const filteredObservations = computed(() => {
  let filteredResults = endedObservations.value
  if (selectedBirds.value.length > 0) {
    filteredResults = getObservationsFilteredByBirds()
  }
  if (locationFilter.value && locationFilter.value !== '') {
    filteredResults = getObservationsFilteredByLocation()
  }
  return filteredResults
})

function getObservationsFilteredByBirds()
{
  return endedObservations.value.filter((observation) => {
    //todo 1er ligne, contient au moins une valeur, ligne 2 contient toutes les valeur, faire les deux via les filtres ?
    // return selectedBirds.value.some(elem => observation.observedBirds.some(item => item.id === elem));
    return selectedBirds.value.every(elem => observation.observedBirds.some(item => item.id === elem));
  })
}

function getObservationsFilteredByLocation()
{
  return endedObservations.value.filter(observation => observation.location.toLowerCase().indexOf(locationFilter.value.toLowerCase()) >= 0);
}

function blur()
{
  document.activeElement.blur();
}

</script>

<style scoped>
.v-list {
  padding: 0;
}
.v-list-item--active.v-list-group__header {
  border-bottom: 1px black solid;
}

.v-list-group__items .v-list-item {
  padding-right: 16px !important;
}

.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding-inline: 16px !important;
}
</style>
