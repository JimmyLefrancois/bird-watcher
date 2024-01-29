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
      <p>
        <v-icon
          color="themeLightgreenColor"
          icon="mdi-map-marker"
        />
        Lieu :
        <LocationName
          :observation="observationToShowItem"
          :display-icon="false"
        />
      </p>
      <p>
        <v-icon
          color="themeLightgreenColor"
          icon="mdi-binoculars"
        />
        Type :
        <LocationType
          :observation="observationToShowItem"
        />
      </p>
      <p>
        <v-icon
          color="themeLightgreenColor"
          icon="mdi-calendar"
        />
        {{ format(observationToShowItem.startDate, 'dd/MM/yyy HH:mm') }} au
        {{ format(observationToShowItem.endDate, 'dd/MM/yyy HH:mm') }}
      </p>
      <h3 class="mt-5 mb-1">
        Oiseau{{ showPlurial('x') }} observé{{ showPlurial('s') }} ({{ observationToShowItem.observedBirds.length }}
        espèce{{ showPlurial('s') }})
      </h3>
      <v-list class="pt-0">
        <v-list-item
          v-for="(bird, index) in sortedBirds"
          :key="index"
          class="pa-0"
        >
          {{ findBird(bird.id).text }} |
          <span
            class="text-grey-darken-1"
            style="font-size: 13px;"
          >{{ bird.count }} individu<span v-if="bird.count > 1">s</span></span>
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
import {findBird} from "@/helpers/birdHelpers";
import router from "@/router";
import RemoveObservation from "@/components/Dialogs/RemoveObservation.vue";
import {useSnackbarStore} from "@/store/snackbar";
import {computed, ref} from "vue";
import LocationName from "@/components/LocationName.vue";
import LocationType from "@/components/LocationType.vue";

const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const observationLoader = ref(false)

const observationStore = useObservationsStore()
const {removeObservation} = observationStore
const {observationToShowItem} = storeToRefs(observationStore)

const sortedBirds = computed(() => {
  const observedBirds = observationToShowItem.value.observedBirds
  return observedBirds.sort((a, b) => {
    return findBird(a.id).text > findBird(b.id).text ? 1 : -1
  })
})

const showPlurial = (plurialLetter) => observationToShowItem.value.observedBirds.length > 1 ? plurialLetter : ''

async function deleteObservation(observation) {
  observationLoader.value = true
  try {
    await removeObservation(observation)
    updateSnackbar({
      type: 'success',
      text: 'Votre observation a bien été supprimé.'
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
