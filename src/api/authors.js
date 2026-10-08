import { api, unwrap } from './client'

export async function getAuthors() {
  return unwrap(await api('/api/authors')) || []
}

export async function getAuthor(id) {
  return unwrap(await api(`/api/authors/${id}`))
}

export async function createAuthor(body) {
  return unwrap(
    await api('/api/authors', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  )
}

export async function updateAuthor(id, body) {
  return unwrap(
    await api(`/api/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  )
}

export async function deleteAuthor(id) {
  return api(`/api/authors/${id}`, { method: 'DELETE' })
}

export async function restoreAuthor(id) {
  return api(`/api/authors/${id}/restore`, { method: 'POST' })
}

export async function forceDeleteAuthor(id) {
  return api(`/api/authors/${id}/force`, { method: 'DELETE' })
}
