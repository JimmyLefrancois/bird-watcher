import {createRouter, createWebHistory} from 'vue-router'
import { getCurrentUser } from '@/conf/firebase'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'Accueil',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'nouvelle-observation',
        name: 'Nouvelle observation',
        component: () => import('@/views/CreateObservation.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'mes-observations',
        name: 'Mes observations',
        component: () => import('@/views/ObservationsList.vue'),
        meta: { requiresAuth: true },
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
  const currentUser = await getCurrentUser();
  if (to.meta.requiresAuth && !currentUser) {
    return {
      path: '/connexion',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }
})

export default router
