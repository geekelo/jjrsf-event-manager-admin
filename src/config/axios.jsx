import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL is not defined in your .env file.")
}

export const createAxiosInstance = () => {
  // Get the token from sessionStorage
  const token = sessionStorage.getItem("admin_token")
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      // Properly format the Authorization header with Bearer prefix if token exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
}

// Add a request interceptor to dynamically add the token
// This ensures the token is always up-to-date even for long-running sessions
export const axiosWithAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("admin_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle common errors
axiosWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear the invalid token
      sessionStorage.removeItem("admin_token")
      // Redirect to login page
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)
