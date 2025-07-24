<template>
  <div></div>
</template>

<script setup>
import {birdsList} from "@/conf/birds";
import {computed} from "vue";

const props = defineProps({
  observations: {
    type: Array,
    required: true
  }
})

const groupedObservations = computed(() => {
  if (!props.observations || !Array.isArray(props.observations)) {
    return {};
  }

  return props.observations.reduce((acc, obs) => {
    const date = new Date(obs.startDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Les mois commencent à 0

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];

    obs.observedBirds.forEach((bird) => {
      const birdFromList = birdsList.find(b => b.value === bird.id);

      acc[year][month].push({
        ...obs,
        birdName: birdFromList ? birdFromList.text : "Oiseau inconnu",
      });
    });

    return acc;
  }, {});
});

console.log(groupedObservations);
</script>
