const rawApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE = rawApiBase
  ? rawApiBase.replace(/\/$/, '').endsWith('/api')
    ? rawApiBase.replace(/\/$/, '')
    : `${rawApiBase.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('smartbus_token');
}

function setToken(token: string): void {
  localStorage.setItem('smartbus_token', token);
}

function removeToken(): void {
  localStorage.removeItem('smartbus_token');
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`🔵 API Request: ${options.method || 'GET'} ${API_BASE}${endpoint}`);
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log(`📨 Response Status: ${res.status}`);
    // Handle common status codes explicitly
    if (res.status === 401) {
      // Unauthenticated
      throw new Error('Authentication required');
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        console.error(`❌ API Error: ${data?.message || 'Request failed'}`);
        throw new Error(data?.message || `Request failed (${res.status})`);
      }
      console.log(`✅ API Success: ${JSON.stringify(data).substring(0, 100)}...`);
      return data;
    } else {
      // Non-JSON response (could be HTML error page)
      const text = await res.text();
      if (!res.ok) {
        console.error(`❌ API Error (non-json): ${text.substring(0, 200)}`);
        // Try to extract a meaningful message
        const match = text.match(/<title>(.*?)<\/title>/i);
        const message = match ? match[1] : `Request failed with status ${res.status}`;
        throw new Error(message);
      }
      // Return raw text for successful non-json responses
      return text as any;
    }
  } catch (error: any) {
    if (error instanceof TypeError) {
      console.error(`🚫 Network Error (Failed to fetch): ${error.message}`);
      console.error(`⚠️  Make sure backend is running on ${API_BASE}`);
      throw new Error(`Network error: Backend may not be running. Check console.`);
    }
    throw error;
  }
}

export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    
  getMe: () => apiRequest('/auth/me'),
  updateRole: (role: string) => apiRequest('/auth/me/role', { method: 'PATCH', body: JSON.stringify({ role }) }),

  // Profile
  getProfile: () => apiRequest('/profile'),

  createProfile: (data: any) =>
    apiRequest('/profile', { method: 'POST', body: JSON.stringify(data) }),

  updateProfile: (data: any) =>
    apiRequest('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Bus
  getBuses: () => apiRequest('/bus'),
  
  createBus: (data: any) =>
    apiRequest('/bus', { method: 'POST', body: JSON.stringify(data) }),

  // Attendance
  getAttendance: () => apiRequest('/attendance'),
  
  markAttendance: (data: { busId: string, status?: string }) =>
    apiRequest('/attendance', { method: 'POST', body: JSON.stringify(data) }),

  // Orders
  getOrders: () => apiRequest('/orders'),

  // Payment
  post: (endpoint: string, data: any) => 
    apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),

  createOrder: (data: { plan: string; price: number; paymentMethod: string }) =>
    apiRequest('/payment/cart', { method: 'POST', body: JSON.stringify(data) }),

  checkout: (orderId: string, data: { paymentMethod: string; lastFour?: string }) =>
    apiRequest(`/payment/checkout/${orderId}`, { method: 'POST', body: JSON.stringify(data) }),

  generateQR: (data: any) =>
    apiRequest('/payment/generate-qr', { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  getReviews: (role?: string) => 
    apiRequest(role ? `/reviews?role=${role}` : '/reviews'),

  getUserReviews: () =>
    apiRequest('/reviews/user/my-reviews'),

  createReview: (data: { rating: number; title: string; comment: string; role: string }) =>
    apiRequest('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  updateReview: (id: string, data: { rating?: number; title?: string; comment?: string }) =>
    apiRequest(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteReview: (id: string) =>
    apiRequest(`/reviews/${id}`, { method: 'DELETE' }),

};

export { getToken, setToken, removeToken };
