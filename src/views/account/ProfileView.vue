<script setup>
import { reactive } from 'vue'
import ApiGap from '../../components/ApiGap.vue'
import { useAccountStore } from '../../stores/account'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const account = useAccountStore()
const form = reactive({
  fullName: account.profile.fullName || '',
  phone: account.profile.phone || '',
})
const saved = reactive({ ok: false })

function save() {
  account.saveProfile(form)
  saved.ok = true
}
</script>

<template>
  <section class="card wrap">
    <h1>Thông tin cá nhân</h1>
    <ApiGap
      title="Chưa có API hồ sơ người dùng"
      :apis="['GET/PUT /api/users/me', 'Cập nhật username/email/số điện thoại']"
    />
    <p>Tài khoản JWT: <strong>{{ auth.user?.username }}</strong> — {{ auth.user?.email }}</p>
    <form class="grid" @submit.prevent="save">
      <label class="field">
        <span>Họ tên hiển thị</span>
        <input v-model="form.fullName" />
      </label>
      <label class="field">
        <span>Số điện thoại</span>
        <input v-model="form.phone" />
      </label>
      <p v-if="saved.ok" class="alert ok">Đã lưu tạm trên trình duyệt.</p>
      <button class="btn">Lưu</button>
    </form>
  </section>
</template>

<style scoped>
.wrap {
  padding: 24px;
}
form {
  max-width: 420px;
  margin-top: 12px;
}
</style>
