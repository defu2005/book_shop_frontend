<script setup>
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getBook } from '../api/books'
import { useCartStore } from '../stores/cart'
import { coverUrl, displayDiscount, formatVnd, originalPrice } from '../utils/format'

const route = useRoute()
const cart = useCartStore()
const book = ref(null)
const error = ref('')
const qty = ref(1)
const coverBroken = ref(false)

async function load() {
  error.value = ''
  book.value = null
  coverBroken.value = false
  try {
    book.value = await getBook(route.params.id)
    qty.value = book.value.quantity ? 1 : 0
  } catch (err) {
    error.value = err.message
  }
}

watch(() => route.params.id, load, { immediate: true })

function add() {
  if (!book.value) return
  cart.add(book.value, qty.value)
}
</script>

<template>
  <div v-if="error" class="alert">{{ error }}</div>
  <article v-else-if="book" class="card detail">
    <div class="cover">
      <img v-if="!coverBroken" :src="coverUrl(book)" :alt="book.name" @error="coverBroken = true" />
      <span v-else>{{ book.name?.slice(0, 1) }}</span>
      <span class="off">-{{ displayDiscount(book) }}%</span>
    </div>
    <div>
      <RouterLink to="/" class="muted">← Danh sách sách</RouterLink>
      <h1>{{ book.name }}</h1>
      <p>Tác giả: <strong>{{ book.author?.name || '—' }}</strong></p>
      <div class="tags">
        <span v-for="cat in book.categories || []" :key="cat.id" class="badge">{{ cat.name }}</span>
      </div>
      <p class="price">
        <span class="price-sale">{{ formatVnd(book.price) }}</span>
        <span class="price-old">{{ formatVnd(originalPrice(book)) }}</span>
      </p>
      <p class="muted">Tồn kho: {{ book.quantity }}</p>
      <div class="row">
        <label class="field">
          <span>Số lượng</span>
          <input v-model.number="qty" type="number" min="1" :max="book.quantity" />
        </label>
        <button class="btn" :disabled="!book.quantity" @click="add">Thêm vào giỏ</button>
      </div>
    </div>
  </article>
  <p v-else class="muted">Đang tải...</p>
</template>

<style scoped>
.detail {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 28px;
  padding: 24px;
}
.cover {
  position: relative;
  min-height: 320px;
  background: #eef6f8;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover span:not(.off) {
  font-size: 5rem;
  color: var(--teal);
}
.off {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--sale);
  color: #fff;
  font-weight: 700;
  padding: 4px 8px;
  font-size: 0.85rem;
}
.price {
  font-size: 1.6rem;
  margin: 12px 0;
}
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.row {
  display: flex;
  gap: 16px;
  align-items: end;
  max-width: 360px;
}
@media (max-width: 800px) {
  .detail {
    grid-template-columns: 1fr;
  }
}
</style>
