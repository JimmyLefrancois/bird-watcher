<template>
  <v-form
    @submit.prevent="submitObservation"
    class="mt-3"
  >
    <TypeSortie
      :scope="validationScope"
      @set-type-sortie="observation.type = $event"
    />
    <ChoosePlaceOrLocation
      :observation="observation"
      @update-existing-location="observation.existingLocation = $event"
      @update-location="observation.location = $event"
      :scope="validationScope"
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
import {ref, watch} from 'vue';
import {format} from 'date-fns'
import {useObservationsStore} from "@/store/observations";
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";
import {useSnackbarStore} from "@/store/snackbar";
import TypeSortie from "@/components/Forms/TypeSortie.vue";
import ChoosePlaceOrLocation from "@/components/Forms/ChoosePlaceOrLocation.vue";
import {useVuelidate} from "@vuelidate/core";

const observationStore = useObservationsStore()
const {errorSnackbar} = useSnackbarStore()
const userStore = useUsersStore();
const {addObservation} = observationStore
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

const rules = {}

if (currentUser.value) {
  observation.value.user = currentUser.value.uid
}

const v$ = useVuelidate(rules, observation, { $scope: validationScope })

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
  () => currentUser.value,
  (value) => {
    observation.value.user = value.uid
  }
)

</script>

