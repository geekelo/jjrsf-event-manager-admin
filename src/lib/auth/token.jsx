export const getToken = () => {
  return sessionStorage.getItem("admin_token")
}

export const setToken = (token) => {
  sessionStorage.setItem("admin_token", token)
}

export const setUser = (user) => {
  sessionStorage.setItem("admin_user", JSON.stringify(user))
}

export const getUser = () => {
  const userStr = sessionStorage.getItem("admin_user")
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (e) {
      console.error("Error parsing user data:", e)
      return null
    }
  }
  return null
}

export const removeToken = () => {
  sessionStorage.removeItem("admin_token")
  sessionStorage.removeItem("admin_user")
}

export const isAuthenticated = () => {
  return !!getToken()
}

