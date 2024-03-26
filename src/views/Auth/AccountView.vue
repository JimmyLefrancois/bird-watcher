<template>
  <v-card class="mt-3">
    <v-card-title style="color: #6C733D">
      {{ textFromMode }}
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.prevent="handleResetPassword"
        class="mt-3"
      >
        <v-text-field
          v-model="user.password"
          type="password"
          label="Nouveau mot de passe"
          :error-messages="v$.password.$errors.map(e => e.$message)"
          @blur="v$.password.$touch()"
        />
        <v-text-field
          v-model="user.confirmPassword"
          type="password"
          label="Confirmez votre nouveau mot de passe"
          :error-messages="v$.confirmPassword.$errors.map(e => e.$message)"
          @blur="v$.confirmPassword.$touch()"
        />
        <v-btn
          :loading="loader"
          :disabled="loader"
          :block="true"
          color="#9DA65D"
          elevation="3"
          size="large"
          @click="handleResetPassword"
        >
          {{ textFromMode }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import router from "@/router";
import {computed, ref} from "vue";
import {auth} from '@/conf/firebase'
import {verifyPasswordResetCode, confirmPasswordReset, signInWithEmailAndPassword} from "firebase/auth";
import {useSnackbarStore} from "@/store/snackbar";
import {useVuelidate} from "@vuelidate/core";
import {helpers, minLength, required, sameAs} from "@vuelidate/validators";

const mode = router.currentRoute.value.query.mode
const actionCode = router.currentRoute.value.query.oobCode
const {updateSnackbar, errorSnackbar} = useSnackbarStore()

const user = ref({password: null, confirmPassword: null})
const accountEmail = ref(null)
const loader = ref(false)

const rules = {
  password: {
    required: helpers.withMessage('Ce champs est obligatoire.', required),
    minLengthValue: helpers.withMessage('13 caractères minimum', minLength(13))
  },
  confirmPassword: {
    required: helpers.withMessage('Ce champs est obligatoire.', required),
    sameAs: helpers.withMessage('Les deux mots de passe ne correspondent pas.', sameAs(computed(() => user.value.password)))
  }
}

const v$ = useVuelidate(rules, user.value)

const textFromMode = computed(() => {
  if (mode === 'resetPassword') {
    return 'Réinitialer votre mot de passe'
  }
  return ''
})

switch (mode) {
  case 'resetPassword':
    verifyPasswordResetCode(auth, actionCode).then((email) => {
      accountEmail.value = email;
    })
    break;
  default:
  // Error: invalid mode.
}

async function handleResetPassword() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    loader.value = true
    await confirmPasswordReset(auth, actionCode, user.value.password).then(async () => {
      await signInWithEmailAndPassword(auth, accountEmail.value, user.value.password).then(() => {
        updateSnackbar({
          type: 'success',
          text: 'Votre mot de passe a bien été réinialisé. Vous êtes désormais connecté.'
        })
        router.push({'name': 'accueil'})
      }).catch((error) => {
        console.log(error)
        errorSnackbar()
      });
    }).catch((error) => {
      console.log(error)
      errorSnackbar()
    });
    loader.value = false
  }
}
</script>

<style scoped>

</style>