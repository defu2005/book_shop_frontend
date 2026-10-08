<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin">
    <aside>
      <RouterLink class="brand" to="/">Bookshop</RouterLink>
      <p class="muted">Quản trị cửa hàng</p>
      <nav>
        <RouterLink to="/admin/books">Sách</RouterLink>
        <RouterLink to="/admin/authors">Tác giả</RouterLink>
        <RouterLink to="/admin/categories">Danh mục</RouterLink>
        <RouterLink to="/admin/orders">Đơn hàng</RouterLink>
        <RouterLink to="/">Về cửa hàng</RouterLink>
      </nav>
      <button class="btn ghost" type="button" @click="logout">Đăng xuất</button>
    </aside>
    <section>
      <RouterView />
    </section>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}
aside {
  padding: 28px 20px;
  background: var(--teal-deep);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.brand {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
}
aside .muted {
  color: #d7eef4;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
nav a {
  padding: 8px 10px;
  border-radius: 10px;
}
nav a.router-link-active {
  background: rgba(255, 255, 255, 0.12);
}
section {
  padding: 28px;
}
@media (max-width: 800px) {
  .admin {
    grid-template-columns: 1fr;
  }
  aside {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  nav {
    flex-direction: row;
    width: 100%;
  }
}
</style>
