import { getBooks, searchBooks } from '../api/books'

export async function loadBookList(keyword = '') {
  const q = String(keyword || '').trim()
  if (!q) return { books: await getBooks(), notice: '' }
  try {
    return { books: await searchBooks(q), notice: '' }
  } catch {
    const all = await getBooks()
    const needle = q.toLowerCase()
    const books = all.filter((book) => {
      const author = book.author?.name?.toLowerCase() || ''
      const cats = (book.categories || []).map((c) => c.name.toLowerCase()).join(' ')
      return `${book.name} ${author} ${cats}`.toLowerCase().includes(needle)
    })
    return { books, notice: 'API tìm kiếm chưa ổn định, đang lọc trên danh sách GET /api/books.' }
  }
}

export function applyCatalogFilters(books, { categoryId, minPrice, maxPrice, sort } = {}) {
  let list = [...books]
  const cat = Number(categoryId || 0)
  if (cat) list = list.filter((book) => (book.categories || []).some((c) => c.id === cat))
  const min = Number(minPrice)
  const max = Number(maxPrice)
  if (Number.isFinite(min) && min > 0) list = list.filter((book) => Number(book.price) >= min)
  if (Number.isFinite(max) && max > 0) list = list.filter((book) => Number(book.price) <= max)

  if (sort === 'price-asc') list.sort((a, b) => Number(a.price) - Number(b.price))
  else if (sort === 'price-desc') list.sort((a, b) => Number(b.price) - Number(a.price))
  else if (sort === 'newest') list.sort((a, b) => Number(b.id) - Number(a.id))
  else if (sort === 'oldest') list.sort((a, b) => Number(a.id) - Number(b.id))
  return list
}

export function paginate(list, page = 1, pageSize = 8) {
  const total = list.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), pages)
  const start = (current - 1) * pageSize
  return {
    items: list.slice(start, start + pageSize),
    page: current,
    pages,
    total,
  }
}
