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
        <v-btn v-if="currentUser && !currentUser.isAnonymous" @click="logout" density="compact"
               icon="mdi-logout"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        location="left"
      >
        <v-list
          :nav="true"
          density="compact"
        >
          <v-list-subheader>Mes observation ornitho</v-list-subheader>
          <v-list-item @click="drawer = false" :link="true" title="Accueil" :to="{'name': 'Accueil'}"
                       prepend-icon="mdi-home"></v-list-item>
          <v-list-item @click="drawer = false" :link="true" title="Nouvelle observation"
                       :to="{'name': 'Nouvelle observation'}" prepend-icon="mdi-plus"></v-list-item>
          <v-list-item @click="drawer = false" :link="true" title="Mes observations" :to="{'name': 'Mes observations'}"
                       prepend-icon="mdi-format-list-bulleted"></v-list-item>
          <v-list-subheader>Mon compte</v-list-subheader>
          <template v-if="!currentUser || currentUser.isAnonymous">
            <v-list-item @click="drawer = false" :link="true" title="Me connecter" :to="{'name': 'Connexion'}"
                         prepend-icon="mdi-account"></v-list-item>
            <v-list-item @click="drawer = false" :link="true" title="Créer mon compte"
                         :to="{'name': 'Créer mon compte'}" prepend-icon="mdi-account-plus"></v-list-item>
          </template>
          <template v-else>
            <v-list-item :link="true" title="Me déconnecter" @click="logout" prepend-icon="mdi-logout"></v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-spacer/>
      <AnonymousInformations/>
    </v-container>
  </v-app>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import router from "@/router"
import {useUsersStore} from "@/store/users";
import {storeToRefs} from "pinia";
import {auth} from './conf/firebase'
import {signOut} from 'firebase/auth'
import AnonymousInformations from "@/AnonymousInformations";

const userStore = useUsersStore()
const {currentUser} = storeToRefs(userStore)
const drawer = ref(false)

const store = useUsersStore()
const {fetchUser} = store

onBeforeMount(() => {
  fetchUser()
})

function logout() {
  signOut(auth).then(() => {
    //todo snackbar
    // Sign-out successful.
  }).catch((error) => {
    //todo snackbar
    // An error happened.
  });
}

</script>
