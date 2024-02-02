import {defineStore, storeToRefs} from 'pinia'
import {computed} from "vue"
import {collection, doc, query, where} from 'firebase/firestore'
import {useUsersStore} from "@/store/users";
import {useFirestore} from '@vueuse/firebase/useFirestore'
import {db} from '@/conf/firebase'
import {useStorage} from "@vueuse/core";
import {format} from 'date-fns'
import {
  addCommentaireToCurrentObservationRequest,
  addObservationRequest, editObservationRequest,
  endObservationRequest, removeObservationRequest,
  updateBirdsListFromCurrentObservationRequest
} from "@/conf/requests/observations";
import router from "@/router";

export const useObservationsStore = defineStore('observations', () => {

  const userStore = useUsersStore()
  const { currentUser } = storeToRefs(userStore)
  const currentObservation = useStorage('currentObservation', null)
  const editingObservation = useStorage('editingObservation', null)
  const observationToShow = useStorage('observationDisplayed', null)
  const userObservationsQuery = computed(() => currentUser.value && query(collection(db, 'observations'), where("user", "==", currentUser.value.uid)))
  const observationsList = useFirestore(userObservationsQuery, null)
  const currentObservationQuery = computed(() => currentObservation.value && doc(db, 'observations', currentObservation.value))
  const currentObservationListItem = useFirestore(currentObservationQuery, null)
  const currentEditingObservationQuery = computed(() => editingObservation.value && doc(db, 'observations', editingObservation.value))
  const currentEditingObservationListItem = useFirestore(currentEditingObservationQuery, null)
  const observationToShowQuery = computed(() => observationToShow.value && doc(db, 'observations', observationToShow.value))
  const observationToShowItem = useFirestore(observationToShowQuery, null)

  const endedObservations = computed(() => observationsList.value && observationsList.value.filter((observation) => {
    return observation.endDate !== null
  }))

  async function addObservation(observation) {
    try {
      const data = await addObservationRequest(observation)
      currentObservation.value = data.id
    } catch (error) {
      console.log(error)
    }
  }

  async function updateBirdsListFromCurrentObservation(observation) {
    try {
      await updateBirdsListFromCurrentObservationRequest(currentObservationQuery.value, observation)
    } catch (error) {
      console.log(error)
    }
  }

  function clearCurrentObservation() {
    if (currentObservationListItem.value) {
      currentObservationListItem.value = null
    }
    currentObservation.value = null
  }

  async function addCommentaireToObservation(commentaire, mode) {
    try {
      const query = mode === 'create' ? currentObservationQuery.value : currentEditingObservationQuery.value
      await addCommentaireToCurrentObservationRequest(query, commentaire)
    } catch (error) {
      console.log(error)
    }
  }

  async function endObservation() {
    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    try {
      await endObservationRequest(currentObservationQuery.value, date)
    } catch (error) {
      console.log(error)
    }
    clearCurrentObservation()
  }

  async function editObservation() {
    currentEditingObservationListItem.value.updatedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    try {
      await editObservationRequest(currentEditingObservationQuery.value, currentEditingObservationListItem.value)
      editingObservation.value = null
    } catch (error) {
      console.log(error)
    }
  }

  async function removeObservation(observation) {
    try {
      await removeObservationRequest(observation)
    } catch (error) {
      console.log(error)
    }
  }

  const currentObservationToHandle = router.currentRoute.value.name === 'nouvelle-observation' ? currentObservationListItem : currentEditingObservationListItem

  const birdsFromCurrentObservation = computed(() => {
    return Object.entries(currentObservationToHandle.value.observedBirds.reduce((acc, { id }) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {})).map( ([k,v]) => ({id: parseInt(k,10), count:v}));
  })

  return {
    editObservation,
    endObservation,
    clearCurrentObservation,
    currentObservation,
    editingObservation,
    observationToShow,
    endedObservations,
    currentObservationListItem,
    currentEditingObservationListItem,
    observationToShowItem,
    observationsList,
    addObservation,
    updateBirdsListFromCurrentObservation,
    removeObservation,
    addCommentaireToObservation,
    birdsFromCurrentObservation,
    currentObservationToHandle
  }
})
