import {defineStore, storeToRefs} from 'pinia'
import {computed, ref} from "vue"
import { collection,query, where, addDoc, doc, updateDoc, deleteDoc} from 'firebase/firestore'
import { useUsersStore } from "@/store/users";
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { db } from '@/conf/firebase'
import {useStorage} from "@vueuse/core";
import { format } from 'date-fns'
import router from "@/router";
import { useSnackbarStore } from "@/store/snackbar";

export const useObservationsStore = defineStore('observations', () => {

  const userStore = useUsersStore()
  const { currentUser } = storeToRefs(userStore)
  const currentObservation = useStorage('currentObservation', null)
  const editingObservation = useStorage('editingObservation', null)
  const userObservationsQuery = computed(() => currentUser.value && query(collection(db, 'observations'), where("user", "==", currentUser.value.uid)))
  const observationsList = useFirestore(userObservationsQuery, null)
  const currentObservationQuery = computed(() => currentObservation.value && doc(db, 'observations', currentObservation.value))
  const currentObservationListItem = useFirestore(currentObservationQuery, null)
  const currentEditingObservationQuery = computed(() => editingObservation.value && doc(db, 'observations', editingObservation.value))
  const currentEditingObservationListItem = useFirestore(currentEditingObservationQuery, null)
  const observationLoader = ref(false)
  const {updateSnackbar, errorSnackbar} = useSnackbarStore()

  const endedObservations = computed(() => observationsList.value && observationsList.value.filter((observation) => {
    return observation.endDate !== null
  }))

  async function addObservation(observation) {
    observationLoader.value = true
    await addDoc(collection(db, 'observations'), observation).then((data) => {
      currentObservation.value = data.id
      observationLoader.value = false
    }).catch(() => {
      errorSnackbar()
      observationLoader.value = false
    })
  }

  async function updateBirdsListFromCurrentObservation(observation) {
    observationLoader.value = true
    await updateDoc(currentObservationQuery.value, {observedBirds: observation.observedBirds}).then(() => {
      observationLoader.value = false
    }).catch(() => {
      observationLoader.value = false
    })
  }

  function clearCurrentObservation() {
    currentObservation.value = null
  }

  async function endObservation() {
    observationLoader.value = true
    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    await updateDoc(currentObservationQuery.value, {endDate: date}).then(() => {
      observationLoader.value = false
      updateSnackbar({
        type: 'success',
        text: 'Votre observation a bien été enregistrée.'
      })
    }).catch(() => {
      observationLoader.value = false
      errorSnackbar()
    })
    await router.push({name: 'mes-observations'})
    clearCurrentObservation()
  }

  async function editObservation() {
    observationLoader.value = true
    currentEditingObservationListItem.value.updatedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm")
    await updateDoc(currentEditingObservationQuery.value, currentEditingObservationListItem.value).then(() => {
      observationLoader.value = false
      updateSnackbar({
        type: 'success',
        text: 'Votre observation a bien été modifié.'
      })
      editingObservation.value = null
    }).catch(() => {
      observationLoader.value = false
      errorSnackbar()
    })
    await router.push({name: 'mes-observations'})
  }

  async function removeObservation(observation) {
    observationLoader.value = true
    await deleteDoc(doc(db, "observations", observation.id)).then(() => {
      observationLoader.value = false
      updateSnackbar({
        type: 'success',
        text: 'Votre observation a bien été supprimé.'
      })
    }).catch(() => {
      observationLoader.value = false
      errorSnackbar()
    });
  }

  return {
    observationLoader,
    editObservation,
    endObservation,
    currentObservation,
    editingObservation,
    endedObservations,
    currentObservationListItem,
    currentEditingObservationListItem,
    observationsList,
    addObservation,
    updateBirdsListFromCurrentObservation,
    removeObservation
  }
})
