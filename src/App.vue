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
        <v-btn v-if="currentUser" @click="logout" density="compact"
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
          <v-list-item @click="drawer = false" value="accueil" :link="true" title="Accueil" :to="{'name': 'Accueil'}"
                       prepend-icon="mdi-home"></v-list-item>
          <v-list-item @click="drawer = false" value="nouvelle-observation" :link="true" title="Nouvelle observation"
                       :to="{'name': 'Nouvelle observation'}" prepend-icon="mdi-plus"></v-list-item>
          <v-list-item @click="drawer = false" :link="true" value="mes-observations" title="Mes observations" :to="{'name': 'Mes observations'}"
                       prepend-icon="mdi-format-list-bulleted"></v-list-item>
          <v-list-subheader>Mon compte</v-list-subheader>
          <template v-if="!currentUser || currentUser.isAnonymous">
            <v-list-item @click="drawer = false" value="connexion" :link="true" title="Me connecter" :to="{'name': 'Connexion'}"
                         prepend-icon="mdi-account"></v-list-item>
            <v-list-item @click="drawer = false" value="create" :link="true" title="Créer mon compte"
                         :to="{'name': 'Créer mon compte'}" prepend-icon="mdi-account-plus"></v-list-item>
          </template>
          <template v-if="currentUser">
            <v-list-item :link="true" title="Me déconnecter" value="logout" @click="logout" prepend-icon="mdi-logout"></v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-spacer/>

      <v-row justify="center" align="center" class="mt-10">
        <v-col cols="12">
            <AnonymousInformations  v-if="currentUser && currentUser.isAnonymous" :key="userKey"/>
          <router-view/>
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
import AnonymousInformations from "@/AnonymousInformations";

const userStore = useUsersStore()
const {currentUser, userKey} = storeToRefs(userStore)
const drawer = ref(false)

const store = useUsersStore()
const {fetchUser, logout} = store

onBeforeMount(() => {
  fetchUser()
})

</script>
