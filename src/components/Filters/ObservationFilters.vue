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
        Filtres ({{ activeFilters }})
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
          <div class="mb-3">
            <TypeSortieFilter v-model="typeFilter" />
          </div>
          <div
            class="mt-3"
            v-if="typeFilter"
          >
            <PlaceOrLocationFilter
              :type="typeFilter"
              v-model:location="locationFilter"
              v-model:existingLocationFilter="existingLocationFilter"
            />
          </div>
          <v-autocomplete
            variant="solo-filled"
            :items="filteredBirdsList"
            item-value="value"
            item-title="text"
            class="mb-3"
            label="Filtrer par oiseaux observés"
            v-model="selectedBirds"
            :clearable="true"
            :multiple="true"
            hide-details
            @click:clear="blur"
          />
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
const existingLocationFilter = ref(null)

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
  if (typeFilter.value) {
    count++
  }
  if (existingLocationFilter.value) {
    count++
  }

  return count
})

function resetFilters() {
  selectedBirds.value = []
  locationFilter.value = null
  typeFilter.value = null
  existingLocationFilter.value = null
}

const emit = defineEmits(['updateFilters'])
defineProps({
  observationLoader: {type: Object, default: null}
})

function setFilters(isActive) {
  isActive.value = false
  emit('updateFilters', {selectedBirds, locationFilter, typeFilter, existingLocationFilter})
}
</script>
