<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuthors } from '../api/authors'
import { getCategories } from '../api/categories'
import { getBooksPage } from '../api/books'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const books = ref([])
const authors = ref([])
const categories = ref([])
const totalElements = ref(0)
const totalPages = ref(0)
const error = ref('')
const filterError = ref('')
const loading = ref(false)
const keyword = ref('')
const categoryId = ref(0)
const authorId = ref(0)
const maxPrice = ref('')
const minPrice = ref('')
const sort = ref('')
const page = ref(0)
const size = ref(20)
const sortOptions = [
  { value: 'PRICE_ASC', label: 'Giá tăng dần' },
  { value: 'PRICE_DESC', label: 'Giá giảm dần' },
  { value: 'LATEST', label: 'Mới nhất' },
  { value: 'OLDEST', label: 'Cũ nhất' },
  { value: 'BEST_SELLING', label: 'Bán chạy nhất' },
]

const visiblePages = computed(() => {
  const start = Math.max(0, Math.min(page.value - 2, totalPages.value - 5))
  const end = Math.min(totalPages.value, start + 5)
  return Array.from({ length: end - start }, (_, index) => start + index)
})

function payload() {
  return {
    keyword: keyword.value,
    categoryId: categoryId.value,
    authorId: authorId.value,
    maxPrice: maxPrice.value === '' ? '' : Number(maxPrice.value),
    minPrice: minPrice.value === '' ? '' : Number(minPrice.value),
    sort: sort.value,
    page: page.value,
    size: size.value,
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const result = await getBooksPage(payload())
    books.value = result.content
    totalElements.value = result.totalElements
    totalPages.value = result.totalPages
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const results = await Promise.allSettled([getAuthors(), getCategories()])
  const [authorsResult, categoriesResult] = results

  if (authorsResult.status === 'fulfilled') authors.value = authorsResult.value
  else filterError.value = `Không tải được danh sách tác giả: ${authorsResult.reason.message}`

  if (categoriesResult.status === 'fulfilled') categories.value = categoriesResult.value
  else {
    const message = `Không tải được danh sách danh mục: ${categoriesResult.reason.message}`
    filterError.value = filterError.value ? `${filterError.value} ${message}` : message
  }
})

watch(
  () => [
    route.query.q,
    route.query.category,
    route.query.authorId,
    route.query.minPrice,
    route.query.maxPrice,
    route.query.sort,
    route.query.size,
  ],
  ([queryKeyword, queryCategory, queryAuthor, queryMinPrice, queryMaxPrice, querySort, querySize]) => {
    keyword.value = typeof queryKeyword === 'string' ? queryKeyword.trim() : ''
    categoryId.value = Number(queryCategory) || 0
    authorId.value = Number(queryAuthor) || 0
    minPrice.value = typeof queryMinPrice === 'string' ? queryMinPrice : ''
    maxPrice.value = typeof queryMaxPrice === 'string' ? queryMaxPrice : ''
    sort.value = typeof querySort === 'string' ? querySort : ''
    size.value = Number(querySize) || 20
    page.value = 0
    load()
  },
  { immediate: true },
)

function applyFilters() {
  if (minPrice.value !== '' && maxPrice.value !== '' && Number(minPrice.value) > Number(maxPrice.value)) {
    error.value = 'Giá tối thiểu không được lớn hơn giá tối đa.'
    return
  }

  const query = {
    ...(keyword.value.trim() ? { q: keyword.value.trim() } : {}),
    ...(categoryId.value ? { category: String(categoryId.value) } : {}),
    ...(authorId.value ? { authorId: String(authorId.value) } : {}),
    ...(minPrice.value !== '' ? { minPrice: minPrice.value } : {}),
    ...(maxPrice.value !== '' ? { maxPrice: maxPrice.value } : {}),
    ...(sort.value ? { sort: sort.value } : {}),
    size: String(size.value),
  }
  router.push({ path: '/', query })
}

