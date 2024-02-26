<template>
  <v-list-item class="py-0">
    <v-list-item-subtitle style="-webkit-line-clamp: none">
      <p>Observé à {{ getHoursAndMinutes(bird.date) }} | Sexe : {{ getGender() }}</p>
      <p
        v-if="bird.commentaire"
        class="font-weight-bold"
      >
        Commentaire : {{ bird.commentaire }}
      </p>
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
