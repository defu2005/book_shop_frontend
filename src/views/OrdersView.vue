<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getOrdersByUser } from '../api/orders'
import { formatDate, formatVnd, statusLabel } from '../utils/format'

const auth = useAuthStore()
const orders = ref([])
const error = ref('')

onMounted(async () => {
  try {
    orders.value = await getOrdersByUser(auth.user.id)
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <section>
    <h1>Đơn hàng của tôi</h1>
    <p v-if="error" class="alert">{{ error }}</p>
    <p v-else-if="!orders.length" class="empty card">Bạn chưa có đơn nào.</p>
    <div v-else class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>{{ statusLabel(order.status) }}</td>
            <td>{{ formatVnd(order.totalAmount) }}</td>
            <td><RouterLink :to="`/orders/${order.id}`">Chi tiết</RouterLink></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.table-wrap {
  padding: 8px 16px 16px;
}
</style>
