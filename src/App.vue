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
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        location="left"
      >
        <v-list
          :nav="true"
          density="compact"
        >
          <v-list-subheader>Plumes en vue</v-list-subheader>
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
          <v-list-item
            @click="drawer = false"
            title="Mes lieux d'observations"
            :to="{'name': 'mes-lieux-d-observation'}"
            prepend-icon="mdi-map-marker-multiple"
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
              @click="logoutUser"
              prepend-icon="mdi-logout"
            />
            <v-list-item>
              <v-switch
                color="primary"
                v-model="geolocationUsed"
                label="Géolocalisation"
                hide-details
                @update:model-value="changePermission"
              />
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-spacer />

      <v-row
        justify="center"
        align="center"
        class="mt-10"
      >
        <v-col
          sm="12"
          md="6"
        >
          <ReloadPWa />
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
import {useGeolocationStore} from "@/store/geolocation";
import {storeToRefs} from "pinia";
import AnonymousInformations from "@/views/AnonymousInformations";
import BaseSnackbar from "@/components/BaseSnackbar";
import {useSnackbarStore} from "@/store/snackbar";
import ReloadPWa from "@/components/ReloadPWa.vue";

const geolocationStore = useGeolocationStore()
const { isUsingGeolocation } = storeToRefs(geolocationStore)
const { watchPosition, stopWatching } = geolocationStore
const geolocationUsed = isUsingGeolocation

const userStore = useUsersStore()
const {currentUser, userKey} = storeToRefs(userStore)
const drawer = ref(false)

const store = useUsersStore()
const {fetchUser, logout} = store
const {updateSnackbar, errorSnackbar} = useSnackbarStore()

function changePermission(value) {
  if (value) {
    watchPosition()
  } else {
    stopWatching()
  }
}

async function logoutUser() {
  try {
    await router.push({'name': 'connexion'})
    await logout()
    updateSnackbar({
      type: 'success',
      text: 'Vous avez correctement été déconnecté.'
    })
  } catch (error) {
    errorSnackbar()
  }
}

onBeforeMount(() => {
  fetchUser()
})

</script>
