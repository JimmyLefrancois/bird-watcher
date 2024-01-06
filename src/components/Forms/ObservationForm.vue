<template>
  <v-form
    @submit.prevent="submitObservation"
    class="mt-3"
  >
    <v-text-field
      v-model="observation.location"
      :error-messages="v$.location.$errors.length > 0 ? v$.location.$errors[0].$message :''"
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
    >
      Créer Observation
    </v-btn>
  </v-form>
</template>

<script setup>
import {ref, watch} from 'vue';
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {format} from 'date-fns'
import {useObservationsStore} from "@/store/observations";
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";

const observationStore = useObservationsStore()
const {addObservation} = observationStore

const userStore = useUsersStore();
const {currentUser} = storeToRefs(userStore)

const rules = {
  location: {required},
}

const observation = ref({
  id: null,
  startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  endDate: null,
  location: null,
  observedBirds: [],
})

if (currentUser.value) {
  observation.value.user = currentUser.value.uid
}

watch(
  () => currentUser.value,
  (value) => {
    observation.value.user = value.uid
  }
)

const v$ = useVuelidate(rules, observation.value)

const submitObservation = () => {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    addObservation(observation.value)
  }
}

</script>

<style>
</style>
