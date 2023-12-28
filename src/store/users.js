import {defineStore} from "pinia";
import {computed} from "vue";
import {ref} from 'vue'
import { auth } from '@/conf/firebase'

export const useUsersStore = defineStore('users', () => {

  const currentUser = ref(null)

  function setCurrentUser(user)
  {
    currentUser.value = user
  }

  const loggedUser = computed(() => {
    return currentUser.value
  })

  function checkAuth() {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }

  return {
    loggedUser,
    checkAuth
  }
})
