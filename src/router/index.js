import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('../layouts/ShopLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'home', component: () => import('../views/HomeView.vue') },
      { path: 'books/:id', name: 'book-detail', component: () => import('../views/BookDetailView.vue') },
      { path: 'cart', name: 'cart', component: () => import('../views/CartView.vue') },
      { path: 'checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue') },
      { path: 'orders', name: 'orders', component: () => import('../views/OrdersView.vue') },
      { path: 'orders/:id', name: 'order-detail', component: () => import('../views/OrderDetailView.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/books' },
      { path: 'books', name: 'admin-books', component: () => import('../views/admin/BooksAdminView.vue') },
      { path: 'authors', name: 'admin-authors', component: () => import('../views/admin/AuthorsAdminView.vue') },
      { path: 'categories', name: 'admin-categories', component: () => import('../views/admin/CategoriesAdminView.vue') },
      { path: 'orders', name: 'admin-orders', component: () => import('../views/admin/OrdersAdminView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'home' }
  }
  return true
})

export default router
