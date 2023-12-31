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
        <v-btn v-if="loggedUser && !loggedUser.isAnonymous" @click="logout" density="compact" icon="mdi-logout"></v-btn>
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
          <v-list-item @click="drawer = false" :link="true" title="Accueil" :to="{'name': 'Accueil'}" prepend-icon="mdi-home"></v-list-item>
          <v-list-item @click="drawer = false" :link="true" title="Nouvelle observation" :to="{'name': 'Nouvelle observation'}"  prepend-icon="mdi-plus"></v-list-item>
          <v-list-item @click="drawer = false" :link="true" title="Mes observations" :to="{'name': 'Mes observations'}"  prepend-icon="mdi-format-list-bulleted"></v-list-item>
          <v-list-subheader>Mon compte</v-list-subheader>
          <template v-if="!loggedUser || loggedUser.isAnonymous" >
            <v-list-item @click="drawer = false" :link="true" title="Me connecter" :to="{'name': 'Connexion'}" prepend-icon="mdi-account"></v-list-item>
            <v-list-item @click="drawer = false" :link="true" title="Créer mon compte" :to="{'name': 'Créer mon compte'}" prepend-icon="mdi-account-plus"></v-list-item>
          </template>
          <template v-else>
            <v-list-item :link="true" title="Me déconnecter" @click="logout" prepend-icon="mdi-logout"></v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-spacer />
      <v-row justify="center" align="center" class="mt-10">
        <v-col cols="12">
          <v-dialog
            v-if="loggedUser && loggedUser.isAnonymous === true"
            transition="dialog-top-transition"
            width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-alert
                :closable="true"
                class="mt-2"
                variant="tonal"
              >
                Vous êtes connecté en tant qu'anonyme.<br />
                <p v-bind="props" class="text-decoration-underline" style="cursor: pointer">En savoir +</p>

              </v-alert>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title>Compte anonyme.</v-card-title>
                <v-card-text>
                  <p></p>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    variant="text"
                    @click="isActive.value = false"
                  >J'ai compris</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
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
  import { auth } from './conf/firebase'
  import { signOut } from 'firebase/auth'
  const userStore = useUsersStore()
  const { loggedUser } = storeToRefs(userStore)
  const drawer = ref(false)

  const store = useUsersStore()
  const { fetchUser } = store

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
