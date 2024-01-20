import {defineStore, storeToRefs} from "pinia";
import {useUsersStore} from "@/store/users";
import {computed} from "vue";
import {collection, query, where} from "firebase/firestore";
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
      await addPlaceRequest(place)
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
    removePlace
  }
})
