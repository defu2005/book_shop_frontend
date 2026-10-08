import { api, unwrap } from './client'

export async function createOrder(body) {
  return unwrap(
    await api('/api/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  )
}

export async function getOrder(id) {
  return unwrap(await api(`/api/orders/${id}`))
}

export async function getOrdersByUser(userId) {
  return unwrap(await api(`/api/orders/user/${userId}`)) || []
}

export async function getAllOrders() {
  return unwrap(await api('/api/orders')) || []
}

export async function updateOrderStatus(id, status) {
  return unwrap(
    await api(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status),
    }),
  )
}

export async function deleteOrder(id) {
  return api(`/api/orders/${id}`, { method: 'DELETE' })
}
