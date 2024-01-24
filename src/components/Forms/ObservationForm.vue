<template>
  <v-form
    @submit.prevent="submitObservation"
    class="mt-3"
  >
    <TypeSortie
      :scope="validationScope"
      @set-type-sortie="observation.type = $event"
    />
    <v-row>
      <v-col cols="10">
        <v-autocomplete
          v-if="observation.type === 1 && observationsPlacesList"
          variant="solo-filled"
          :error-messages="v$.existingLocation.$errors.map(e => e.$message)"
          v-model="observation.existingLocation"
          :items="observationsPlacesList"
          :clearable="true"
          item-value="id"
          item-title="name"
          no-data-text="Aucun lieu enregistré."
          label="Lieu d'observation"
          @blur="v$.existingLocation.$touch()"
        />
      </v-col>
      <v-col
        cols="2"
        class="pl-0 pt-5"
        v-if="observation.type === 1"
      >
        <CreatePlaceForm
          mode="condensed"
          @add-place="getNewPlaceById($event)"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-if="observation.type === 2"
      v-model="observation.location"
      :error-messages="v$.location.$errors.map(e => e.$message)"
      label="Lieu"
      @blur="v$.location.$touch()"
      variant="solo-filled"
    />
    <v-btn
      color="themeDarkGreenColor"
      :block="true"
      type="submit"
      :loading="observationLoader"
      :disabled="observationLoader"
    >
      Créer Observation
    </v-btn>
  </v-form>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {format} from 'date-fns'
import {useObservationsStore} from "@/store/observations";
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";
import {useSnackbarStore} from "@/store/snackbar";
import {useObservationsPlacesStore} from '@/store/places'
import CreatePlaceForm from "@/components/Forms/CreatePlaceForm";
import TypeSortie from "@/components/Forms/TypeSortie.vue";

const observationsPlacesStore = useObservationsPlacesStore()
const observationStore = useObservationsStore()
const {errorSnackbar} = useSnackbarStore()
const userStore = useUsersStore();
const {addObservation} = observationStore
const {getPlaceById} = observationsPlacesStore
const {observationsPlacesList} = storeToRefs(observationsPlacesStore)
const {currentUser} = storeToRefs(userStore)
const observationLoader = ref(false)
const validationScope = 'observationScope'

const observation = ref({
  id: null,
  startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  endDate: null,
  location: null,
  existingLocation: null,
  type: null,
  commentaire: '',
  observedBirds: [],
})

const rules = computed(() => {
  const tempsRules = {}
  if (observation.value.type === 1) {
    tempsRules.existingLocation = {required}
  } else if (observation.value.type === 2) {
    tempsRules.location = {required}
  }

  return tempsRules
})

const v$ = useVuelidate(rules, observation, { $scope: validationScope })

async function getNewPlaceById(id) {
  try {
    const addedPlace = await getPlaceById(id)
    observation.value.existingLocation = addedPlace.id
  } catch (error) {
    console.log(error)
    errorSnackbar()
  }
}

if (currentUser.value) {
  observation.value.user = currentUser.value.uid
}

const submitObservation = async () => {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    observationLoader.value = true
    try {
      await addObservation(observation.value)
      observationLoader.value = false
    } catch (error) {
      errorSnackbar()
    }
    observationLoader.value = false
  }
}

watch(
  () => observation.value.type,
  (value) => {
    if (value === 1) {
      observation.value.existingLocation = null
    } else {
      observation.value.location = null
    }
    v$.value.$reset()
  }
)

watch(
  () => currentUser.value,
  (value) => {
    observation.value.user = value.uid
  }
)

</script>

