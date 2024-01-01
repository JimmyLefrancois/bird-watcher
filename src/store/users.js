import {defineStore} from "pinia";
import {auth} from '@/conf/firebase'
import {ref} from "vue";
import {
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import router from "@/router";


export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)

  function fetchUser() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        currentUser.value = user
      }
    })
  }

  function loginWithEmail(user) {
    signInWithEmailAndPassword(user.email, user.password).catch((error) => {
      console.log(error)
    })
  }

  function loginAsAnonymous() {
    signInAnonymously(auth).then(() => {
      router.push({'name': 'Accueil'})
    }).catch((error) => {
      console.log(error)
    })
  }

  function createAccount(user) {
    if (currentUser.value && currentUser.value.isAnonymous) {
      linkAnonymousAccountToCreatedAccount(user.email, user.password)
    } else {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          //todo snackbar
          console.log(userCredential)
          router.push({name: 'Accueil'})
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
      .then((usercred) => {
        console.log("Anonymous account successfully upgraded", usercred);
        router.push({name: 'Accueil'})
      }).catch((error) => {
      console.log("Error upgrading anonymous account", error);
    });
  }

  return {
    currentUser, loginWithEmail, loginAsAnonymous, fetchUser, createAccount
  }
})
