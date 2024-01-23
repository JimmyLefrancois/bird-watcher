<template>
  <v-form
    @submit.prevent="submitObservation"
    class="mt-3"
  >
    <v-btn-toggle
      elevation="1"
      style="width: 100%"
      class="mb-3"
      color="themeLightgreenColor"
      :divided="true"
      mandatory
      :error-messages="v$.type.$errors.map(e => e.$message)"
      @blur="v$.type.$touch()"
      v-model="observation.type"
    >
      <v-btn
        :value="1"
        width="50%"
      >
        <v-icon>
          mdi-home
        </v-icon>
        <span>Affût</span>
      </v-btn>
      <v-btn
        :value="2"
        width="50%"
      >
        <v-icon>
          mdi-walk
        </v-icon>
        <span>Billebaude</span>
      </v-btn>
    </v-btn-toggle>
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
      >
        <CreatePlaceForm
          v-if="observation.type === 1"
          mode="condensed"
          @add-place="getNewPlaceById($event)"
        />
      </v-col>
    </v-row>
    <v-text-field
      v-if="observation.type === 2"
      v-model="observation.location"
      :error-messages="v$.location.$errors.map(e => e.$message)"
      required
      label="Lieu"
      @blur="v$.location.$touch()"
      variant="solo-filled"
    />
    <v-btn
      color="themeDarkGreenColor"
      class="mt-1"
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

const observationsPlacesStore = useObservationsPlacesStore()

const observationStore = useObservationsStore()
const {addObservation} = observationStore
const {errorSnackbar} = useSnackbarStore()
const {getPlaceById} = observationsPlacesStore
const {observationsPlacesList} = storeToRefs(observationsPlacesStore)

const userStore = useUsersStore();
const {currentUser} = storeToRefs(userStore)
const observationLoader = ref(false)

const rules = computed(() => {
  const tempsRules = {
    type: {required}
  }
  if (observation.value.type === 1) {
    tempsRules.existingLocation = {required}
  } else if (observation.value.type === 2) {
    tempsRules.location = {required}
  }

  return tempsRules
})

async function getNewPlaceById(id) {
  try {
    const addedPlace = await getPlaceById(id)
    console.log(addedPlace)
    observation.value.existingLocation = addedPlace.id
  } catch (error) {
    console.log(error)
    errorSnackbar()
  }
}

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

if (currentUser.value) {
  observation.value.user = currentUser.value.uid
}

const v$ = useVuelidate(rules, observation)

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

<style>
</style>
