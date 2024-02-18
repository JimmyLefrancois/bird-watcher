<template>
  <v-list-item class="py-0">
    <v-list-item-subtitle>
      Observé à {{ getHoursAndMinutes(bird.date) }} | Sexe : {{ getGender() }}
      <span v-if="bird.commentaire"> | Commentaire : {{ bird.commentaire }}</span>
    </v-list-item-subtitle>
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
