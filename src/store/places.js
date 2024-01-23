import {defineStore, storeToRefs} from "pinia";
import {useUsersStore} from "@/store/users";
import {useObservationsStore} from "@/store/observations";
import {computed} from "vue";
import {collection, doc, query, where} from "firebase/firestore";
import {db} from "@/conf/firebase";
import {useFirestore} from "@vueuse/firebase/useFirestore";
import {addPlaceRequest, removePlaceRequest} from "@/conf/requests/places";

export const useObservationsPlacesStore = defineStore('places', () => {
  const userStore = useUsersStore()
  const { currentUser } = storeToRefs(userStore)

  const observationStore = useObservationsStore()
  const { currentObservationListItem } = storeToRefs(observationStore)
  const placeFromObservationQuery = computed(() => currentObservationListItem.value && doc(db, 'places', currentObservationListItem.value.existingLocation))
  const placeFromObservationItem = useFirestore(placeFromObservationQuery, null)

  const userObservationsPlacesQuery = computed(() => currentUser.value && query(collection(db, 'places'), where("user", "==", currentUser.value.uid)))
  const observationsPlacesList = useFirestore(userObservationsPlacesQuery, null)

  async function addObservationPlace(place) {
    try {
      return await addPlaceRequest(place)
    } catch (error) {
      console.log(error)
    }
  }

  async function getPlaceById(id) {
    try {
      return doc(db, 'places', id)
    } catch (error) {
      console.log(error)
    }
  }

  async function removePlace(place) {
    try {
      await removePlaceRequest(place)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    observationsPlacesList,
    addObservationPlace,
    removePlace,
    getPlaceById,
    placeFromObservationItem
  }
})
