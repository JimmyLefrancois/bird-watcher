import {createRouter, createWebHistory} from 'vue-router'
import { getCurrentUser } from '@/conf/firebase'
import {useHead} from "@unhead/vue";

const routes = [
  {
    path: '/',
    name: 'accueil',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true, title: 'Accueil PWA' },
  },
  {
    path: '/nouvelle-observation',
    name: 'nouvelle-observation',
    component: () => import('@/views/CreateObservation.vue'),
    meta: { requiresAuth: true, title: 'Nouvelle observation'},
  },
  {
    path: '/modifier-mon-observation',
    name: 'modifier-mon-observation',
    component: () => import('@/views/EditObservation.vue'),
    meta: { requiresAuth: true, title: 'Modifier mon observation'},
  },
  {
    path: '/mes-observations',
    name: 'mes-observations',
    component: () => import('@/views/ObservationsList.vue'),
    meta: { requiresAuth: true, title: 'Mes observations'},
  },
  {
    path: '/creer-mon-compte',
    name: 'creer-mon-compte',
    component: () => import('@/views/Auth/Register'),
    meta: { title: 'Créer mon compte'},
  },
  {
    path: '/connexion',
    name: 'connexion',
    component: () => import('@/views/Auth/Login'),
    meta: { title: 'Connexion'},
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
    title: to?.meta?.title || 'Mes observations ornitho'
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
