<template>
  <div
    v-if="needRefresh"
    class="buttons flex align-middle mt-2"
  >
    <v-snackbar>
      Une nouvelle version de Plumes en vue est disponible.
    </v-snackbar>
    <v-alert
      class="py-4"
      border="top"
      prominent
      style="font-size: 13px;"
      color="themeGreyColor"
    >
      Une nouvelle version de Plumes en vue est disponible.
      <v-btn
        class="pa-0"
        variant="text"
        size="small"
        @click="updateServiceWorker()"
      >
        Actualiser
      </v-btn>
    </v-alert>
  </div>
</template>

<script setup>
import {useRegisterSW} from "virtual:pwa-register/vue";

const {needRefresh, updateServiceWorker} = useRegisterSW();

</script>

<style scoped>

</style>
