<template>
        <v-form @submit.prevent="submitObservation" class="mt-3">
<!--          <v-text-field-->
<!--            v-model="observation.name"-->
<!--            :error-messages="v$.name.$errors.length > 0 ? v$.name.$errors[0].$message :''"-->
<!--            required-->
<!--            label="Nom de l'observation"-->
<!--            @blur="v$.name.$touch()"-->
<!--          />-->
          <v-text-field
            v-model="observation.location"
            :error-messages="v$.location.$errors.length > 0 ? v$.location.$errors[0].$message :''"
            required
            label="Lieu"
            @blur="v$.location.$touch()"
            variant="solo-filled"
          />
          <v-row>
            <v-col cols="6">
              <input
                type="datetime-local"
                required
                v-model="observation.startDate"
                @blur="v$.startDate.$touch()"
              >
            </v-col>
          </v-row>
          <v-btn
            color="themeDarkGreenColor"
            class="mt-3"
            :block="true"
            type="submit">
            Créer Observation
          </v-btn>
        </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { format } from 'date-fns'
import { useObservationsStore } from "@/store/observations";
import { useUsersStore } from "@/store/users";
import {storeToRefs} from "pinia";

const observationStore = useObservationsStore()
const userStore = useUsersStore()
const { addObservation } = observationStore
const { currentUser } = storeToRefs(userStore)

const rules = {
  startDate: { required },
  location: { required },
}

const observation = ref({
  id: null,
  startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  endDate: null,
  location: null,
  observedBirds: [],
  user: currentUser.value.uid
})

const v$ = useVuelidate(rules, observation.value)

const submitObservation = () => {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    addObservation(observation)
  }
}

</script>

<style>
</style>
