import {defineStore, storeToRefs} from "pinia";
import {useUsersStore} from "@/store/users";
import {computed} from "vue";
import {collection, doc, query, where} from "firebase/firestore";
import {db} from "@/conf/firebase";
import {useFirestore} from "@vueuse/firebase/useFirestore";
import {addPlaceRequest, removePlaceRequest} from "@/conf/requests/places";

export const useObservationsPlacesStore = defineStore('places', () => {
  const userStore = useUsersStore()
  const { currentUser } = storeToRefs(userStore)

  const userObservationsPlacesQuery = computed(() => currentUser.value && query(collection(db, 'places'), where("user", "==", currentUser.value.uid)))
  const observationsPlacesList = useFirestore(userObservationsPlacesQuery, null)

  async function addObservationPlace(place) {
    try {
      return await addPlaceRequest(place)
    } catch (error) {
      console.log(error)
    }
  }

  function getPlaceByObservation(observation) {
    if (observation.type === 1) {
      const query = doc(db, 'places', observation.existingLocation)
      return useFirestore(query, null)
    }
    return null
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
    getPlaceByObservation,
    observationsPlacesList,
    addObservationPlace,
    removePlace,
    getPlaceById
  }
})
