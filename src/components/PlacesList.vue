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
      <v-list v-if="observationsPlacesList?.length > 0">
        <PlaceListItem
          v-for="(place, index) in observationsPlacesList"
          :key="index"
          :place
        />
      </v-list>
      <p
        v-else
        class="pb-3"
      >
        Aucun lieu enregistré. Cliquez sur le bouton ci-dessous pour créer votre premier lieu d'observation.
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import PlaceListItem from "@/components/PlaceListItem"
import { useObservationsPlacesStore } from '@/store/places'
import {storeToRefs} from "pinia";
const observationsPlacesStore = useObservationsPlacesStore()
const { observationsPlacesList } = storeToRefs(observationsPlacesStore)

</script>

<style>
.v-list-item {
  min-height: auto;
}
</style>
