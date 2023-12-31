import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'Accueil',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'nouvelle-observation',
        name: 'Nouvelle observation',
        component: () => import('@/views/CreateObservation.vue'),
      },
      {
        path: 'mes-observations',
        name: 'Mes observations',
        component: () => import('@/views/ObservationsList.vue'),
      },
      {
        path: 'creer-mon-compte',
        name: 'Créer mon compte',
        component: () => import('@/views/Auth/Register'),
      },
      {
        path: 'connexion',
        name: 'Connexion',
        component: () => import('@/views/Auth/Login'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  // const store = useUsersStore()
  // const { setCurrentUser } = store
  // await auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     setCurrentUser(user)
  //   }
  // })
  // return {name: to.name}
})

export default router
