<template>
  {{ observation.type === 1 ? 'Affût' : 'Billebaude' }}
</template>

<script setup>
defineProps({
  observation: {
    type: Object,
    default: null
  }
})

</script>

<style scoped>

</style>
