<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getBooks, searchBooks } from '../api/books'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const books = ref([])
const error = ref('')
const loading = ref(false)
const notice = ref('')

const categoryId = computed(() => Number(route.query.category || 0))
const keyword = computed(() => String(route.query.q || '').trim())

const filtered = computed(() => {
  const id = categoryId.value
  if (!id) return books.value
  return books.value.filter((book) => (book.categories || []).some((cat) => cat.id === id))
})

const featured = computed(() => filtered.value.slice(0, 4))
const rest = computed(() => filtered.value.slice(4, 8))

async function loadCatalog() {
  loading.value = true
  error.value = ''
  notice.value = ''
  try {
    const q = keyword.value
    if (!q) {
      books.value = await getBooks()
      return
    }
    try {
      books.value = await searchBooks(q)
    } catch (err) {
      notice.value = 'API tìm kiếm chưa khớp route, đang lọc trên danh sách sách hiện có.'
      const all = await getBooks()
      const needle = q.toLowerCase()
      books.value = all.filter((book) => {
        const author = book.author?.name?.toLowerCase() || ''
        const cats = (book.categories || []).map((c) => c.name.toLowerCase()).join(' ')
        return `${book.name} ${author} ${cats}`.toLowerCase().includes(needle)
      })
      if (!books.value.length && err.message) error.value = err.message
    }
  } catch (err) {
    error.value =
      err.status === 401
        ? 'Không tải được danh sách sách (GET /api/books đang lỗi phía backend). Layout vẫn dùng được các API khác.'
        : err.message
  } finally {
    loading.value = false
  }
}

watch(() => [route.query.q, route.query.category], loadCatalog, { immediate: true })
</script>

<template>
  <section>
    <p v-if="notice" class="alert ok">{{ notice }}</p>
    <p v-if="error" class="alert">{{ error }}</p>
    <p v-if="loading" class="muted">Đang tải sách...</p>

    <div v-else>
      <section class="panel">
        <header class="panel-head">
          <h2>{{ keyword ? `Kết quả: ${keyword}` : 'Sách nổi bật' }}</h2>
          <span>Xem tất cả »</span>
        </header>
        <div class="products">
          <ProductCard v-for="book in featured" :key="book.id" :book="book" />
          <p v-if="!featured.length" class="empty">Chưa có sách phù hợp.</p>
        </div>
      </section>

      <section v-if="rest.length" class="panel">
        <header class="panel-head">
          <h2>Sách mới</h2>
          <span>Xem tất cả »</span>
        </header>
        <div class="products">
          <ProductCard v-for="book in rest" :key="book.id" :book="book" />
        </div>
      </section>

      <section v-if="filtered.length > 8" class="panel">
        <header class="panel-head">
          <h2>Tất cả sản phẩm</h2>
        </header>
        <div class="products">
          <ProductCard v-for="book in filtered.slice(8)" :key="book.id" :book="book" />
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid var(--line);
  margin-bottom: 20px;
}
.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
}
.panel-head h2 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}
.panel-head span {
  color: var(--muted);
  font-size: 0.85rem;
}
.products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px;
}
.empty {
  grid-column: 1 / -1;
}
@media (max-width: 1100px) {
  .products {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 720px) {
  .products {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
