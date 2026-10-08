import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const CART_KEY = 'bookshop.cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  function persist() {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value))
  }

  function hydrate() {
    try {
      const raw = localStorage.getItem(CART_KEY)
      items.value = raw ? JSON.parse(raw) : []
    } catch {
      items.value = []
    }
  }

  hydrate()

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity * item.price, 0),
  )

  function add(book, quantity = 1) {
    const existing = items.value.find((item) => item.id === book.id)
    const stock = book.quantity ?? Infinity
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, stock)
    } else {
      items.value.push({
        id: book.id,
        name: book.name,
        price: book.price,
        stock: book.quantity,
        quantity: Math.min(quantity, stock),
      })
    }
    persist()
  }

  function setQuantity(id, quantity) {
    const item = items.value.find((row) => row.id === id)
    if (!item) return
    const max = item.stock ?? quantity
    item.quantity = Math.max(1, Math.min(quantity, max))
    persist()
  }

  function remove(id) {
    items.value = items.value.filter((item) => item.id !== id)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  function syncStock(books) {
    const map = new Map((books || []).map((book) => [book.id, book]))
    items.value = items.value.map((item) => {
      const book = map.get(item.id)
      if (!book) return { ...item, missing: true }
      return {
        ...item,
        name: book.name,
        price: book.price,
        stock: book.quantity,
        missing: false,
        quantity: Math.min(item.quantity, Math.max(1, book.quantity || 1)),
      }
    })
    persist()
  }

  const stockIssues = computed(() =>
    items.value.filter((item) => item.missing || item.stock === 0 || item.quantity > (item.stock ?? item.quantity)),
  )

  return { items, count, total, add, setQuantity, remove, clear, syncStock, stockIssues }
})
