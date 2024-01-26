<template>
  <v-row>
    <v-col>
      <v-autocomplete
        v-if="type === 1 && observationsPlacesList"
        variant="solo-filled"
        v-model="existingLocationFilter"
        :items="observationsPlacesList"
        :clearable="true"
        item-value="id"
        :hide-details="true"
        item-title="name"
        no-data-text="Aucun lieu enregistré."
        label="Lieu d'observation"
        class="mb-3"
      />
    </v-col>
  </v-row>
  <v-text-field
    v-if="type === 2"
    v-model="location"
    label="Lieu"
    :hide-details="true"
    variant="solo-filled"
    class="mb-3"
  />
</template>
<script setup>
import {useObservationsPlacesStore} from "@/store/places";
import {storeToRefs} from "pinia";
import {watch} from "vue";
const observationsPlacesStore = useObservationsPlacesStore()
const {observationsPlacesList} = storeToRefs(observationsPlacesStore)

const props = defineProps({
  type: {
    type: Number,
    default: null
  },
})

const location = defineModel('location', { required: false, type: String })
const existingLocationFilter = defineModel('existingLocationFilter', { required: false, type: String })

watch(
  () => props.type,
  (value) => {
    if (value === 1) {
      location.value = null
    } else {
      existingLocationFilter.value = null
    }
  }
)


</script>
