<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    router.push(route.query.redirect || '/')
  } catch (err) {
    error.value = err.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <div class="card panel">
      <div class="logo">BS</div>
      <h1>Đăng nhập</h1>
      <p class="muted">Hầu hết API backend yêu cầu JWT, nên bạn cần đăng nhập trước khi xem sách.</p>
      <form class="grid" @submit.prevent="submit">
        <label class="field">
          <span>Email</span>
          <input v-model="form.email" type="email" required />
        </label>
        <label class="field">
          <span>Mật khẩu</span>
          <input v-model="form.password" type="password" minlength="6" maxlength="20" required />
        </label>
        <p v-if="error" class="alert">{{ error }}</p>
        <button class="btn" :disabled="loading">{{ loading ? 'Đang vào...' : 'Đăng nhập' }}</button>
      </form>
      <p class="muted">
        Chưa có tài khoản?
        <RouterLink to="/register">Đăng ký</RouterLink>
      </p>
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
h1 {
  margin: 4px 0 8px;
}
form {
  margin: 20px 0;
}
</style>
