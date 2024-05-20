<template>
  <v-list-item class="py-0">
    <p
      style="color: #5e5c5c"
      class="mb-1"
    >
      Observé à {{ getHoursAndMinutes(bird.date) }} | Sexe : {{ getGender() }}
    </p>
    <p
      v-if="bird.commentaire"
      style="font-weight: 500 !important;"
      class="mb-0"
    >
      {{ bird.commentaire }}
    </p>
  </v-list-item>
</template>

<script setup>
import {format} from "date-fns";

const props = defineProps({
  bird: {type: Object, default: null}
})

const getGender = () => {
  if (!props.bird.gender) {
    return 'N/C'
  }
  return props.bird.gender === 'male' ? 'Mâle' : 'Femelle'
}

const getHoursAndMinutes = (date) => {
  return format(new Date(date), 'HH:mm')
}
</script>

<style scoped>

</style>
