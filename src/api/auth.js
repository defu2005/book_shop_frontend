import { api, unwrap } from './client'

export async function signIn(email, password) {
  const payload = await api('/api/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return unwrap(payload)
}

export async function signUp({ username, email, password, roles }) {
  return api('/api/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, roles }),
  })
}
