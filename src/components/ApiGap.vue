<script setup>
defineProps({
  title: { type: String, default: 'Backend chưa có API' },
  apis: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="gap">
    <strong>{{ title }}</strong>
    <p v-if="!$slots.default">Giao diện đã có, dữ liệu đang lưu tạm trên trình duyệt hoặc chỉ minh họa.</p>
    <slot />
    <ul v-if="apis.length">
      <li v-for="api in apis" :key="api">{{ api }}</li>
    </ul>
  </div>
</template>

<style scoped>
.gap {
  background: #fff8e6;
  border: 1px solid #f0d9a0;
  color: #7a5b12;
  border-radius: 4px;
  padding: 12px 14px;
  margin: 0 0 16px;
  font-size: 0.9rem;
}
ul {
  margin: 8px 0 0;
  padding-left: 18px;
}
p {
  margin: 6px 0 0;
}
</style>
