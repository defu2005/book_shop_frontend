<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { getCategories } from '../api/categories'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const route = useRoute()

const keyword = ref('')
const categories = ref([])
const newsItems = [
  { label: 'Tác giả', to: '/' },
  { label: 'Tác phẩm', to: '/' },
  { label: 'Báo chí', to: '/' },
  { label: 'Infographic', to: '/' },
]

const activeCategory = computed(() => String(route.query.category || ''))

watch(
  () => route.query.q,
  (q) => {
    keyword.value = typeof q === 'string' ? q : ''
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    categories.value = await getCategories()
  } catch {
    categories.value = []
  }
})

function search() {
  const q = keyword.value.trim()
  router.push({
    path: '/',
    query: {
      ...(q ? { q } : {}),
      ...(route.query.category ? { category: route.query.category } : {}),
    },
  })
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="shell">
    <div class="utility">
      <div class="container util-row">
        <div class="meta">
          <span>Mon - Fri 8:00 - 17:30</span>
          <span>sachtaodan@gmail.com</span>
          <span>HOTLINE: 0974148047</span>
        </div>
        <div class="meta-right">
          <span>{{ auth.user?.username }}</span>
          <RouterLink to="/orders">Tài khoản</RouterLink>
          <button type="button" @click="logout">Thoát</button>
        </div>
      </div>
    </div>

    <header class="masthead">
      <div class="container mast-row">
        <RouterLink class="logo" to="/" aria-label="Bookshop">
          <span>BS</span>
        </RouterLink>
        <form class="search" @submit.prevent="search">
          <input v-model="keyword" placeholder="Tìm kiếm..." />
          <button type="submit" aria-label="Tìm">⌕</button>
        </form>
        <RouterLink class="cart-btn" to="/cart">
          GIỎ HÀNG: {{ cart.count }} SẢN PHẨM
        </RouterLink>
      </div>
    </header>

    <nav class="main-nav">
      <div class="container nav-row">
        <RouterLink to="/" :class="{ on: route.path === '/' && !route.query.category }">SÁCH BOOKSHOP</RouterLink>
        <RouterLink to="/" :class="{ on: route.path === '/' }">DANH SÁCH SẢN PHẨM</RouterLink>
        <RouterLink to="/cart">GIỎ HÀNG</RouterLink>
        <RouterLink to="/orders">ĐƠN HÀNG</RouterLink>
        <RouterLink to="/checkout">THANH TOÁN</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin">QUẢN TRỊ</RouterLink>
        <a href="#about">ABOUT US</a>
      </div>
    </nav>

    <div class="container page shop-grid">
      <aside class="side">
        <section class="side-block">
          <h2>DANH MỤC SÁCH</h2>
          <ul>
            <li>
              <RouterLink to="/" active-class="" exact-active-class="" :class="{ active: !activeCategory }">
                Tất cả sách
              </RouterLink>
            </li>
            <li v-for="cat in categories" :key="cat.id">
              <RouterLink
                :to="{ path: '/', query: { category: cat.id } }"
                active-class=""
                exact-active-class=""
                :class="{ active: activeCategory === String(cat.id) }"
              >
                {{ cat.name }}
              </RouterLink>
            </li>
          </ul>
        </section>
        <section class="side-block">
          <h2>TIN TỨC</h2>
          <ul>
            <li v-for="item in newsItems" :key="item.label">
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </section>
      </aside>
      <main>
        <RouterView />
      </main>
    </div>

    <footer id="about" class="site-foot">
      <div class="container">Bookshop — hiệu sách trực tuyến. Hotline 0974148047.</div>
    </footer>
    <a class="hotline-fab" href="tel:0974148047" aria-label="Gọi hotline">☎</a>
  </div>
</template>

<style scoped>
.utility {
  background: var(--teal);
  color: #fff;
  font-size: 0.82rem;
}
.util-row,
.mast-row,
.nav-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.util-row {
  min-height: 36px;
  justify-content: space-between;
}
.meta,
.meta-right {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.meta-right button {
  background: none;
  border: 0;
  color: #fff;
  cursor: pointer;
  padding: 0;
}
.masthead {
  background: #fff;
  border-bottom: 1px solid var(--line);
}
.mast-row {
  min-height: 92px;
}
.logo {
  width: 72px;
  height: 72px;
  border: 2px solid #222;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.search {
  flex: 1;
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  max-width: 640px;
  margin: 0 auto;
}
.search input {
  flex: 1;
  border: 0;
  padding: 12px 14px;
  outline: none;
}
.search button {
  width: 48px;
  border: 0;
  background: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
}
.cart-btn {
  background: var(--teal);
  color: #fff !important;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}
.main-nav {
  background: var(--teal);
  color: #fff;
}
.nav-row {
  min-height: 46px;
  gap: 8px;
  flex-wrap: wrap;
}
.nav-row a {
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 8px 10px;
}
.nav-row a:hover,
.nav-row a.on,
.nav-row a.router-link-exact-active {
  background: var(--teal-deep);
}
.shop-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  align-items: start;
}
.side-block {
  background: #fff;
  border: 1px solid var(--line);
  margin-bottom: 18px;
}
.side-block h2 {
  margin: 0;
  background: var(--teal);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 12px 14px;
}
.side-block ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.side-block a,
.side-block span {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-top: 1px solid var(--line);
  color: #555;
  font-size: 0.92rem;
}
.side-block a::before,
.side-block span::before {
  content: '▣';
  color: var(--teal);
  font-size: 0.85rem;
}
.side-block a:hover,
.side-block a.active {
  color: var(--teal-deep);
  background: #f7fbfd;
}
.site-foot {
  background: #fff;
  border-top: 1px solid var(--line);
  padding: 18px 0 80px;
  color: var(--muted);
  font-size: 0.9rem;
}
.hotline-fab {
  position: fixed;
  left: 18px;
  bottom: 22px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  box-shadow: 0 8px 20px rgba(42, 164, 197, 0.45);
  z-index: 20;
}
@media (max-width: 900px) {
  .shop-grid {
    grid-template-columns: 1fr;
  }
  .mast-row,
  .util-row {
    flex-wrap: wrap;
    padding: 10px 0;
  }
  .search {
    order: 3;
    max-width: none;
    width: 100%;
  }
}
</style>
