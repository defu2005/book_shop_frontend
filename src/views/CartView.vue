<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { formatVnd } from '../utils/format'

const cart = useCartStore()
</script>

<template>
  <section>
    <h1>Giỏ hàng</h1>
    <p v-if="!cart.items.length" class="empty card">Giỏ trống. <RouterLink to="/">Tiếp tục chọn sách</RouterLink></p>
    <div v-else class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Sách</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tạm tính</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ formatVnd(item.price) }}</td>
            <td>
              <input
                :value="item.quantity"
                type="number"
                min="1"
                :max="item.stock"
                @change="cart.setQuantity(item.id, Number($event.target.value))"
              />
            </td>
            <td>{{ formatVnd(item.price * item.quantity) }}</td>
            <td><button class="btn ghost small" @click="cart.remove(item.id)">Xóa</button></td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <strong>Tổng: {{ formatVnd(cart.total) }}</strong>
        <RouterLink class="btn" to="/checkout">Thanh toán</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.table-wrap {
  padding: 8px 16px 16px;
}
input {
  width: 80px;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 8px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px 0;
}
</style>
