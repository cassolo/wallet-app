import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../components/LoginView.vue';
import DashboardView from '../components/DashboardView.vue';
import NewPurchaseView from '../components/NewPurchaseView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView},
  { path: '/new-purchase', component: NewPurchaseView },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
