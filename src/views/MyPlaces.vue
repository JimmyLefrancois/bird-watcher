<template>
  <!-- todo edit place / que se passe t'il si on remove une place des observations, afficher le nb d'observation dans la place -->
  <!-- todo Ajouter deux bouton à la creation d'une observation, observation fixe ou mobile, si fixe choisir le lieu -->
  <!-- todo Ajouter un bool au observation sur la valeur fixe ou mobile de l'observation-->
  <PlacesList class="mt-3" />
  <CreatePlaceForm />
</template>

<script setup>
import CreatePlaceForm from "@/components/Forms/CreatePlaceForm";
import PlacesList from "@/components/PlacesList";

</script>

<style scoped>

</style>
