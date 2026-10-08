<script setup>
import { onMounted, ref } from 'vue'
import { deleteOrder, getAllOrders, updateOrderStatus } from '../../api/orders'
import { formatDate, formatVnd, ORDER_STATUSES, statusLabel } from '../../utils/format'

const orders = ref([])
const error = ref('')
const notice = ref('')

async function load() {
  try {
    orders.value = await getAllOrders()
  } catch (err) {
    error.value = err.message
  }
}

async function changeStatus(order, status) {
  try {
    await updateOrderStatus(order.id, status)
    notice.value = `Đã cập nhật đơn #${order.id}`
    await load()
  } catch (err) {
    error.value = err.message
  }
}

async function remove(id) {
  if (!confirm('Xóa đơn hàng này?')) return
  notice.value = (await deleteOrder(id)).message
  await load()
}

onMounted(load)
</script>

<template>
  <section>
    <h1>Đơn hàng</h1>
    <p class="muted">GET /api/orders, PATCH trạng thái, DELETE đơn.</p>
    <p v-if="error" class="alert">{{ error }}</p>
    <p v-if="notice" class="alert ok">{{ notice }}</p>
    <div class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Ngày</th>
            <th>Tổng</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.userId }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>{{ formatVnd(order.totalAmount) }}</td>
            <td>{{ order.shippingAddress }}</td>
            <td>
              <select :value="order.status" @change="changeStatus(order, $event.target.value)">
                <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
                  {{ statusLabel(status) }}
                </option>
              </select>
            </td>
            <td><button class="btn small danger" @click="remove(order.id)">Xóa</button></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!orders.length" class="empty">Chưa có đơn.</p>
    </div>
  </section>
</template>

<style scoped>
.table-wrap {
  padding: 12px 16px 20px;
  margin-top: 16px;
}
select {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 8px;
  background: #fff;
}
</style>
