<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="account-grid">
    <nav class="account-nav">
      <RouterLink to="/account/profile">Thông tin cá nhân</RouterLink>
      <RouterLink to="/account/password">Đổi mật khẩu</RouterLink>
      <RouterLink to="/account/addresses">Địa chỉ nhận hàng</RouterLink>
      <RouterLink to="/orders">Đơn hàng của tôi</RouterLink>
    </nav>
    <div>
      <RouterView />
    </div>
  </div>
</template>
