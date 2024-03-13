import {createRouter, createWebHistory} from 'vue-router'
import { getCurrentUser } from '@/conf/firebase'
import {useHead} from "@unhead/vue";
import { useObservationsStore } from "@/store/observations";
import {storeToRefs} from "pinia";

const routes = [
  {
    path: '/',
    name: 'accueil',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true, title: 'Accueil' },
  },
  {
    path: '/nouvelle-observation',
    name: 'nouvelle-observation',
    component: () => import('@/views/CreateObservation.vue'),
    meta: { requiresAuth: true, title: 'Nouvelle observation'},
  },
  {
    path: '/modifier-mon-observation/:observation',
    name: 'modifier-mon-observation',
    component: () => import('@/views/EditObservation.vue'),beforeEnter: (to) => {
      const store = useObservationsStore()
      const { editingObservation } = storeToRefs(store)
      editingObservation.value = to.params.observation
    },
    meta: { requiresAuth: true, title: 'Modifier mon observation'},
  },
  {
    path: '/observation/:observation',
    name: 'observation',
    component: () => import('@/views/ShowObservation'),
    beforeEnter: (to) => {
      const store = useObservationsStore()
      const { observationToShow } = storeToRefs(store)
      observationToShow.value = to.params.observation
    },
    meta: { requiresAuth: true, title: 'Mon observation'}
  },
  {
    path: '/mes-observations',
    name: 'mes-observations',
    component: () => import('@/views/ObservationsList.vue'),
    meta: { requiresAuth: true, title: 'Mes observations'},
  },
  {
    path: '/mes-lieux-d-observation',
    name: 'mes-lieux-d-observation',
    component: () => import('@/views/MyPlaces'),
    meta: { requiresAuth: true, title: 'Mes lieux d\'observation'},
  },
  {
    path: '/ajouter-un-lieu-d-observation',
    name: 'ajouter-un-lieu-d-observation',
    component: () => import('@/components/Forms/CreatePlaceForm'),
    meta: { requiresAuth: true, title: 'Ajouter un lieu d\'observation'},
  },
  {
    path: '/creer-mon-compte',
    name: 'creer-mon-compte',
    component: () => import('@/views/Auth/RegisterView.vue'),
    meta: { title: 'Créer mon compte'},
  },
  {
    path: '/connexion',
    name: 'connexion',
    component: () => import('@/views/Auth/LoginView.vue'),
    meta: { title: 'Connexion'},
  },
  {
    path: '/reinitialiser-mon-mot-de-passe',
    name: 'reset',
    component: () => import('@/views/Auth/ResetView.vue'),
    meta: { title: 'Réinitialiser mon mot de passe'},
  },
  {
    path: '/gestion-de-mon-compte',
    name: 'account',
    component: () => import('@/views/Auth/AccountView.vue'),
    meta: { title: 'Gestion de mon compte'},
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page introuvable',
        requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  useHead({
    title: `${to?.meta?.title} - Plumes en vue` || 'Plumes en vue'
  })
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
