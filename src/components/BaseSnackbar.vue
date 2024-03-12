<template>
  <v-snackbar
    v-model="displayed"
    :color="type === 'success' ? '#9DA65D' : 'error'"
    @update:model-value="snackbarStore.resetSnackbar()"
  >
    {{ text }}
    <template #actions>
      <v-btn
        variant="text"
        color="white"
        @click="displayed = false"
      >
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>

import {useSnackbarStore} from '@/store/snackbar'
import {storeToRefs} from 'pinia'

const snackbarStore = useSnackbarStore()
const {
    text,
    type,
    displayed
} = storeToRefs(snackbarStore)


</script>
