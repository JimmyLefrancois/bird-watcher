<template>
  <v-card-title class="font-weight-regular pb-0">
    <span style="font-size: 16px">
      {{ observation.location }} | </span>
    <span style="font-size: 14px;" class="text-grey-darken-1">
      {{ observation.observedBirds.length }} espèce<span v-if="observation.observedBirds.length > 1">s</span>
    </span>
  </v-card-title>
  <v-card-subtitle style="font-size: 11px;">
    Du {{ format(observation.startDate, 'dd/MM/yyy HH:mm') }} au {{ format(observation.endDate, 'dd/MM/yyy HH:mm') }}
  </v-card-subtitle>
  <v-card-actions class="py-0">
<!--   <v-btn color="themeDarkGreenColor" size="small" prepend-icon="mdi-pencil">Modifier</v-btn>-->
    <RemoveObservation @removeObservation="removeObservation(observation)"/>
  </v-card-actions>
  <v-card-actions class="py-0">
    <v-btn
      color="themeDarkGreenColor"
      variant="text"
      size="small"
      @click="show = !show"
    >
      Voir les espèces
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn
      :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      @click="show = !show"
    ></v-btn>
  </v-card-actions>
  <v-expand-transition>
    <div v-show="show">
      <v-divider></v-divider>
      <v-card-text>
        <ul style="list-style-type: none">
          <li v-for="(observedBird, indexObservedBird) in observation.observedBirds" :key="indexObservedBird" class="mb-1">
            {{ findBird(observedBird.id).text }} - <span class="text-grey-darken-1" style="font-size: 13px;">{{ observedBird.count }} individu<span v-if="observedBird.count > 1">s</span></span>
          </li>
        </ul>
      </v-card-text>
    </div>
  </v-expand-transition>
</template>

<script setup>
import { ref } from 'vue'
const show = ref(false)
import {findBird} from "@/helpers/birdHelpers"
import { format } from "date-fns";
import { useObservationsStore } from "@/store/observations";
import RemoveObservation from "@/components/RemoveObservation";
const store = useObservationsStore()
const { removeObservation } = store

defineProps({
  observation: Object
})

</script>

<style scoped>
.v-card-actions {
  min-height: 35px !important;
}

.v-btn--icon.v-btn--density-default {
  height: auto;
}
</style>
