<template>
  <h1>Statistiques des Observations</h1>
  <TimelineCharts :observations="endedObservations" />
  <table>
    <thead>
      <tr>
        <th>Oiseau</th>
        <th>Nombre d'Observations</th>
        <th>Lien</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(stat, bird) in birdStatistics"
        :key="bird"
      >
        <td>{{ stat.name }}</td>
        <td>{{ stat.count }}</td>
        <td>
          <a
            :href="stat.link"
            target="_blank"
          >Voir</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import {useObservationsStore} from "@/store/observations";
import {storeToRefs} from "pinia";
import {computed} from "vue";
import {birdsList} from "@/conf/birds";
import TimelineCharts from "@/components/Stats/TimelineCharts.vue";

const observationStore = useObservationsStore()
const {endedObservations} = storeToRefs(observationStore)

console.log(endedObservations.value)

const birdStatistics = computed(() => {
  const stats = {};
  if (endedObservations.value) {
    endedObservations.value.forEach((observation) => {
      observation.observedBirds.forEach((bird => {
        const birdFromList = birdsList.find((b) => b.value === bird.id);
        if (birdFromList) {
          if (!stats[bird.id]) {
            stats[bird.id] = {count: 0, name: birdFromList.text, link: birdFromList.link};
          }
          stats[bird.id].count++;
        }
      }))
    })
  }
  return stats;
})

</script>
