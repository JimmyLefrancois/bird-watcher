<template>
  <!--  <v-app :style="{background: $vuetify.theme.themes['light'].colors.themeWhiteColor}">-->
  <v-app style="background-image: url('/background.jpg');">
    <v-container :fluid="true">
      <v-app-bar
        color="themeLightgreenColor"
        prominent
      >
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        />
        <v-app-bar-title>{{ router.currentRoute.value.meta.title }}</v-app-bar-title>
        <v-btn
          v-if="currentUser"
          @click="logout"
          density="compact"
          icon="mdi-logout"
        />
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        location="left"
      >
        <v-list
          :nav="true"
          density="compact"
        >
          <v-list-subheader>Mes observations ornitho</v-list-subheader>
          <v-list-item
            @click="drawer = false"
            title="Accueil"
            :to="{'name': 'accueil'}"
            prepend-icon="mdi-home"
          />
          <v-list-item
            @click="drawer = false"
            title="Nouvelle observation"
            :to="{'name': 'nouvelle-observation'}"
            prepend-icon="mdi-plus"
          />
          <v-list-item
            @click="drawer = false"
            title="Mes observations"
            :to="{'name': 'mes-observations'}"
            prepend-icon="mdi-format-list-bulleted"
          />
          <v-list-subheader>Mon compte</v-list-subheader>
          <template v-if="!currentUser || currentUser.isAnonymous">
            <v-list-item
              @click="drawer = false"
              title="Me connecter"
              :to="{'name': 'connexion'}"
              prepend-icon="mdi-account"
            />
            <v-list-item
              @click="drawer = false"
              title="Créer mon compte"
              :to="{'name': 'creer-mon-compte'}"
              prepend-icon="mdi-account-plus"
            />
          </template>
          <template v-if="currentUser">
            <v-list-item
              title="Me déconnecter"
              @click="logout"
              prepend-icon="mdi-logout"
            />
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-spacer />

      <v-row
        justify="center"
        align="center"
        class="mt-10"
      >
        <v-col cols="12">
          <AnonymousInformations
            v-if="currentUser && currentUser.isAnonymous"
            :key="userKey"
          />
          <BaseSnackbar />
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import router from "@/router"
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";
import AnonymousInformations from "@/views/AnonymousInformations";
import BaseSnackbar from "@/components/BaseSnackbar";

const userStore = useUsersStore()
const {currentUser, userKey} = storeToRefs(userStore)
const drawer = ref(false)

const store = useUsersStore()
const {fetchUser, logout} = store

onBeforeMount(() => {
  fetchUser()
})

</script>
