<template>
  <v-dialog

    transition="dialog-top-transition"
    width="auto"
    :fullscreen="true"
  >
    <template #activator="{ props }">
      <v-alert
        class="mt-2"
        variant="tonal"
      >
        Vous êtes connecté en tant qu'invité.<br>
        <p
          v-bind="props"
          class="text-decoration-underline"
          style="cursor: pointer"
        >
          En savoir +
        </p>
      </v-alert>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-card-title style="color: #6C733D">
          <v-icon
            class="mr-2"
            icon="mdi-incognito"
          />
          Votre compte invité.
        </v-card-title>
        <v-card-text>
          <p>
            Nous sommes ravis de vous compter parmi nos utilisateurs ! <br> <br>
            Actuellement, vous utilisez notre application en tant qu'invité, ce qui vous permet de profiter
            pleinement de toutes les fonctionnalités disponibles.
          </p>
          <br>
          <p>
            Cependant, pour assurer la sauvegarde et la conservation de vos données existantes, nous vous recommandons
            de créer un compte utilisateur.<br> <br> Toutes les informations que vous avez
            déjà enregistrées seront conservées.
          </p>
          <br>
          <p>
            Créer un compte ne prend que quelques instants et vous permettra de retrouver vos données sur différents
            appareils.
          </p>
          <v-btn
            @click="isActive.value = false"
            color="#9DA65D"
            class="mt-3"
            :block="true"
            :to="{name: 'creer-mon-compte'}"
            prepend-icon="mdi-account-plus"
          >
            Créer mon compte
          </v-btn>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="#6C733D"
            variant="text"
            @click="isActive.value = false"
          >
            Continuer en anonyme
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup>

</script>

<style>
.v-overlay__content {
  width: 100% !important;
}
</style>
