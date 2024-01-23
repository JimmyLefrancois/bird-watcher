<template>
  <v-card
    class="mx-auto"
  >
    <v-card-title
      style="color: #6C733D"
      class="pb-0"
    >
      Vos lieux d'observations
    </v-card-title>
    <v-card-text class="pb-0">
      <v-data-table
        v-if="observationsPlacesList?.length > 0"
        :items="observationsPlacesList"
        item-value="id"
        item-key="name"
        :headers="headers"
        no-data-text="Aucun lieu enregistré. Cliquez sur le bouton ci-dessous pour créer votre premier lieu d'observation."
      >
        <template #item="{ item }">
          <tr>
            <td>{{ item.name }}</td>
            <td>
              <RemovePlace
                @remove-place="tryToRemovePlace(item)"
                :place-loader="placeLoader"
              />
            </td>
          </tr>
        </template>
        <template #bottom />
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useObservationsPlacesStore } from '@/store/places'
import {storeToRefs} from "pinia";
import RemovePlace from "@/components/RemovePlace.vue";
import {ref} from "vue";
import {useSnackbarStore} from "@/store/snackbar";

const observationPlaceStore = useObservationsPlacesStore()
const { removePlace } = observationPlaceStore
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const observationsPlacesStore = useObservationsPlacesStore()
const { observationsPlacesList } = storeToRefs(observationsPlacesStore)
const placeLoader = ref(false)

const headers = [
  { title: 'Nom', align: 'start', key: 'name' },
  { title: 'Actions', align: 'start', sortable: false }
]

async function tryToRemovePlace(place) {
  placeLoader.value = true
  try {
    await removePlace(place)
    updateSnackbar({
      type: 'success',
      text: 'Le lieu a bien été supprimé.'
    })
  } catch (error) {
    errorSnackbar()
  }
  placeLoader.value = false
}

</script>

<style>
.v-list-item {
  min-height: auto;
}
</style>
