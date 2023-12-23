// Composables
import {createRouter, createWebHashHistory} from 'vue-router'

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
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
