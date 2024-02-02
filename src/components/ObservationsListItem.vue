<template>
  <v-card-title
    class="font-weight-regular pb-0 pt-0 mb-2"
    style="background-color: #6C733D"
  >
    <v-row justify="space-between">
      <v-col cols="10">
        <span
          style="font-size: 16px"
          class="text-white"
        >
          <LocationName
            :observation="observation"
            :display-icon="false"
            :key="observation.id"
          />
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
  <v-card-subtitle
    style="font-size: 14px; opacity: 1"
  >
    <p class="mb-1">
      <LocationType
        :observation="observation"
        :key="observation.id"
      /> |
      <span
        style="font-size: 14px;"
        class="text-grey-darken-1"
      >
        {{ birdsFromObservation.length }} espèce<span v-if="birdsFromObservation.length > 1">s</span>
      </span>
    </p>
    <p>Du {{ format(observation.startDate, 'dd/MM/yyy HH:mm') }} au {{ format(observation.endDate, 'dd/MM/yyy HH:mm') }}</p>
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
            v-for="(observedBird, indexObservedBird) in birdsFromObservation"
            :key="indexObservedBird"
            class="mb-1"
          >
            {{ findBirdInBirdsList(observedBird.id).text }} -
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
import {findBirdInBirdsList} from "@/helpers/birdHelpers"
import { format } from "date-fns";
import { useObservationsStore } from "@/store/observations";
import RemoveObservation from "@/components/Dialogs/RemoveObservation.vue";
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbar";
import LocationName from "@/components/LocationName.vue";
import LocationType from "@/components/LocationType.vue";
const store = useObservationsStore()
const { removeObservation, getBirdsFromObservation } = store
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const observationLoader = ref(false)

const props = defineProps({
  observation: {type: Object, default: null}
})

const birdsFromObservation = getBirdsFromObservation(props.observation)

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
