<template>
  <p
    class="text-decoration-underline text-center dp__pointer mt-3"
    @click="router.push({name: 'mes-observations'})"
  >
    Retour à la liste de mes observations
  </p>
  <v-card
    class="mt-3"
    v-if="observationToShowItem"
  >
    <v-card-title style="color:#6C733D;">
      Résumé de votre observation
    </v-card-title>
    <v-card-text>
      <div style="height:600px; width:800px">
        <l-map
          ref="map"
          zoom="2"
          :center="[47.41322, -1.219482]"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
        </l-map>
      </div>
      <p class="d-flex align-center">
        <v-icon
          class="pr-2"
          color="themeLightgreenColor"
          icon="mdi-map-marker"
        />
        Lieu :
        <LocationName
          :observation="observationToShowItem"
          :display-icon="false"
        />
      </p>
      <p class="d-flex align-center">
        <v-icon
          class="pr-2"
          color="themeLightgreenColor"
          icon="mdi-binoculars"
        />
        Type :
        <LocationType
          :observation="observationToShowItem"
        />
      </p>
      <p class="d-flex align-center">
        <v-icon
          class="pr-2"
          color="themeLightgreenColor"
          icon="mdi-calendar"
        />
        {{ format(observationToShowItem.startDate, 'dd/MM/yyy HH:mm') }} au
        {{ format(observationToShowItem.endDate, 'dd/MM/yyy HH:mm') }}
      </p>
      <h3 class="mt-5 d-flex align-center">
        Oiseau{{ showPlurial('x') }} observé{{ showPlurial('s') }} ({{ observedBirds.length }}
        espèce{{ showPlurial('s') }})
        <v-btn
          :icon="displayDetails ? 'mdi-eye' : 'mdi-eye-off'"
          variant="text"
          :ripple="false"
          @click="expand = !expand"
        />
      </h3>
      <v-list class="pt-1">
        <v-list-item
          v-for="(bird, index) in sortedBirds"
          :key="index"
          class="pa-0"
        >
          <p class="mb-2">
            <span
              class="font-weight-bold"
              style="color: #5e5c5c"
            >{{ findBirdInBirdsList(bird.id).text }}</span> |
            <span
              class="text-grey-darken-1"
              style="font-size: 13px;"
            >{{ bird.count }} individu<span v-if="bird.count > 1">s</span></span>
          </p>
          <v-scroll-x-transition>
            <v-list
              class="py-0"
              v-show="expand"
            >
              <ShowBirdDetails
                v-for="(detailBird, detailIndex) in getBirdInformationById(bird.id, observationToShowItem)"
                :key="detailIndex"
                :bird="detailBird"
              />
            </v-list>
          </v-scroll-x-transition>
        </v-list-item>
      </v-list>
      <template v-if="observationToShowItem.commentaire">
        <h3 class="mt-2 pb-1">
          Commentaire
        </h3>
        <p>{{ observationToShowItem.commentaire }}</p>
      </template>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        color="themeDarkGreenColor"
        @click="router.push({ name: 'modifier-mon-observation', params: { observation: observationToShowItem.id } })"
        size="small"
        prepend-icon="mdi-pencil"
      >
        Modifier
      </v-btn>
      <RemoveObservation
        :observation-loader="observationLoader"
        mode="full"
        @remove-observation="deleteObservation(observationToShowItem)"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import {format} from 'date-fns'
import {findBirdInBirdsList} from "@/helpers/birdHelpers";
import router from "@/router";
import RemoveObservation from "@/components/Dialogs/RemoveObservation.vue";
import {useSnackbarStore} from "@/store/snackbar";
import {computed, ref} from "vue";
import LocationName from "@/components/LocationName.vue";
import LocationType from "@/components/LocationType.vue";
import ShowBirdDetails from "@/components/Show/ShowBirdDetails.vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const observationLoader = ref(false)
const observationStore = useObservationsStore()
const {removeObservation, getBirdsFromObservation, getBirdInformationById} = observationStore
const {observationToShowItem} = storeToRefs(observationStore)
const displayDetails = ref(true)
const expand = ref(false)
const zoom = ref(2)

const observedBirds = computed(() => {
  if (observationToShowItem.value) {
    return getBirdsFromObservation(observationToShowItem.value)
  }
  return null
})

const sortedBirds = computed(() => {
  if (observedBirds.value) {
    const birds = observedBirds.value
    return birds.sort((a, b) => {
      return findBirdInBirdsList(a.id).text > findBirdInBirdsList(b.id).text ? 1 : -1
    })
  } else {
    return []
  }
})

const showPlurial = (plurialLetter) => observedBirds.value.length > 1 ? plurialLetter : ''

async function deleteObservation(observation) {
  observationLoader.value = true
  try {
    await removeObservation(observation)
    updateSnackbar({
      type: 'success',
      text: 'Votre observation a bien été supprimée.'
    })
    await router.push({name: 'mes-observations'})
  } catch (error) {
    errorSnackbar()
  }
  observationLoader.value = false
}

</script>

<style>
p {
  font-size: 14px;
  margin-bottom: 10px;
}

h3 {
  color: #6C733D;
}

.v-list-item--density-default.v-list-item--one-line {
  min-height: 30px;
}
</style>
