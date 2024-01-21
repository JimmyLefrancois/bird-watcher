<template>
  <!-- todo edit place / que se passe t'il si on remove une place des observations (disable avec hint text ?), afficher le nb d'observation dans la place -->
  <!-- todo filtrer par place -->
  <PlacesList class="mt-3" />
  <CreatePlaceForm />
</template>

<script setup>
import CreatePlaceForm from "@/components/Forms/CreatePlaceForm";
import PlacesList from "@/components/PlacesList";

</script>

<style scoped>

</style>
