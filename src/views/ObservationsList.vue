<template>
  <v-card>
    <v-list>
      <v-list-group v-for="(observation, index) in Object.values(endedObservations)" :value="observation.id" :key="index">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <v-list-item-title class="mb-1">
              {{ observation.location }} | {{ observation.observedBirds.length }} espèce<span v-if="observation.observedBirds.length > 1">s</span> observée<span v-if="observation.observedBirds.length > 1">s</span>
            </v-list-item-title>
            <v-list-item-subtitle class="mb-1">
              Du {{ format(observation.startDate, 'dd/MM/yyy HH:mm') }} au {{ format(observation.endDate, 'dd/MM/yyy HH:mm') }}
            </v-list-item-subtitle>
          </v-list-item>
        </template>

        <v-list-item
          v-for="(observedBird, indexObservedBird) in observation.observedBirds"
          :key="indexObservedBird"
          :value="observedBird.id"
        >
          <v-list-item-title>
            {{ findBird(observedBird.id).text }} - <span class="text-grey-darken-1" style="font-size: 13px;">{{ observedBird.count }} observation<span v-if="observedBird.count > 1">s</span></span>
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script setup>
import {findBird} from "@/helpers/birdHelpers"
import { format } from "date-fns"
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";
const observationStore = useObservationsStore()

const { endedObservations } = storeToRefs(observationStore)

</script>

<style scoped>
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
