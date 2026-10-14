import { api, unwrap } from './client'

export async function getBooksPage(filters = {}) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value === '' || value === null || value === undefined) continue
    if (['categoryId', 'authorId', 'minPrice', 'maxPrice'].includes(key) && Number(value) === 0) continue
    params.set(key, String(value))
  }

  const query = params.toString()
  const result = unwrap(await api(`/api/books${query ? `?${query}` : ''}`))

  if (Array.isArray(result)) {
    return {
      content: result,
      number: 0,
      size: result.length,
      totalElements: result.length,
      totalPages: result.length ? 1 : 0,
    }
  }

  const content = Array.isArray(result?.content) ? result.content : []
  return {
    content,
    number: Number(result?.number) || 0,
    size: Number(result?.size) || content.length,
    totalElements: Number(result?.totalElements) || 0,
    totalPages: Number(result?.totalPages) || 0,
  }
}

export async function getBooks(filters = {}) {
  return (await getBooksPage(filters)).content
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
