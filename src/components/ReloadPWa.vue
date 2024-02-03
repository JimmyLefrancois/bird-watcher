<template>
  <div
    v-if="needRefresh"
    class="buttons flex align-middle mt-2"
  >
    <v-alert
      class="pt-3 pb-1"
      border="top"
      elevation="2"
      style="font-size: 14px;"
      border-color="themeDarkGreenColor"
      color="themeWhiteColor"
    >
      Une nouvelle version de Plumes en vue est disponible.
      <span
        style="font-size: 15px; color: #6C733D"
        class="font-weight-bold text-decoration-underline"
        @click="updateAndClose()"
      >Actualiser</span>
    </v-alert>
  </div>
</template>

<script setup>
import {useRegisterSW} from "virtual:pwa-register/vue";

const {needRefresh, updateServiceWorker} = useRegisterSW();

function updateAndClose() {
  updateServiceWorker();
  needRefresh.value = false;
}

</script>

<style scoped>

</style>
