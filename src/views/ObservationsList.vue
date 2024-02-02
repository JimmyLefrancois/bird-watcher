<template>
  <ObservationFilters @update-filters="updateFilters($event)" />
  <template v-if="filteredObservations && filteredObservations.length > 0">
    <v-card
      class="mt-3"
      v-for="(observation, index) in filteredObservations"
      :key="index"
    >
      <ObservationsListItem
        :observation="observation"
        :key="observation.id"
      />
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
import {computed} from "vue";
import { ref } from 'vue'
import ObservationFilters from "@/components/Filters/ObservationFilters.vue";

const observationStore = useObservationsStore()
const { endedObservations } = storeToRefs(observationStore)
const selectedBirds = ref([])
const locationFilter = ref('')
const existingLocationFilter = ref('')
const typeFilter = ref(null)

function updateFilters(filters) {
  selectedBirds.value = filters.selectedBirds.value
  locationFilter.value = filters.locationFilter.value
  existingLocationFilter.value = filters.existingLocationFilter.value
  typeFilter.value = filters.typeFilter.value
}

const filteredObservations = computed(() => {
  if (endedObservations.value) {
    return endedObservations.value.filter((observation) => {

      const result = []
      if (selectedBirds.value.length > 0) {
        result.push(getObservationsFilteredByBirds(observation))
      }
      if (locationFilter.value && locationFilter.value !== '') {
        result.push(getObservationsFilteredByLocation(observation))
      }
      if (typeFilter?.value) {
        result.push(getObservationsFilteredByType(observation))
      }
      if (existingLocationFilter.value && existingLocationFilter.value !== '') {
        result.push(getObservationsFilteredByExistingLocation(observation))
      }
      //exclusif - todo conditionner le &&
      return result.reduce((acc, current) => acc && current, true)
    }).sort((a, b) => {
      return a.startDate < b.startDate ? 1 : -1
    })
  }
  return []
})

function getObservationsFilteredByBirds(observation)
{
  return selectedBirds.value.every(elem => observation.observedBirds.some(item => item.id === elem));
}

function getObservationsFilteredByLocation(observation)
{
  return observation.location && observation.location.toLowerCase().indexOf(locationFilter.value.toLowerCase()) >= 0;
}

function getObservationsFilteredByExistingLocation(observation)
{
  return observation.existingLocation && observation.existingLocation === existingLocationFilter.value;
}
function getObservationsFilteredByType(observation)
{
  return observation.type === typeFilter.value;
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
