<template>
  <v-card
    class="mt-3"
    v-for="(observation, index) in endedObservations"
    :key="index"
  >
    <ObservationsListItem :observation="observation" />
  </v-card>
  <template v-if="endedObservations && endedObservations.length === 0">
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
