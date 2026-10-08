const AUTH_KEY = 'bookshop.auth'

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function api(path, options = {}) {
  const auth = getStoredAuth()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (auth?.token) {
    headers.Authorization = `${auth.type || 'Bearer'} ${auth.token}`
  }

  const res = await fetch(path, { ...options, headers })
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (res.status === 401 && !path.includes('/api/auth/')) {
    const isErrorDispatch = data && typeof data === 'object' && data.path === '/error'
    if (!isErrorDispatch) {
      localStorage.removeItem(AUTH_KEY)
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (Array.isArray(data?.response) ? data.response.join(', ') : '') ||
      `Yêu cầu thất bại (${res.status})`
    const error = new Error(message)
    error.status = res.status
    error.payload = data
    throw error
  }

  return data
}

export function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'response' in payload) {
    return payload.response
  }
  return payload
}
