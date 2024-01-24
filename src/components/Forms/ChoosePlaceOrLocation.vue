<template>
  <v-row>
    <v-col :cols="creationAvailable ? 10 : 12">
      <v-autocomplete
        v-if="observation.type === 1 && observationsPlacesList"
        variant="solo-filled"
        :error-messages="v$.existingLocation.$errors.map(e => e.$message)"
        v-model="localObservation.existingLocation"
        :items="observationsPlacesList"
        :clearable="true"
        item-value="id"
        item-title="name"
        no-data-text="Aucun lieu enregistré."
        label="Lieu d'observation"
        @blur="v$.existingLocation.$touch()"
        @update:model-value="updateExistingLocation"
      />
    </v-col>
    <v-col
      cols="2"
      class="pl-0 pt-5"
      v-if="observation.type === 1 && creationAvailable"
    >
      <CreatePlaceForm
        mode="condensed"
        @add-place="getNewPlaceById($event)"
      />
    </v-col>
  </v-row>
  <v-text-field
    v-if="observation.type === 2"
    v-model="localObservation.location"
    :error-messages="v$.location.$errors.map(e => e.$message)"
    label="Lieu"
    @blur="v$.location.$touch()"
    variant="solo-filled"
    @update:model-value="updateLocation"
  />
</template>
<script setup>
import CreatePlaceForm from "@/components/Forms/CreatePlaceForm.vue";
import {useObservationsPlacesStore} from "@/store/places";
import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useSnackbarStore} from "@/store/snackbar";
const observationsPlacesStore = useObservationsPlacesStore()
const {observationsPlacesList} = storeToRefs(observationsPlacesStore)
const {getPlaceById} = observationsPlacesStore
const {errorSnackbar} = useSnackbarStore()

const props = defineProps({
  observation: {
    type: Object,
    default: null
  },
  creationAvailable: {
    type: Boolean,
    default: true
  },
  scope: {
    type: String,
    default: null
  }
})

const localObservation = ref({
  existingLocation: props.observation.existingLocation ? props.observation.existingLocation : null,
  location: props.observation.location ? props.observation.location : null
})

const emits = defineEmits(['updateExistingLocation', 'updateLocation'])

const rules = computed(() => {
  const tempsRules = {}
  if (props.observation.type === 1) {
    tempsRules.existingLocation = {required}
  } else if (props.observation.type === 2) {
    tempsRules.location = {required}
  }

  return tempsRules
})

const v$ = useVuelidate(rules, localObservation, { $scope: props.scope })

function updateLocation() {
  emits('updateLocation', localObservation.value.location)
}

function updateExistingLocation() {
  emits('updateExistingLocation', localObservation.value.existingLocation)
}

async function getNewPlaceById(id) {
  try {
    const addedPlace = await getPlaceById(id)
    localObservation.value.existingLocation = addedPlace.id
    emits('updateExistingLocation', addedPlace.id)
  } catch (error) {
    console.log(error)
    errorSnackbar()
  }
}

watch(
  () => props.observation.type,
  (value) => {
    if (value === 1) {
      localObservation.value.existingLocation = null
      emits('updateLocation', null)
    } else {
      localObservation.value.location = null
      emits('updateExistingLocation', null)
    }
    v$.value.$reset()
  }
)


</script>
