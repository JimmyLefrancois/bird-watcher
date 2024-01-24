<template>
  <v-dialog
    transition="dialog-bottom-transition"
    :fullscreen="true"
  >
    <template #activator="{ props }">
      <v-btn
        :block="true"
        v-bind="props"
        color="themeLightgreenColor"
        prepend-icon="mdi-filter"
        class="mt-3"
      >
        Filtrer({{ activeFilters }})
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-toolbar
          color="themeLightgreenColor"
          title="Filtrer vos observations"
        >
          <v-btn
            icon="mdi-close"
            @click="isActive.value = false"
          />
        </v-toolbar>
        <v-card-text>
          <p
            class="text-decoration-underline text-center dp__pointer"
            @click="resetFilters()"
          >
            <v-icon
              class="mr-1"
              icon="mdi-filter-off"
            />
            Réinitialiser les filtres
          </p>
          <TypeSortieFilter @set-type-sortie="typeFilter = $event" />
          <PlaceOrLocationFilter
            v-if="typeFilter !== null"
            :type="typeFilter"
            :key="typeFilter"
          />
          <v-autocomplete
            variant="solo-filled"
            :items="filteredBirdsList"
            item-value="value"
            item-title="text"
            class="mt-3 mb-3"
            label="Filtrer par oiseaux observés"
            v-model="selectedBirds"
            :clearable="true"
            :multiple="true"
            hide-details
            @click:clear="blur"
          />
          <!--          <v-text-field-->
          <!--            variant="solo-filled"-->
          <!--            v-model="locationFilter"-->
          <!--            label="Filtrer par lieu d'observation"-->
          <!--            :clearable="true"-->
          <!--            hide-details-->
          <!--            class="mt-0"-->
          <!--            @click:clear="blur"-->
          <!--          />-->
          <v-btn
            color="themeDarkGreenColor"
            @click="setFilters(isActive)"
            :block="true"
            class="mt-3"
          >
            Valider
          </v-btn>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import {computed, ref} from "vue";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
import TypeSortieFilter from "@/components/Filters/TypeSortieFilter.vue";
import PlaceOrLocationFilter from "@/components/Filters/PlaceOrLocationFilter.vue";

const observationStore = useObservationsStore()
const { observationsList } = storeToRefs(observationStore)
const selectedBirds = ref([])
const locationFilter = ref(null)
const typeFilter = ref(null)

const filteredBirdsList = computed(() => {
  if (observationsList.value) {
    let observedBirdsFromAllMyObservations = []

    observationsList.value.forEach((observation) => {
      observation.observedBirds.forEach((bird => {
        observedBirdsFromAllMyObservations.push(bird.id)
      }))
    })

    return birdsList.filter((bird) => {
      return observedBirdsFromAllMyObservations.includes(bird.value)
    })
  } else {
    return []
  }
})

const activeFilters = computed(() => {
  let count = 0
  if (selectedBirds.value.length > 0) {
    count++
  }
  if (locationFilter.value) {
    count++
  }

  return count
})

function resetFilters() {
  selectedBirds.value = []
  locationFilter.value = null
}

const emit = defineEmits(['updateFilters'])
defineProps({
  observationLoader: {type: Object, default: null}
})

function setFilters(isActive) {
  isActive.value = false
  emit('updateFilters', {selectedBirds, locationFilter, typeFilter})
}
</script>

<style scoped>

</style>
