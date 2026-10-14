<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  createBook,
  deleteBook,
  forceDeleteBook,
  getBooksPage,
  restoreBook,
  updateBook,
} from '../../api/books'
import { getAuthors } from '../../api/authors'
import { getCategories } from '../../api/categories'
import { formatVnd } from '../../utils/format'

const books = ref([])
const authors = ref([])
const categories = ref([])
const totalElements = ref(0)
const totalPages = ref(0)
const page = ref(0)
const size = ref(20)
const error = ref('')
const notice = ref('')
const editingId = ref(null)
const restoreId = ref('')
const filters = reactive({
  keyword: '',
  authorId: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
})
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
const orderedCategories = computed(() => {
  const selectedIds = new Set(form.categoryIds.map(String))
  return [...categories.value].sort(
    (a, b) => Number(selectedIds.has(String(b.id))) - Number(selectedIds.has(String(a.id))),
  )
})
const form = reactive({
  name: '',
  quantity: 0,
  price: 0,
  authorId: '',
  categoryIds: [],
})

function resetForm() {
  editingId.value = null
  form.name = ''
  form.quantity = 0
  form.price = 0
  form.authorId = authors.value[0]?.id ?? ''
  form.categoryIds = []
}

async function load() {
  error.value = ''
  try {
    const [bookPage, authorList, categoryList] = await Promise.all([
      getBooksPage(filterPayload()),
      getAuthors(),
      getCategories(),
    ])
    setBookPage(bookPage)
    authors.value = authorList
    categories.value = categoryList
    if (!form.authorId) form.authorId = authorList[0]?.id ?? ''
  } catch (err) {
    error.value = err.message
  }
}

function filterPayload() {
  return {
    ...filters,
    authorId: filters.authorId ? Number(filters.authorId) : '',
    categoryId: filters.categoryId ? Number(filters.categoryId) : '',
    minPrice: filters.minPrice === '' ? '' : Number(filters.minPrice),
    maxPrice: filters.maxPrice === '' ? '' : Number(filters.maxPrice),
    page: page.value,
    size: size.value,
  }
}

function setBookPage(result) {
  books.value = result.content
  totalElements.value = result.totalElements
  totalPages.value = result.totalPages
}

async function loadBooks() {
  error.value = ''
  try {
    setBookPage(await getBooksPage(filterPayload()))
  } catch (err) {
    error.value = err.message
  }
}

function applyFilters() {
  if (filters.minPrice !== '' && filters.maxPrice !== '' && Number(filters.minPrice) > Number(filters.maxPrice)) {
    error.value = 'Giá tối thiểu không được lớn hơn giá tối đa.'
    return
  }
  page.value = 0
  loadBooks()
}

function clearFilters() {
  Object.assign(filters, {
    keyword: '',
    authorId: '',
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
  })
  error.value = ''
  page.value = 0
  size.value = 20
  loadBooks()
}

function goToPage(nextPage) {
  if (nextPage < 0 || nextPage >= totalPages.value || nextPage === page.value) return
  page.value = nextPage
  loadBooks()
}

function startEdit(book) {
  editingId.value = book.id
  form.name = book.name
  form.quantity = book.quantity
  form.price = book.price
  form.authorId = book.author?.id ?? ''
  form.categoryIds = (book.categories || []).map((c) => c.id)
}

function payload() {
  return {
    name: form.name,
    quantity: Number(form.quantity),
    price: Number(form.price),
    authorId: Number(form.authorId),
    categoryIds: form.categoryIds.map(Number),
  }
}

async function save() {
  error.value = ''
  notice.value = ''
  try {
    if (editingId.value) await updateBook(editingId.value, payload())
    else await createBook(payload())
    resetForm()
    await load()
    notice.value = 'Đã lưu sách.'
  } catch (err) {
    error.value = err.message
  }
}

async function remove(id) {
  if (!confirm('Ẩn sách này (soft delete)?')) return
  notice.value = (await deleteBook(id)).message
  await load()
}

async function forceRemove(id) {
  if (!confirm('Xóa vĩnh viễn sách này?')) return
  notice.value = (await forceDeleteBook(id)).message
  await load()
}

async function restore() {
  if (!restoreId.value) return
  notice.value = (await restoreBook(restoreId.value)).message
  restoreId.value = ''
  await load()
}

onMounted(load)
</script>

