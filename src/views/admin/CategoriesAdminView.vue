<script setup>
import { onMounted, ref } from 'vue'
import {
  createCategory,
  deleteCategory,
  forceDeleteCategory,
  getCategories,
  restoreCategory,
  updateCategory,
} from '../../api/categories'

const categories = ref([])
const name = ref('')
const editingId = ref(null)
const restoreId = ref('')
const error = ref('')
const notice = ref('')

async function load() {
  try {
    categories.value = await getCategories()
  } catch (err) {
    error.value = err.message
  }
}

function startEdit(category) {
  editingId.value = category.id
  name.value = category.name
}

function reset() {
  editingId.value = null
  name.value = ''
}

async function save() {
  error.value = ''
  try {
    if (editingId.value) await updateCategory(editingId.value, { name: name.value })
    else await createCategory({ name: name.value })
    reset()
    await load()
  } catch (err) {
    error.value = err.message
  }
}

async function remove(id) {
  if (!confirm('Xóa mềm danh mục? Sách liên quan cũng có thể bị ẩn.')) return
  notice.value = (await deleteCategory(id)).message
  await load()
}

async function forceRemove(id) {
  if (!confirm('Xóa vĩnh viễn danh mục?')) return
  notice.value = (await forceDeleteCategory(id)).message
  await load()
}

async function restore() {
  notice.value = (await restoreCategory(restoreId.value)).message
  restoreId.value = ''
  await load()
}

onMounted(load)
</script>

<template>
  <section>
    <h1>Danh mục</h1>
    <p v-if="error" class="alert">{{ error }}</p>
    <p v-if="notice" class="alert ok">{{ notice }}</p>
    <form class="card form" @submit.prevent="save">
      <label class="field">
        <span>{{ editingId ? 'Sửa tên' : 'Tên danh mục mới' }}</span>
        <input v-model="name" maxlength="256" required />
      </label>
      <div class="actions">
        <button class="btn">{{ editingId ? 'Cập nhật' : 'Thêm' }}</button>
        <button v-if="editingId" class="btn ghost" type="button" @click="reset">Hủy</button>
      </div>
    </form>
    <form class="restore" @submit.prevent="restore">
      <input v-model="restoreId" placeholder="ID đã xóa mềm" required />
      <button class="btn ghost">Khôi phục</button>
    </form>
    <div class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td class="actions">
              <button class="btn small ghost" @click="startEdit(category)">Sửa</button>
              <button class="btn small ghost" @click="remove(category.id)">Xóa mềm</button>
              <button class="btn small danger" @click="forceRemove(category.id)">Xóa hẳn</button>
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
.restore {
  display: flex;
  gap: 8px;
}
.restore input {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 12px;
}
</style>
