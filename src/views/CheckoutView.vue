<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { createOrder } from '../api/orders'
import { formatVnd } from '../utils/format'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const shippingAddress = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!cart.items.length) {
    error.value = 'Giỏ hàng trống'
    return
  }
  loading.value = true
  try {
    const order = await createOrder({
      userId: auth.user.id,
      bookIds: cart.items.map((item) => item.id),
      quantities: cart.items.map((item) => item.quantity),
      shippingAddress: shippingAddress.value,
    })
    cart.clear()
    router.push(`/orders/${order.id}`)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="grid checkout">
    <form class="card form" @submit.prevent="submit">
      <h1>Đặt hàng</h1>
      <p class="muted">Nhập địa chỉ giao hàng để tạo đơn qua API hiện có.</p>
      <label class="field">
        <span>Địa chỉ giao hàng</span>
        <textarea v-model="shippingAddress" rows="4" maxlength="500" required />
      </label>
      <p v-if="error" class="alert">{{ error }}</p>
      <button class="btn" :disabled="loading || !cart.items.length">
        {{ loading ? 'Đang gửi...' : 'Xác nhận đặt hàng' }}
      </button>
    </form>
    <aside class="card summary">
      <h2>Tóm tắt</h2>
      <p v-for="item in cart.items" :key="item.id">
        {{ item.name }} × {{ item.quantity }}
        <span>{{ formatVnd(item.price * item.quantity) }}</span>
      </p>
      <strong>Tổng {{ formatVnd(cart.total) }}</strong>
    </aside>
  </section>
</template>

<style scoped>
.checkout {
  grid-template-columns: 1.4fr 0.8fr;
  align-items: start;
}
.form,
.summary {
  padding: 24px;
}
.summary p {
  display: flex;
  justify-content: space-between;
}
@media (max-width: 800px) {
  .checkout {
    grid-template-columns: 1fr;
  }
}
</style>
