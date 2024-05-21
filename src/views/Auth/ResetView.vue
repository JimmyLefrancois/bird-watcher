<template>
  <div v-if="emailHasBeenSent">
    <v-banner
      color="themeLightgreenColor"
      icon="mdi-email-check"
      lines="two"
      class="align-center mt-3"
      elevation="1"
      rounded
    >
      <v-banner-text>
        Un e-mail vient de vous être envoyé afin de réinitialiser votre mot de passe.
      </v-banner-text>
    </v-banner>
    <v-btn
      class="mt-3"
      color="themeLightgreenColor"
      :to="{'name': 'accueil'}"
      :block="true"
    >
      Retour à l'accueil
    </v-btn>
  </div>
  <v-card
    class="mt-3"
    v-else
  >
    <v-card-title style="color: #6C733D">
      Votre adresse e-mail
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="resetPassword"
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
        <v-btn
          :loading="userLoader"
          :disabled="userLoader"
          :block="true"
          size="large"
          color="#9DA65D"
          elevation="3"
          @click="reset"
          class="mt-3"
        >
          Réinitialiser mon mot de passe
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
import {ref} from "vue";
import {useVuelidate} from "@vuelidate/core";
import {email, required, helpers} from "@vuelidate/validators";
import {useUsersStore} from "@/store/users";
import {useSnackbarStore} from "@/store/snackbar";

const { resetPassword } = useUsersStore()
const user = ref({email: null})
const userLoader = ref(false)
const emailHasBeenSent = ref(false)
const {updateSnackbar, errorSnackbar} = useSnackbarStore()

const rules = {
  email: {
    required: helpers.withMessage('Le champ adresse e-mail est obligatoire.', required),
    email: helpers.withMessage('Le format de votre adresse e-mail incorrect.', email)
  }
}

function reset() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    try {
      userLoader.value = true
      resetPassword(user.value.email)
      updateSnackbar({
        type: 'success',
        text: 'Un e-mail vous a été envoyé pour réinitialiser votre mot de passe.'
      })
      emailHasBeenSent.value = true
    } catch (error) {
      errorSnackbar()
    }
    userLoader.value = false
  }
}

const v$ = useVuelidate(rules, user.value)

</script>

<style scoped>

</style>
