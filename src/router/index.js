import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminPanel from '../views/AdminPanel.vue';
import LoginAdmin from '../views/LoginAdmin.vue';

// Función para verificar autenticación
const isAuthenticated = () => {
  const auth = localStorage.getItem('adminAuth');
  if (!auth) return false;
  
  try {
    const { isAuthenticated, timestamp } = JSON.parse(atob(auth));
    // Verificar si el token tiene menos de 24 horas
    const now = new Date().getTime();
    const hours24 = 24 * 60 * 60 * 1000;
    return isAuthenticated && (now - timestamp) < hours24;
  } catch {
    return false;
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/admin/login',
    name: 'adminLogin',
    component: LoginAdmin
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/admin/login');
      } else {
        next();
      }
    }
  },
  {
    path: '/rifa/:id',
    name: 'rifaDetail',
    component: () => import('../views/RifaDetail.vue'),
  },
  {
    path: '/participar/:id',
    name: 'participar',
    component: () => import('../views/Participar.vue'),
    props: true
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router; 