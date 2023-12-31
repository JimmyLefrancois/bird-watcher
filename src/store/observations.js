import {defineStore, storeToRefs} from 'pinia'
import {computed} from "vue"
import { collection,query, where, addDoc, doc, updateDoc} from 'firebase/firestore'
import { useUsersStore } from "@/store/users";
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { db } from '@/conf/firebase'
import {useStorage} from "@vueuse/core";
import { format } from 'date-fns'
import router from "@/router";

export const useObservationsStore = defineStore('observations', () => {

  const userStore = useUsersStore()
  const { currentUser } = storeToRefs(userStore)

  const currentObservation = useStorage('currentObservation', null)

  const userObservationsQuery = computed(() => currentUser.value && query(collection(db, 'observations'), where("user", "==", currentUser.value.uid)))

  const observationsList = useFirestore(userObservationsQuery, null)

  const endedObservations = computed(() => observationsList.value && observationsList.value.filter((observation) => {
    return observation.endDate !== null
  }))

  const currentObservationQuery = computed(() => currentObservation.value && doc(db, 'observations', currentObservation.value))
  const currentObservationListItem = useFirestore(currentObservationQuery, null)

  async function addObservation(observation) {
    await addDoc(collection(db, 'observations'), observation).then((data) => {
      currentObservation.value = data.id
    })
  }

  async function updateBirdsListFromCurrentObservation(observation) {
    console.log(observation)
    await updateDoc(currentObservationQuery.value, {observedBirds: observation.observedBirds})
  }

  function clearCurrentObservation() {
    currentObservation.value = null
  }

  async function endObservation() {
    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    await updateDoc(currentObservationQuery.value, {endDate: date}).then(() => {
      clearCurrentObservation()
    })
    router.push({name: 'Mes observations'})
  }

  //
  // const currentObservationRef = useFirestore(doc(db, 'observations', currentObservation.value))
  // // const currentObservationRef = computed(() => {
  // //   return doc(db, "observations", currentObservation.value)
  // // })
  // const currentObservationListItem = useFirestore(doc(db, 'observations', currentObservationRef.value))
  //
  //
  // const endedObservations = computed(async () => {
  //   return observationsList.value.filter((observation) => {
  //     return observation.endDate !== null
  //   })
  // })
  //
  // async function endObservation() {
  //   const date = format(new Date(), "yyyy-MM-dd'T'HH:mm")
  //   await updateDoc(currentObservationRef, {endDate: date}).then(() => {
  //     clearCurrentObservationItem()
  //   })
  // }
  //
  // function clearCurrentObservationItem() {
  //   currentObservation.value = null
  // }


  return {
    endObservation,
    clearCurrentObservation,
    currentObservation,
    endedObservations,
    currentObservationListItem,
    observationsList,
    addObservation,
    updateBirdsListFromCurrentObservation
  }
  //
  // const currentObservationListItem = ref(null)
  // function setCurrentObservationListItem(observation) {
  //   currentObservationListItem.value = observation
  // }
  // // const currentObservationListItem = currentObservationItem.value ? useDocument(doc(collection(db, 'observations'), currentObservationItem.value)) : null
  //
  // return {
  //   observationsList,
  //   currentObservationItem,
  //   setCurrentObservation,
  //   addObservation,
  //   clearCurrentObservationItem,
  //   currentObservationListItem,
  //   endedObservations,
  //   updateBirdsListFromCurrentObservation,
  //   endObservation
  // }
})
