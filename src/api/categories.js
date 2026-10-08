import { api, unwrap } from './client'

export async function getCategories() {
  return unwrap(await api('/api/categories')) || []
}

export async function getCategory(id) {
  return unwrap(await api(`/api/categories/${id}`))
}

export async function createCategory(body) {
  return unwrap(
    await api('/api/categories', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  )
}

export async function updateCategory(id, body) {
  return unwrap(
    await api(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  )
}

export async function deleteCategory(id) {
  return api(`/api/categories/${id}`, { method: 'DELETE' })
}

export async function restoreCategory(id) {
  return api(`/api/categories/${id}/restore`, { method: 'POST' })
}

export async function forceDeleteCategory(id) {
  return api(`/api/categories/${id}/force`, { method: 'DELETE' })
}
