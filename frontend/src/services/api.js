const BASE_URL =
  (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function setAuthToken(token) {
  apiToken = token;
}

let apiToken = null;

function authHeaders() {
  return apiToken ? { Authorization: `Bearer ${apiToken}` } : {};
}

// Auth
export const AuthAPI = {
  async register(payload) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  async login(email, password) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async me() {
    return request('/auth/me', { headers: { ...authHeaders() } });
  }
};

// Restaurants & Menu
export const RestaurantAPI = {
  async list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/restaurants?${query}`);
  },
  async get(id) {
    return request(`/restaurants/${id}`);
  },
  async menu(id) {
    return request(`/restaurants/${id}/menu`);
  }
};

// Cart
export const CartAPI = {
  async get() {
    return request('/cart', { headers: { ...authHeaders() } });
  },
  async add(menuItemId, quantity = 1) {
    return request('/cart', {
      method: 'POST',
      headers: { ...authHeaders() },
      body: JSON.stringify({ menuItemId, quantity })
    });
  },
  async updateItem(id, quantity) {
    return request(`/cart/item/${id}`, {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: JSON.stringify({ quantity })
    });
  },
  async deleteItem(id) {
    return request(`/cart/item/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    });
  }
};

// Orders
export const OrdersAPI = {
  async create() {
    return request('/orders', { method: 'POST', headers: { ...authHeaders() } });
  },
  async list() {
    return request('/orders', { headers: { ...authHeaders() } });
  },
  async get(id) {
    return request(`/orders/${id}`, { headers: { ...authHeaders() } });
  },
  async tracking(id) {
    return request(`/orders/${id}/tracking`, { headers: { ...authHeaders() } });
  }
};

// Admin
export const AdminAPI = {
  async listOrders() {
    return request('/admin/orders', { headers: { ...authHeaders() } });
  },
  async updateOrderStatus(id, status) {
    return request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { ...authHeaders() },
      body: JSON.stringify({ status })
    });
  }
};