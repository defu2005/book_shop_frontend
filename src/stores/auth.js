import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { signIn as signInApi, signUp as signUpApi } from '../api/auth'

const AUTH_KEY = 'bookshop.auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const isAuthenticated = computed(() => Boolean(user.value?.token))
  const isAdmin = computed(() => {
    const roles = user.value?.roles || []
    return roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')
  })

  function persist() {
    if (user.value) localStorage.setItem(AUTH_KEY, JSON.stringify(user.value))
    else localStorage.removeItem(AUTH_KEY)
  }

  function hydrate() {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      user.value = raw ? JSON.parse(raw) : null
    } catch {
      user.value = null
    }
  }

  async function login(email, password) {
    const data = await signInApi(email, password)
    user.value = {
      token: data.token,
      type: data.type || 'Bearer',
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles || [],
    }
    persist()
  }

  async function register(payload) {
    return signUpApi({
      ...payload,
      roles: payload.roles || ['ROLE_USER'],
    })
  }

  function logout() {
    user.value = null
    persist()
  }

  return { user, isAuthenticated, isAdmin, hydrate, login, register, logout }
})
