<template>
  <v-list-item
    :value="place.id"
    class="pl-0"
    rounded="xl"
  >
    <template
      #prepend
    >
      <v-icon icon="mdi-map-marker" />
    </template>
    <v-list-item-title>{{ place.name }}</v-list-item-title>
    <template #append="{}">
      <v-list-item-action :end="true">
        <RemovePlace
          @remove-place="tryToRemovePlace(place)"
          :place-loader="placeLoader"
        />
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script setup>
import RemovePlace from "@/components/Dialogs/RemovePlace.vue"
import {ref} from "vue";
import {useSnackbarStore} from "@/store/snackbar";
import {useObservationsPlacesStore } from "@/store/places";

defineProps({
  place: {type: Object, default: null}
})

const observationPlaceStore = useObservationsPlacesStore()
const { removePlace } = observationPlaceStore
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const placeLoader = ref(false)

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
.v-list-item__prepend {
  display: inline-block !important;
}
</style>
