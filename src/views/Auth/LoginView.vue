<template>
  <v-card class="mt-3">
    <v-card-title style="color: #6C733D">
      Informations de connexion
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="logUser"
        class="mt-3"
      >
        <v-text-field
          v-model="user.email"
          :error-messages="v$.email.$errors.map(e => e.$message)"
          required
          label="Adresse e-mail"
          prepend-inner-icon="mdi-email-outline"
          hide-details="auto"
          @blur="v$.email.$touch()"
        />
        <v-text-field
          class="mt-3"
          v-model="user.password"
          :error-messages="v$.password.$errors.map(e => e.$message)"
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
          :loading="userLoader"
          :disabled="userLoader"
          :block="true"
          color="#9DA65D"
          elevation="3"
          size="large"
          @click="logUser"
        >
          Me connecter
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-text class="text-center pt-1">
      <router-link
        style="color: #9DA65D"
        class="text-decoration-none"
        :to="{'name': 'reset'}"
      >
        Mot de passe oublié ?
      </router-link>
    </v-card-text>
    <v-card-text class="text-center pt-1">
      <router-link
        style="color: #6C733D"
        class="text-decoration-none"
        :to="{'name': 'creer-mon-compte'}"
      >
        Vous n'avez pas encore de compte ? <br>
        Créez le dès maintenant !
      </router-link>
    </v-card-text>
    <v-card-text
      v-if="!currentUser"
      class="pt-1"
    >
      <v-btn
        :loading="userLoader"
        :disabled="userLoader"
        :block="true"
        @click="loginAsAnonymousUser"
        size="large"
      >
        Continuer en invité
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {required, email, helpers} from "@vuelidate/validators"
import {ref} from 'vue'
import {useVuelidate} from "@vuelidate/core";
import { useUsersStore } from "@/store/users";
import {storeToRefs} from "pinia";
import {useSnackbarStore} from "@/store/snackbar";
import router from "@/router";

const showPassword = ref(false)
const user = ref({email: null, password: null})
const userStore = useUsersStore()
const { loginWithEmail, loginAsAnonymous } = userStore
const { currentUser } = storeToRefs(userStore)
const {updateSnackbar, errorSnackbar} = useSnackbarStore()
const userLoader = ref(false)

const rules = {
  email: {
    required: helpers.withMessage('Le champ adresse e-mail est obligatoire.', required),
    email: helpers.withMessage('Le format de votre adresse e-mail est incorrect.', email)
  },
  password: {
    required: helpers.withMessage('Le champ mot de passe est obligatoire.', required)
  },
}

const v$ = useVuelidate(rules, user.value)

async function loginAsAnonymousUser() {
  userLoader.value = true
  try {
    await loginAsAnonymous()
    updateSnackbar({
      type: 'success',
      text: 'Vous êtes désormais connecté en tant qu\'invité.'
    })
    await router.push({'name': 'accueil'})
  } catch (error) {
    errorSnackbar()
  }
  userLoader.value = false
}

async function logUser() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    userLoader.value = true
    try {
      await loginWithEmail(user.value)
      updateSnackbar({
        type: 'success',
        text: 'Vous êtes désormais connecté.'
      })
      await router.push({'name': 'accueil'})
    } catch (error) {
      errorSnackbar()
    }
    userLoader.value = false
  }
}
</script>
