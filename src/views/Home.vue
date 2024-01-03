<template>
  <router-link
    :to="{name: 'nouvelle-observation'}"
    class="text-decoration-none"
  >
    <v-card
      class="mt-3"
      elevation="3"
    >
      <v-img
        src="/add-background.jpg"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.01), rgba(0,0,0,.1)"
        height="150px"
        :cover="true"
      >
        <v-card-title class="text-white align-center justify-center">
          Nouvelle observation
        </v-card-title>
      </v-img>
    </v-card>
  </router-link>
  <router-link
    :to="{name: 'mes-observations'}"
    class="text-decoration-none"
  >
    <v-card
      class="mt-3"
      elevation="3"
    >
      <v-img
        src="/add-background.jpg"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.01), rgba(0,0,0,.1)"
        height="150px"
        :cover="true"
      >
        <v-card-title class="text-white align-center justify-center">
          Mes observations
        </v-card-title>
      </v-img>
    </v-card>
  </router-link>
</template>

<script setup>
</script>

<style scoped>
.v-card-title {
  background-color: rgba(0, 0, 0, 0.30) !important;
}
</style>
