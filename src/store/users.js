import {defineStore} from "pinia";
import {computed} from "vue";
import {ref} from 'vue'
import { auth } from '@/conf/firebase'
import {signInWithEmailAndPassword} from "firebase/auth";
import router from "@/router";

export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)

  const loggedUser = computed(() => {
    return currentUser.value
  })

  function checkAuth() {
    auth.onAuthStateChanged((user) => {
      currentUser.value = user
    })
  }

  function setCurrentUser(user) {
    currentUser.value = user
  }

  async function login(user) {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password).then(() => {
        //todo snackbar
        setCurrentUser(auth.currentUser)
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
    loggedUser,
    checkAuth,
    login
  }
})
