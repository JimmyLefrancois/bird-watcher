<template>
<!--  <v-app :style="{background: $vuetify.theme.themes['light'].colors.themeWhiteColor}">-->
  <v-app style="background-image: url('/background.jpg');">
    <v-container :fluid="true">
      <v-app-bar
        color="themeLightgreenColor"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ router.currentRoute.value.name }}</v-app-bar-title>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        location="left"
      >
        <v-list-item title="Mes observations ornitho"></v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="(route, index) in router.getRoutes()" :key="index" :link="true" :title="route.name" :href="route.path"></v-list-item>
      </v-navigation-drawer>
      <v-row justify="center" align="center" class="mt-10">
        <v-col cols="12">
          <router-view/>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
  import {ref} from "vue";
  import router from "@/router"

  const drawer = ref(false)
</script>