function clearFilters() {
  keyword.value = ''
  categoryId.value = 0
  authorId.value = 0
  minPrice.value = ''
  maxPrice.value = ''
  sort.value = ''
  page.value = 0
  size.value = 20
  error.value = ''

  const hasAppliedFilters = [
    route.query.q,
    route.query.category,
    route.query.authorId,
    route.query.minPrice,
    route.query.maxPrice,
    route.query.sort,
  ].some(Boolean) || (route.query.size && route.query.size !== '20')

  if (hasAppliedFilters) router.push({ path: '/', query: { size: '20' } })
  else load()
}

function goToPage(nextPage) {
  if (loading.value || nextPage < 0 || nextPage >= totalPages.value || nextPage === page.value) return
  page.value = nextPage
  load()
}

</script>

<template>
  <div class="panel">
    <div class="panel-head">
      <h2>Danh sách sách</h2>
      <span v-if="loading">Đang tải...</span>
      <span v-else-if="error" class="text-danger">{{ error }}</span>
      <span v-else>{{ totalElements }} sản phẩm</span>
    </div>
    <form class="filters" @submit.prevent="applyFilters">
      <label class="field keyword-field">
        <span>Từ khóa</span>
        <input v-model="keyword" type="search" placeholder="Tên sách..." />
      </label>
      <label class="field">
        <span>Danh mục</span>
        <select v-model.number="categoryId">
          <option :value="0">Tất cả danh mục</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Tác giả</span>
        <select v-model.number="authorId">
          <option :value="0">Tất cả tác giả</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Giá từ</span>
        <input v-model="minPrice" type="number" min="0" placeholder="Tối thiểu" />
      </label>
      <label class="field">
        <span>Giá đến</span>
        <input v-model="maxPrice" type="number" min="0" placeholder="Tối đa" />
      </label>
      <label class="field">
        <span>Sắp xếp</span>
        <select v-model="sort">
          <option value="">Mặc định</option>
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <label class="field page-size">
        <span>Số sách mỗi trang</span>
        <select v-model.number="size">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>
      <div class="filter-actions">
        <button class="btn" type="submit">Lọc sách</button>
        <button class="btn ghost" type="button" @click="clearFilters">Xóa bộ lọc</button>
      </div>
      <p v-if="filterError" class="filter-error">{{ filterError }}</p>
    </form>
    <div class="products">
      <ProductCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
      <p v-if="!loading && !error && !books.length" class="empty">Không có sản phẩm nào.</p>
    </div>
    <nav v-if="totalPages > 1" class="pager" aria-label="Phân trang sách">
      <button type="button" :disabled="loading || page === 0" @click="goToPage(page - 1)">
        Trước
      </button>
      <button
        v-for="pageNumber in visiblePages"
        :key="pageNumber"
        type="button"
        :class="{ on: pageNumber === page }"
        :disabled="loading"
        :aria-current="pageNumber === page ? 'page' : undefined"
        @click="goToPage(pageNumber)"
      >
        {{ pageNumber + 1 }}
      </button>
      <button
        type="button"
        :disabled="loading || page >= totalPages - 1"
        @click="goToPage(page + 1)"
      >
        Sau
      </button>
    </nav>
  </div>
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
.filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--line);
}
.filters .field input,
.filters .field select {
  width: 100%;
  min-width: 0;
}
.keyword-field {
  grid-column: span 2;
}
.filter-actions {
  display: flex;
  align-items: end;
  gap: 8px;
}
.filter-error {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--danger);
  font-size: 0.9rem;
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
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 10px 12px;
}
.pager button {
  min-width: 38px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: #fff;
  color: var(--ink);
  cursor: pointer;
}
.pager button.on {
  border-color: var(--teal);
  background: var(--teal);
  color: #fff;
}
.pager button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
@media (max-width: 1100px) {
  .filters {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .products {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 720px) {
  .filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .keyword-field {
    grid-column: 1 / -1;
  }
  .filter-actions {
    grid-column: 1 / -1;
  }
  .products {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
