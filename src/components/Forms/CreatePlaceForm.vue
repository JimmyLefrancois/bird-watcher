<template>
  <v-dialog :fullscreen="true">
    <template #activator="{ props }">
      <v-btn
        v-if="mode === 'condensed'"
        v-bind="props"
        size="small"
        color="themeLightgreenColor"
        icon="mdi-plus"
      />
      <v-btn
        v-else
        v-bind="props"
        prepend-icon="mdi-plus"
        color="themeLightgreenColor"
        elevation="2"
        :block="true"
        :disabled="observationLoader"
        :loading="observationLoader"
        class="mt-3"
        text="Ajouter un lieu d'observation"
      />
    </template>

    <template #default="{ isActive }">
      <v-toolbar
        color="themeLightgreenColor"
        title="Nouveau lieu d'observation"
      >
        <v-btn
          icon="mdi-close"
          @click="isActive.value = false"
        />
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-form
            @submit.prevent="addPlace(isActive)"
            class="mt-3"
          >
            <v-text-field
              v-model="place.name"
              required
              @blur="v$.name.$touch()"
              :error-messages="v$.name.$errors.map(e => e.$message)"
              :hide-details="v$.name.$errors.length === 0"
              variant="solo"
              label="Nom du lieu d'observation"
            />
            <v-btn
              color="themeDarkGreenColor"
              :block="true"
              type="submit"
              class="mt-3"
              :loading="observationLoader"
              :disabled="observationLoader"
              @click="addPlace(isActive)"
            >
              Ajouter le lieu d'observation
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { format } from 'date-fns'
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {ref} from "vue";
import { useObservationsPlacesStore } from '@/store/places'
import {useSnackbarStore} from "@/store/snackbar";
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";

defineProps({
  mode: {type: String, default: 'full'}
})

const userStore = useUsersStore();
const {currentUser} = storeToRefs(userStore)

const observationsPlacesStore = useObservationsPlacesStore()
const { addObservationPlace } = observationsPlacesStore
const {updateSnackbar, errorSnackbar} = useSnackbarStore()

const observationLoader = ref(false)
const emit = defineEmits(['addPlace'])

const place = ref({
  name: null,
  createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm")
})

if (currentUser.value) {
  place.value.user = currentUser.value.uid
}

const rules = {
  name: {required},
}

let v$ = useVuelidate(rules, place)

async function addPlace(isActive) {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    observationLoader.value = true
    try {
      const addedPlace = await addObservationPlace(place.value)
      updateSnackbar({
        type: 'success',
        text: 'Votre lieu d\'observation a bien été ajouté.'
      })
      isActive.value=false
      emit('addPlace', addedPlace.id)
    } catch (error) {
      errorSnackbar()
    }
    observationLoader.value = false
  }
}

</script>

<style scoped>

</style>
