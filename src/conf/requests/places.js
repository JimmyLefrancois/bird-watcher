import {addDoc, collection, deleteDoc, doc} from "firebase/firestore";
import {db} from "@/conf/firebase";

export async function addPlaceRequest(place) {
  return await addDoc(collection(db, 'places'), place)
}

export async function removePlaceRequest(place) {
  await deleteDoc(doc(db, "places", place.id))
}
