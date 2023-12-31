import {defineStore} from "pinia";
import { auth } from '@/conf/firebase'
import {ref} from "vue";
import {signInAnonymously} from "firebase/auth";

export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)

  function fetchUser() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        console.log(user.uid)
        currentUser.value=user
      } else {
        signInAnonymously(auth)
      }
    })
  }

  return {
    currentUser,
    fetchUser
  }
})
