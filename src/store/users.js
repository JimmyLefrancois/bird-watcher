import {defineStore} from "pinia";
import {auth} from '@/conf/firebase'
import {ref} from "vue";
import { deleteUser } from "firebase/auth";

import {
  EmailAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "firebase/auth";

export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)
  const userKey = ref(null)

  function fetchUser() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        currentUser.value = user
        userKey.value = currentUser.value.uid + currentUser.value.isAnonymous
      }
    })
  }

  async function logout() {
    try {
      await signOut(auth)
      currentUser.value = null
    } catch (error) {
      console.log(error)
    }
  }

  async function loginWithEmail(user) {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password)
    } catch (error) {
      console.log(error)
    }
  }

  async function loginAsAnonymous() {
    try {
      await signInAnonymously(auth)
    } catch (error) {
      console.log(error)
    }
  }

  async function createAccount(user) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
      currentUser.value = userCredential.user
      userKey.value = userCredential.user.uid + userCredential.user.isAnonymous
    } catch (error) {
      console.log(error)
    }
  }

  async function removeAccount() {
    const user = auth.currentUser
    await deleteUser(user)
  }

  async function linkAnonymousAccountToCreatedAccount(user) {
    const credential = EmailAuthProvider.credential(user.email, user.password)
    try {
      const userCredential = await linkWithCredential(auth.currentUser, credential)
      currentUser.value = userCredential.user
      userKey.value = userCredential.user.uid + userCredential.user.isAnonymous
    } catch (error) {
      console.log(error)
    }
  }

  return {
    currentUser, loginWithEmail, loginAsAnonymous, fetchUser, createAccount, logout, userKey, removeAccount, linkAnonymousAccountToCreatedAccount
  }
})
