import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../components/LoginView.vue';
import DashboardView from '../components/DashboardView.vue';
import SaleAndPurchaseView from '../components/SaleAndPurchaseView.vue';
import LogView from '../components/LogView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView},
  { path: '/transaction', component: SaleAndPurchaseView},
  { path: '/log', component: LogView}
 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
