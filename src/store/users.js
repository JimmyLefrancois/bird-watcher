import {defineStore} from "pinia";
import {auth} from '@/conf/firebase'
import {ref} from "vue";
import { useObservationsStore } from "@/store/observations";
import {
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "firebase/auth";
import router from "@/router";

export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)
  const userLoader = ref(false)
  const userKey = ref(null)

  function fetchUser() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        currentUser.value = user
        userKey.value = currentUser.value.uid + currentUser.value.isAnonymous
      }
    })
  }

  function logout() {
    signOut(auth).then(() => {
      currentUser.value = null
      router.push({'name': 'connexion'})
    }).catch((error) => {
      //todo snackbar
      console.log(error)
      // An error happened.
    });
  }

  function loginWithEmail(user) {
    userLoader.value = true
    signInWithEmailAndPassword(auth, user.email, user.password).then(() => {
      userLoader.value = false
      router.push({'name': 'accueil'})
    }).catch((error) => {
      console.log(error)
    })
  }

  function loginAsAnonymous() {
    userLoader.value = true
    signInAnonymously(auth).then(() => {
      userLoader.value = false
      router.push({'name': 'accueil'})
    }).catch((error) => {
      console.log(error)
    })
  }

  function redirecAfterCreatedAccount()
  {
    const observationStore = useObservationsStore()
    const { currentObservationListItem } = observationStore
    if (!currentObservationListItem.value) {
      router.push({name: 'accueil'})
    } else {
      if (currentObservationListItem.value.endDate) {
        router.push({name: 'modifier-mon-observation'})
      } else {
        router.push({name: 'nouvelle-observation'})
      }
    }
  }

  function createAccount(user) {
    userLoader.value = true
    if (currentUser.value && currentUser.value.isAnonymous) {
      linkAnonymousAccountToCreatedAccount(user.email, user.password)
    } else {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          //todo snackbar
          userLoader.value = false
          currentUser.value = userCredential.user
          userKey.value = userCredential.user.uid + userCredential.user.isAnonymous
          console.log(userCredential)
          redirecAfterCreatedAccount()
        })
        .catch((error) => {
          //todo snackbar
          console.log(error)
        });
    }
  }

  function linkAnonymousAccountToCreatedAccount(email, password) {
    const credential = EmailAuthProvider.credential(email, password)
    linkWithCredential(auth.currentUser, credential)
      .then((userCredential) => {
        userLoader.value = false
        currentUser.value = userCredential.user
        userKey.value = userCredential.user.uid + userCredential.user.isAnonymous
        redirecAfterCreatedAccount()
      }).catch((error) => {
      console.log("Error upgrading anonymous account", error);
    });
  }

  return {
    currentUser, loginWithEmail, loginAsAnonymous, fetchUser, createAccount, logout, userLoader, userKey
  }
})
