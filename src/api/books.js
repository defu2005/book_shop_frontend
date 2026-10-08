import { api, unwrap } from './client'

export async function getBooks() {
  return unwrap(await api('/api/books')) || []
}

export async function getBook(id) {
  return unwrap(await api(`/api/books/${id}`))
}

export async function searchBooks(keyword) {
  const query = encodeURIComponent(keyword)
  return unwrap(await api(`/api/books/search?keyword=${query}`)) || []
}

export async function createBook(body) {
  return unwrap(
    await api('/api/books', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  )
}

export async function updateBook(id, body) {
  return unwrap(
    await api(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  )
}

export async function deleteBook(id) {
  return api(`/api/books/${id}`, { method: 'DELETE' })
}

export async function restoreBook(id) {
  return api(`/api/books/${id}/restore`, { method: 'POST' })
}

export async function forceDeleteBook(id) {
  return api(`/api/books/${id}/force`, { method: 'DELETE' })
}
