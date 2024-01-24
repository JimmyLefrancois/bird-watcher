<template>
  <v-card-title class="font-weight-regular pb-0">
    <v-row justify="space-between">
      <v-col cols="10">
        <span style="font-size: 16px">
          <LocationName
            :observation="observation"
            :display-icon="false"
          /> |
        </span>
        <span
          style="font-size: 14px;"
          class="text-grey-darken-1"
        >
          {{ observation.observedBirds.length }} espèce<span v-if="observation.observedBirds.length > 1">s</span>
        </span>
      </v-col>
      <v-col cols="2">
        <RemoveObservation
          :observation-loader="observationLoader"
          @remove-observation="deleteObservation(observation)"
          mode="condensed"
        />
      </v-col>
    </v-row>
  </v-card-title>
  <v-card-subtitle style="font-size: 11px;">
    Du {{ format(observation.startDate, 'dd/MM/yyy HH:mm') }} au {{ format(observation.endDate, 'dd/MM/yyy HH:mm') }}
  </v-card-subtitle>
  <v-card-actions class="py-0">
    <v-btn
      color="themeDarkGreenColor"
      @click="router.push({ name: 'observation', params: { observation: observation.id } })"
      size="small"
      prepend-icon="mdi-eye"
    >
      Consulter
    </v-btn>
    <v-btn
      color="themeDarkGreenColor"
      @click="router.push({ name: 'modifier-mon-observation', params: { observation: observation.id } })"
      size="small"
      prepend-icon="mdi-pencil"
    >
      Modifier
    </v-btn>
  </v-card-actions>
  <v-card-actions class="py-0">
    <v-btn
      color="themeDarkGreenColor"
      variant="text"
      size="small"
      @click="show = !show"
    >
      Voir les espèces observées
    </v-btn>

    <v-spacer />

    <v-btn
      :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      @click="show = !show"
    />
  </v-card-actions>
  <v-expand-transition>
    <div v-show="show">
      <v-divider />
      <v-card-text class="pt-2 pb-0">
        <ul style="list-style-type: none">
          <li
            v-for="(observedBird, indexObservedBird) in observation.observedBirds"
            :key="indexObservedBird"
            class="mb-1"
          >
            {{ findBird(observedBird.id).text }} -
            <span
              class="text-grey-darken-1"
              style="font-size: 13px;"
            >{{ observedBird.count }} individu<span v-if="observedBird.count > 1">s</span></span>
          </li>
        </ul>
        <template v-if="observation.commentaire">
          <v-divider class="pt-2" />
          <p class="font-weight-bold">
            Commentaire :
          </p>
          <p>{{ observation.commentaire }}</p>
        </template>
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
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbar";
import LocationName from "@/components/LocationName.vue";
const store = useObservationsStore()
const { removeObservation } = store
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const observationLoader = ref(false)

defineProps({
  observation: {type: Object, default: null}
})

async function deleteObservation(observation) {
  observationLoader.value = true
  try {
    await removeObservation(observation)
    updateSnackbar({
      type: 'success',
      text: 'Votre observation a bien été supprimé.'
    })
  } catch (error) {
    errorSnackbar()
  }
  observationLoader.value = false
}

</script>

<style scoped>
.v-card-actions {
  min-height: 35px !important;
}

.v-btn--icon.v-btn--density-default {
  height: auto;
}
</style>
