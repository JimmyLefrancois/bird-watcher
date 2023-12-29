import {defineStore} from "pinia";
import {ref} from 'vue'
import { auth } from '@/conf/firebase'
import {signInWithEmailAndPassword} from "firebase/auth";
import router from "@/router";

export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)

  function checkAuth() {
    auth.onAuthStateChanged((user) => {
      currentUser.value = user
    })
  }

  async function login(user) {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password).then(() => {
        //todo snackbar
        currentUser.value = auth.currentUser
        router.push({'name': 'Accueil'})
      })
    } catch (error) {
      switch(error.code) {
        //todo snackbar
        case 'auth/user-not-found':
          alert("User not found")
          break
        case 'auth/wrong-password':
          alert("Wrong password")
          break
        default:
          alert("Something went wrong")
      }
    }
  }

  return {
    currentUser,
    checkAuth,
    login
  }
})
