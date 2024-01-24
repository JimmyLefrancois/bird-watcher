<template>
  <v-row>
    <v-col>
      <v-autocomplete
        v-if="type === 1 && observationsPlacesList"
        variant="solo-filled"
        v-model="localObservation.existingLocation"
        :items="observationsPlacesList"
        :clearable="true"
        item-value="id"
        item-title="name"
        no-data-text="Aucun lieu enregistré."
        label="Lieu d'observation"
        @update:model-value="updateExistingLocation"
      />
    </v-col>
  </v-row>
  <v-text-field
    v-if="type === 2"
    v-model="localObservation.location"
    label="Lieu"
    variant="solo-filled"
    @update:model-value="updateLocation"
  />
</template>
<script setup>
import {useObservationsPlacesStore} from "@/store/places";
import {storeToRefs} from "pinia";
import {ref, watch} from "vue";
const observationsPlacesStore = useObservationsPlacesStore()
const {observationsPlacesList} = storeToRefs(observationsPlacesStore)

const props = defineProps({
  type: {
    type: Number,
    default: null
  },
})

const localObservation = ref({
  existingLocation: null,
  location: null
})

const emits = defineEmits(['updateExistingLocation', 'updateLocation'])

function updateLocation() {
  emits('updateLocation', localObservation.value.location)
}

function updateExistingLocation() {
  emits('updateExistingLocation', localObservation.value.existingLocation)
}

watch(
  () => props.type,
  (value) => {
    if (value === 1) {
      localObservation.value.existingLocation = null
      emits('updateLocation', null)
    } else {
      localObservation.value.location = null
      emits('updateExistingLocation', null)
    }
  }
)


</script>
