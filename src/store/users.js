import {defineStore} from "pinia";
import {auth} from '@/conf/firebase'
import {ref} from "vue";
import { deleteUser } from "firebase/auth";
import { useSnackbarStore } from "@/store/snackbar";

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
  const {updateSnackbar, errorSnackbar} = useSnackbarStore()

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
      updateSnackbar({
        type: 'success',
        text: 'Vous avez correctement été déconnecté.'
      })
      router.push({'name': 'connexion'})
    }).catch(() => {
      errorSnackbar()
    });
  }

  function loginWithEmail(user) {
    userLoader.value = true
    signInWithEmailAndPassword(auth, user.email, user.password).then(() => {
      userLoader.value = false
      updateSnackbar({
        type: 'success',
        text: 'Vous êtes désormais connecté.'
      })
      router.push({'name': 'accueil'})
    }).catch(() => {
      errorSnackbar()
    })
  }

  function loginAsAnonymous() {
    userLoader.value = true
    signInAnonymously(auth).then(() => {
      userLoader.value = false
      updateSnackbar({
        type: 'success',
        text: 'Vous êtes désormais connecté en tant qu\'anonyme.'
      })
      router.push({'name': 'accueil'})
    }).catch(() => {
      errorSnackbar()
    })
  }

  function createAccount(user) {
    userLoader.value = true
    if (currentUser.value && currentUser.value.isAnonymous) {
      linkAnonymousAccountToCreatedAccount(user.email, user.password)
    } else {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          userLoader.value = false
          currentUser.value = userCredential.user
          userKey.value = userCredential.user.uid + userCredential.user.isAnonymous
          updateSnackbar({
            type: 'success',
            text: 'Votre compte a bien été créé et vous êtes désormais connecté.'
          })
          router.push({name: 'accueil'})
        })
        .catch(() => {
          errorSnackbar()
        });
    }
  }

  function removeAccount() {
    const user = auth.currentUser
    deleteUser(user).then(() => {
    }).catch(() => {
      errorSnackbar()
    });
  }

  function linkAnonymousAccountToCreatedAccount(email, password) {
    const credential = EmailAuthProvider.credential(email, password)
    linkWithCredential(auth.currentUser, credential)
      .then((userCredential) => {
        userLoader.value = false
        currentUser.value = userCredential.user
        userKey.value = userCredential.user.uid + userCredential.user.isAnonymous
        updateSnackbar({
          type: 'success',
          text: 'Votre compte a bien été créé et vous êtes désormais connecté.'
        })
        router.push({name: 'accueil'})
      }).catch(() => { 
      errorSnackbar()
    });
  }

  return {
    currentUser, loginWithEmail, loginAsAnonymous, fetchUser, createAccount, logout, userLoader, userKey, removeAccount
  }
})
