<template>
  <v-card class="mt-3">
    <v-card-title style="color: #6C733D">
      Vos identifiants
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="registerUser"
        class="mt-3"
      >
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
          :loading="userLoader"
          :disabled="userLoader"
          :block="true"
          size="large"
          color="#9DA65D"
          elevation="3"
          @click="registerUser"
        >
          Créer mon compte
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-text class="text-center pt-1">
      <router-link
        style="color: #6C733D"
        class="text-decoration-none"
        :to="{'name': 'connexion'}"
      >
        Vous avez déjà un compte ? <br> Connectez-vous dès maintenant !
      </router-link>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {required, minLength, email} from "@vuelidate/validators"
import {ref} from 'vue'
import {useVuelidate} from "@vuelidate/core"
import {useUsersStore} from "@/store/users"
import {useSnackbarStore} from "@/store/snackbar";
import router from "@/router";
import {storeToRefs} from "pinia";

const userStore = useUsersStore()
const {currentUser} = storeToRefs(userStore)
const {createAccount, linkAnonymousAccountToCreatedAccount} = userStore
const {updateSnackbar, errorSnackbar} = useSnackbarStore()

const userLoader = ref(false)
const showPassword = ref(false)
const user = ref({email: null, password: null})

const rules = {
  email: {required, email},
  password: {required, minLengthValue: minLength(13)},
}

const v$ = useVuelidate(rules, user.value)

async function registerUser() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    userLoader.value = true
    try {
      if (currentUser.value && currentUser.value.isAnonymous) {
        await linkAnonymousAccountToCreatedAccount(user.value)
      } else {
        await createAccount(user.value)
      }
      updateSnackbar({
        type: 'success',
        text: 'Votre compte a bien été créé et vous êtes désormais connecté.'
      })
      await router.push({name: 'accueil'})
    } catch (error) {
      errorSnackbar()
    }
    userLoader.value = true
  }
}
</script>
