import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const KEY = 'bookshop.account'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export const useAccountStore = defineStore('account', () => {
  const saved = load()
  const profile = ref(saved.profile || { fullName: '', phone: '' })
  const addresses = ref(saved.addresses || [])
  const payments = ref(saved.payments || [])
  const publishers = ref(saved.publishers || [])

  function persist() {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        profile: profile.value,
        addresses: addresses.value,
        payments: payments.value,
        publishers: publishers.value,
      }),
    )
  }

  const defaultAddress = computed(
    () => addresses.value.find((row) => row.isDefault) || addresses.value[0] || null,
  )

  function saveProfile(next) {
    profile.value = { ...profile.value, ...next }
    persist()
  }

  function upsertAddress(row) {
    if (row.id) {
      addresses.value = addresses.value.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    } else {
      const id = Date.now()
      addresses.value.push({ ...row, id })
      row.id = id
    }
    if (row.isDefault) {
      addresses.value = addresses.value.map((item) => ({ ...item, isDefault: item.id === row.id }))
    }
    persist()
  }

  function removeAddress(id) {
    addresses.value = addresses.value.filter((item) => item.id !== id)
    persist()
  }

  function addPayment(row) {
    payments.value.unshift({ id: Date.now(), createdAt: new Date().toISOString(), ...row })
    persist()
  }

  function upsertPublisher(row) {
    if (row.id) {
      publishers.value = publishers.value.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    } else {
      publishers.value.push({ ...row, id: Date.now() })
    }
    persist()
  }

  function removePublisher(id) {
    publishers.value = publishers.value.filter((item) => item.id !== id)
    persist()
  }

  return {
    profile,
    addresses,
    payments,
    publishers,
    defaultAddress,
    saveProfile,
    upsertAddress,
    removeAddress,
    addPayment,
    upsertPublisher,
    removePublisher,
  }
})
