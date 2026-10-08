<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { coverUrl, displayDiscount, formatVnd, originalPrice } from '../utils/format'

defineProps({
  book: { type: Object, required: true },
})

const cart = useCartStore()
const failed = {}

function onCoverError(event, book) {
  if (failed[book.id]) return
  failed[book.id] = true
  event.target.src =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560"><rect fill="#d9eef4" width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" fill="#1f8eac" font-size="64" font-family="Arial">${(book.name || 'B').slice(0, 1)}</text></svg>`,
    )
}
</script>

<template>
  <article class="product">
    <RouterLink :to="`/books/${book.id}`" class="thumb">
      <img :src="coverUrl(book)" :alt="book.name" @error="onCoverError($event, book)" />
      <span class="off">-{{ displayDiscount(book) }}%</span>
    </RouterLink>
    <h3>
      <RouterLink :to="`/books/${book.id}`">{{ book.name }}</RouterLink>
    </h3>
    <p class="author">{{ book.author?.name || 'Chưa có tác giả' }}</p>
    <p class="prices">
      <span class="price-sale">{{ formatVnd(book.price) }}</span>
      <span class="price-old">{{ formatVnd(originalPrice(book)) }}</span>
    </p>
    <button class="btn small" :disabled="!book.quantity" @click="cart.add(book, 1)">
      {{ book.quantity ? 'Thêm vào giỏ' : 'Hết hàng' }}
    </button>
  </article>
</template>

<style scoped>
.product {
  background: #fff;
  padding: 8px 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.thumb {
  position: relative;
  display: block;
  aspect-ratio: 3 / 4;
  background: #f0f0f0;
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.off {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--sale);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 7px;
  border-radius: 2px;
}
h3 {
  margin: 8px 0 0;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.35;
  min-height: 2.6em;
}
h3 a:hover {
  color: var(--teal);
}
.author {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
}
.prices {
  margin: 0 0 4px;
}
.btn {
  align-self: flex-start;
}
</style>
