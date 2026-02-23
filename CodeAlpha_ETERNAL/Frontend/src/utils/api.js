// API base URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      return userData.token || null
    } catch (error) {
      return null
    }
  }
  return null
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => ({ message: 'An error occurred' }))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  // Return the full response object for auth endpoints, or just data for others
  return data
}

// Watch API functions
export const getWatches = async (params = {}) => {
  const queryParams = new URLSearchParams()
  
  if (params.category) queryParams.append('category', params.category)
  if (params.search) queryParams.append('search', params.search)
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.page) queryParams.append('page', params.page)
  if (params.limit) queryParams.append('limit', params.limit)

  const queryString = queryParams.toString()
  const endpoint = `/watches${queryString ? `?${queryString}` : ''}`
  
  const response = await apiRequest(endpoint)
  // Backend returns { success: true, data: [...], count, total }
  return Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : [])
}

export const getWatchById = async (id) => {
  const response = await apiRequest(`/watches/${id}`)
  return response.data || response
}

export const addWatch = async (watch) => {
  const response = await apiRequest('/watches', {
    method: 'POST',
    body: JSON.stringify(watch)
  })
  return response.data || response
}

export const updateWatch = async (id, updates) => {
  const response = await apiRequest(`/watches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  })
  return response.data || response
}

export const deleteWatch = async (id) => {
  await apiRequest(`/watches/${id}`, {
    method: 'DELETE'
  })
  return true
}

// Auth API functions
export const registerUser = async (name, email, password) => {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  })
  return response
}

export const loginUser = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  return response
}

export const getCurrentUser = async () => {
  return await apiRequest('/auth/me')
}
