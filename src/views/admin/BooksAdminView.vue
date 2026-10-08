<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
  createBook,
  deleteBook,
  forceDeleteBook,
  getBooks,
  restoreBook,
  updateBook,
} from '../../api/books'
import { getAuthors } from '../../api/authors'
import { getCategories } from '../../api/categories'
import { formatVnd } from '../../utils/format'

const books = ref([])
const authors = ref([])
const categories = ref([])
const error = ref('')
const notice = ref('')
const editingId = ref(null)
const restoreId = ref('')
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
    const [bookList, authorList, categoryList] = await Promise.all([
      getBooks(),
      getAuthors(),
      getCategories(),
    ])
    books.value = bookList
    authors.value = authorList
    categories.value = categoryList
    if (!form.authorId) form.authorId = authorList[0]?.id ?? ''
  } catch (err) {
    error.value = err.message
  }
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
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
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

    <div class="card table-wrap">
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
    </div>
  </section>
</template>

<style scoped>
.form,
.table-wrap {
  padding: 20px;
  margin: 16px 0;
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
</style>
