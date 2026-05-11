import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import FleetHealthView from '@/views/FleetHealthView.vue';
import IncidentsView from '@/views/IncidentsView.vue';
import RegionsView from '@/views/RegionsView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/fleet',
      name: 'fleet-health',
      component: FleetHealthView,
    },
    {
      path: '/incidents',
      name: 'incidents',
      component: IncidentsView,
    },
    {
      path: '/regions',
      name: 'regions',
      component: RegionsView,
    },
  ],
});
