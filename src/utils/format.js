export function formatVnd(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function statusLabel(status) {
  const map = {
    PENDING: 'Chờ xử lý',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang chuẩn bị',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Đã trả',
    REFUNDED: 'Đã hoàn tiền',
  }
  return map[status] || status || '—'
}

export const ORDER_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED']

export function canCancel(status) {
  return ['PENDING', 'CONFIRMED'].includes(status)
}

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
  'REFUNDED',
]

const DISCOUNTS = [36, 20, 20, 36, 20, 30]

/** Backend không có % giảm / ảnh bìa — chỉ dùng để hiển thị giống mockup. */
export function displayDiscount(book) {
  const id = Number(book?.id || 0)
  return DISCOUNTS[id % DISCOUNTS.length]
}

export function originalPrice(book) {
  const sale = Number(book?.price || 0)
  const percent = displayDiscount(book)
  return Math.round(sale / (1 - percent / 100) / 1000) * 1000
}

export function coverUrl(book) {
  const seed = encodeURIComponent(String(book?.id ?? book?.name ?? 'book'))
  return `https://picsum.photos/seed/bookshop-${seed}/400/560`
}
