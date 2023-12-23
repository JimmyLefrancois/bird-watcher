import {defineStore} from 'pinia'
import {computed} from "vue"
import {useStorage} from "@vueuse/core";

export const useObservationsStore = defineStore('observation', () => {

  const observations = useStorage('observations', {})
  const currentObservation = useStorage('currentObservation', null)

  function setCurrentObservation(observation) {
    currentObservation.value = observation
  }

  function addObservation(observation) {
    observations.value[observation.value.id] = observation
  }

  function clearCurrentObservationItem() {
    currentObservation.value = null
  }

  const observationsList = computed(() => {
    return observations.value
  })

  const endedObservations = computed(() => {
    return Object.values(observations.value).filter((observation) => {
      return observation.endDate !== null
    })
  })

  const currentObservationListItem = computed(() => {
    return Object.values(observationsList.value).find((observation) => {
      return observation.id === currentObservation.value
    })
  })

  const currentObservationItem = computed(() => {
    return currentObservation.value
  })

  return {
    observationsList,
    currentObservationItem,
    setCurrentObservation,
    addObservation,
    clearCurrentObservationItem,
    currentObservationListItem,
    endedObservations
  }
})
