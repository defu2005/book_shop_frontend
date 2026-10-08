<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = reactive({
  username: '',
  email: '',
  password: '',
})
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register({ ...form, roles: ['ROLE_USER'] })
    await auth.login(form.email, form.password)
    router.push('/')
  } catch (err) {
    const extra = Array.isArray(err.payload?.response) ? `: ${err.payload.response.join(', ')}` : ''
    error.value = `${err.message}${extra}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <div class="card panel">
      <div class="logo">BS</div>
      <h1>Đăng ký khách hàng</h1>
      <form class="grid" @submit.prevent="submit">
        <label class="field">
          <span>Tên đăng nhập (6–20 ký tự)</span>
          <input v-model="form.username" minlength="6" maxlength="20" required />
        </label>
        <label class="field">
          <span>Email</span>
          <input v-model="form.email" type="email" required />
        </label>
        <label class="field">
          <span>Mật khẩu (6–20 ký tự)</span>
          <input v-model="form.password" type="password" minlength="6" maxlength="20" required />
        </label>
        <p v-if="error" class="alert">{{ error }}</p>
        <button class="btn" :disabled="loading">{{ loading ? 'Đang tạo...' : 'Đăng ký' }}</button>
      </form>
      <p class="muted">Đã có tài khoản? <RouterLink to="/login">Đăng nhập</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f4f4f4;
}
.panel {
  width: min(440px, 100%);
  padding: 32px;
}
.logo {
  width: 64px;
  height: 64px;
  border: 2px solid #222;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  margin-bottom: 12px;
}
</style>