<template>
  <section>
    <h1>Quản lý sách</h1>
    <p class="muted">CRUD + restore/force-delete theo /api/books</p>
    <p v-if="error" class="alert">{{ error }}</p>
    <p v-if="notice" class="alert ok">{{ notice }}</p>

    <form class="card form" @submit.prevent="save">
      <h2>{{ editingId ? 'Sửa sách' : 'Thêm sách' }}</h2>
      <label class="field">
        <span>Tên sách</span>
        <input v-model="form.name" maxlength="256" required />
      </label>
      <div class="row">
        <label class="field">
          <span>Số lượng</span>
          <input v-model.number="form.quantity" type="number" min="0" required />
        </label>
        <label class="field">
          <span>Giá</span>
          <input v-model.number="form.price" type="number" min="0" required />
        </label>
      </div>
      <label class="field">
        <span>Tác giả</span>
        <select v-model="form.authorId" required>
          <option v-for="author in authors" :key="author.id" :value="author.id">{{ author.name }}</option>
        </select>
      </label>
      <label class="field">
        <span>Danh mục (giữ Ctrl để chọn nhiều)</span>
        <select v-model="form.categoryIds" multiple required>
          <option v-for="cat in orderedCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </label>
      <div class="actions">
        <button class="btn">{{ editingId ? 'Cập nhật' : 'Tạo mới' }}</button>
        <button v-if="editingId" class="btn ghost" type="button" @click="resetForm">Hủy</button>
      </div>
    </form>

    <form class="restore" @submit.prevent="restore">
      <input v-model="restoreId" placeholder="ID sách đã xóa mềm" />
      <button class="btn ghost">Khôi phục</button>
    </form>

    <form class="admin-filters card" @submit.prevent="applyFilters">
      <label class="field">
        <span>Từ khóa</span>
        <input v-model="filters.keyword" type="search" placeholder="Tên sách..." />
      </label>
      <label class="field">
        <span>Tác giả</span>
        <select v-model="filters.authorId">
          <option value="">Tất cả tác giả</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Danh mục</span>
        <select v-model="filters.categoryId">
          <option value="">Tất cả danh mục</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Giá từ</span>
        <input v-model="filters.minPrice" type="number" min="0" placeholder="Tối thiểu" />
      </label>
      <label class="field">
        <span>Giá đến</span>
        <input v-model="filters.maxPrice" type="number" min="0" placeholder="Tối đa" />
      </label>
      <label class="field">
        <span>Sắp xếp</span>
        <select v-model="filters.sort">
          <option value="">Mặc định</option>
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Số sách mỗi trang</span>
        <select v-model.number="size">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>
      <div class="actions">
        <button class="btn" type="submit">Lọc sách</button>
        <button class="btn ghost" type="button" @click="clearFilters">Xóa bộ lọc</button>
      </div>
    </form>

    <div class="card table-wrap">
      <p class="muted result-count">{{ totalElements }} sách</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Tác giả</th>
            <th>Giá</th>
            <th>SL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.name }}</td>
            <td>{{ book.author?.name }}</td>
            <td>{{ formatVnd(book.price) }}</td>
            <td>{{ book.quantity }}</td>
            <td class="actions">
              <button class="btn small ghost" @click="startEdit(book)">Sửa</button>
              <button class="btn small ghost" @click="remove(book.id)">Xóa mềm</button>
              <button class="btn small danger" @click="forceRemove(book.id)">Xóa hẳn</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!books.length" class="empty">Không tìm thấy sách phù hợp.</p>
      <nav v-if="totalPages > 1" class="pager" aria-label="Phân trang quản lý sách">
        <button type="button" :disabled="page === 0" @click="goToPage(page - 1)">Trước</button>
        <button
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          type="button"
          :class="{ on: pageNumber === page }"
          :aria-current="pageNumber === page ? 'page' : undefined"
          @click="goToPage(pageNumber)"
        >
          {{ pageNumber + 1 }}
        </button>
        <button type="button" :disabled="page >= totalPages - 1" @click="goToPage(page + 1)">
          Sau
        </button>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.form,
.table-wrap {
  padding: 20px;
  margin: 16px 0;
}
.admin-filters {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 20px;
  margin: 16px 0;
}
.admin-filters .field input,
.admin-filters .field select {
  width: 100%;
  min-width: 0;
}
.result-count {
  margin: 4px 0 12px;
}
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 0 0;
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
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.restore {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.restore input {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 12px;
}
select[multiple] {
  min-height: 110px;
}
@media (max-width: 1000px) {
  .admin-filters {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 680px) {
  .admin-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .admin-filters .actions {
    grid-column: 1 / -1;
  }
}
</style>
