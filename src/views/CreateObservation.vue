<template>
  <ObservationForm v-if="!currentObservation" />
  <ObservationBirdsForm v-else />
</template>

<script setup>
  import ObservationForm from "@/views/Forms/ObservationForm"
  import ObservationBirdsForm from "@/views/Forms/ObservationBirdsForm";
  import { useObservationsStore } from "@/store/observations";
  import {storeToRefs} from "pinia";

  const observationStore = useObservationsStore()
  const { currentObservation } = storeToRefs(observationStore)


</script>
