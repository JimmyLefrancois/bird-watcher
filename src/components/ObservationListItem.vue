<template>
  <v-card :title="observation.location" subtitle="Subtitle" text="...">
    <v-card-actions>
      <v-btn>Click me</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  observation: Object
})
</script>
