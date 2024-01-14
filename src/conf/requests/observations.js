import {addDoc, collection, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "@/conf/firebase";

export async function addObservationRequest(observation) {
  return await addDoc(collection(db, 'observations'), observation)
}

export async function updateBirdsListFromCurrentObservationRequest(currentObservationQuery, observation) {
  await updateDoc(currentObservationQuery, {observedBirds: observation.observedBirds})
}

export async function endObservationRequest(currentObservationQuery, date) {
  await updateDoc(currentObservationQuery, {endDate: date})
}

export async function addCommentaireToCurrentObservationRequest(currentObservationQuery, commentaire) {
  await updateDoc(currentObservationQuery, {commentaire: commentaire})
}

export async function editObservationRequest(currentEditingObservationQuery, currentEditingObservationListItem) {
  await updateDoc(currentEditingObservationQuery, currentEditingObservationListItem)
}

export async function removeObservationRequest(observation) {
  await deleteDoc(doc(db, "observations", observation.id))
}
