<script setup>
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getOrder } from '../api/orders'
import { formatDate, formatVnd, statusLabel } from '../utils/format'

const route = useRoute()
const order = ref(null)
const error = ref('')

async function load() {
  error.value = ''
  order.value = null
  try {
    order.value = await getOrder(route.params.id)
  } catch (err) {
    error.value = err.message
  }
}

watch(() => route.params.id, load, { immediate: true })
</script>

<template>
  <section>
    <RouterLink to="/orders" class="muted">← Đơn hàng</RouterLink>
    <p v-if="error" class="alert">{{ error }}</p>
    <article v-else-if="order" class="card wrap">
      <h1>Đơn #{{ order.id }}</h1>
      <p>Trạng thái: <strong>{{ statusLabel(order.status) }}</strong></p>
      <p>Ngày tạo: {{ formatDate(order.createdAt) }}</p>
      <p>Địa chỉ: {{ order.shippingAddress }}</p>
      <table>
        <thead>
          <tr>
            <th>Sách</th>
            <th>SL</th>
            <th>Giá</th>
            <th>Tạm tính</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items || []" :key="item.id">
            <td>{{ item.bookName }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatVnd(item.price) }}</td>
            <td>{{ formatVnd(item.subtotal) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="total">Tổng: {{ formatVnd(order.totalAmount) }}</p>
    </article>
  </section>
</template>

<style scoped>
.wrap {
  padding: 24px;
  margin-top: 12px;
}
.total {
  text-align: right;
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
