<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const sent = ref(false)

function submit() {
  sent.value = true
}
</script>

<template>
  <div class="auth">
    <div class="card panel">
      <div class="logo">BS</div>
      <h1>Quên mật khẩu</h1>
      <p class="muted">Nhập email để nhận hướng dẫn đặt lại mật khẩu.</p>
      <div class="gap">Backend chưa có API quên mật khẩu / gửi email reset.</div>
      <form class="grid" @submit.prevent="submit">
        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" required />
        </label>
        <p v-if="sent" class="alert ok">Đã ghi nhận email (chỉ trên giao diện). Khi có API sẽ gửi link reset.</p>
        <button class="btn" type="submit">Gửi yêu cầu</button>
      </form>
      <p class="muted"><RouterLink to="/login">Quay lại đăng nhập</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
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
.gap {
  background: #fff8e6;
  border: 1px solid #f0d9a0;
  color: #7a5b12;
  padding: 10px 12px;
  margin: 12px 0;
  font-size: 0.9rem;
}
form {
  margin: 16px 0;
}
</style>
