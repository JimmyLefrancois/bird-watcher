<template>
  {{ observation.type === 1 ? 'Affût' : 'Promenade' }}
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
