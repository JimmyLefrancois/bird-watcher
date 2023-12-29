<template>
  <v-card class="mt-3">
    <v-card-title>Informations de connexion</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="logUser" class="mt-3">
        <v-text-field
          v-model="user.email"
          :error-messages="v$.email.$errors.length > 0 ? v$.email.$errors[0].$message :''"
          required
          label="Adresse e-mail"
          prepend-inner-icon="mdi-email-outline"
          hide-details="auto"
          @blur="v$.email.$touch()"
        />
        <v-text-field
          class="mt-3"
          v-model="user.password"
          :error-messages="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message :''"
          prepend-inner-icon="mdi-lock-outline"
          :required="true"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          counter
          label="Mot de passe"
          hide-details="auto"
          @blur="v$.password.$touch()"
          @click:append="showPassword = !showPassword"
        />
        <v-btn
          class="mt-3"
          :block="true"
          size="large"
          @click="logUser"
        >
          Me connecter
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {required, minLength, email} from "@vuelidate/validators"
import {ref} from 'vue'
import {useVuelidate} from "@vuelidate/core";
import { useUsersStore } from "@/store/users";


const showPassword = ref(false)
const user = ref({email: 'jimmylefrancois38@gmail.com', password: 'XXX'})
const userStore = useUsersStore()
const { login } = userStore

const rules = {
  email: {required, email},
  password: {required, minLengthValue: minLength(13)},
}

const v$ = useVuelidate(rules, user.value)

function logUser() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    login(user.value)
  }
}
</script>
