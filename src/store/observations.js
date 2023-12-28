import {defineStore} from 'pinia'
import {computed} from "vue"
import {useCollection, useDocument, useFirestore} from 'vuefire'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import {useStorage} from "@vueuse/core";
import {format} from "date-fns";

const db = useFirestore()

export const useObservationsStore = defineStore('observations', () => {

  const currentObservation = useStorage('currentObservation', null)

  function setCurrentObservation(idObservation) {
    currentObservation.value = idObservation
  }

  async function addObservation(observation) {
    await addDoc(collection(db, 'observations'), observation.value).then((data) => {
      setCurrentObservation(data.id)
    })
  }

  function clearCurrentObservationItem() {
    currentObservation.value = null
  }

  async function updateBirdsListFromCurrentObservation(observation) {
    await updateDoc(currentObservationRef.value, {observedBirds: observation.observedBirds})
  }

  async function endObservation() {
    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    await updateDoc(currentObservationRef.value, {endDate: date}).then(() => {
      clearCurrentObservationItem()
    })
  }

  const currentObservationRef = computed(() => {
    return doc(db, "observations", currentObservation.value)
  })

  const observationsList = useCollection(collection(db, 'observations'))

  const endedObservations = computed(() => {
    return observationsList.value.filter((observation) => {
      return observation.endDate !== null
    })
  })

  const currentObservationItem = computed(() => {
    return currentObservation.value
  })

  const currentObservationListItem = currentObservationItem.value ? useDocument(doc(collection(db, 'observations'), currentObservationItem.value)) : null

  return {
    observationsList,
    currentObservationItem,
    setCurrentObservation,
    addObservation,
    clearCurrentObservationItem,
    currentObservationListItem,
    endedObservations,
    updateBirdsListFromCurrentObservation,
    endObservation
  }
})
