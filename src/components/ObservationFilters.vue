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
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            color="themeDarkGreenColor"
            @click="setFilters(isActive)"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import {birdsList} from '@/conf/birds.js'
import {computed, ref} from "vue";

const selectedBirds = ref([])
const locationFilter = ref('')

const activeFilters = computed(() => {
  let count = 0
  if (selectedBirds.value.length > 0) {
    count++
  }
  if (locationFilter.value !== '') {
    count++
  }

  return count
})

const emit = defineEmits(['updateFilters'])
defineProps({
  observationLoader: {type: Object, default: null}
})

function setFilters(isActive) {
  isActive.value = false
  emit('updateFilters', {selectedBirds, locationFilter})
}
</script>

<style scoped>

</style>
