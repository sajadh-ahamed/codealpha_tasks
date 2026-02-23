import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage
    const saved = localStorage.getItem('user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password)
      if (response.success && response.user) {
        const userData = {
          ...response.user,
          token: response.token
        }
        setUser(userData)
        return { success: true, user: userData }
      }
      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await registerUser(name, email, password)
      if (response.success && response.user) {
        const userData = {
          ...response.user,
          token: response.token
        }
        setUser(userData)
        return { success: true, user: userData }
      }
      return { success: false, error: 'Registration failed' }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
