// lib/api.ts
import axios, { AxiosResponse } from 'axios'


// API Configuration
const API_BASE_URL = 'https://54.162.85.230'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  authProvider: 'local' | 'google'
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface Diagnosis {
  id: string
  disease: string
  cropsAffected: string[]
  affectedAreas: string[]
  symptoms: string[]
  recommendedAction: string
  confidenceScore: number
  createdAt: string
}

export interface ApiError {
  error: string
}

// API Service Class
class AgriLensAPI {
  private token: string | null = null
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
  })

  constructor() {
    // Set up request interceptor to add auth token
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Set up response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken()
          // Redirect to login or handle authentication error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('agrilens_token')
            localStorage.removeItem('agrilens_user')
          }
        }
        return Promise.reject(error)
      }
    )

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('agrilens_token')
      if (savedToken) {
        this.token = savedToken
      }
    }
  }

  // Token management
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrilens_token', token)
      //reload window
      window.location.reload()
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrilens_token')
      localStorage.removeItem('agrilens_user')
      window.location.reload()
    }
  }

  getToken(): string | null {
    return this.token
  }

  // User management
  saveUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrilens_user', JSON.stringify(user))
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('agrilens_user')
      return savedUser ? JSON.parse(savedUser) : null
    }
    return null
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.axiosInstance.get('/health')
    return response.data
  }

  // Authentication endpoints
  async signup(data: SignupData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.axiosInstance.post('/signup', data)
    const { token, user } = response.data
    this.setToken(token)
    this.saveUser(user)
    return response.data
  }

  async signupWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.axiosInstance.post('/signup/google', {
      googleToken
    })
    const { token, user } = response.data
    this.setToken(token)
    this.saveUser(user)
    return response.data
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.axiosInstance.post('/login', data)
    const { token, user } = response.data
    this.setToken(token)
    this.saveUser(user)
    return response.data
  }

  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.axiosInstance.post('/login/google', {
      googleToken
    })
    const { token, user } = response.data
    this.setToken(token)
    this.saveUser(user)
    return response.data
  }

  // Diagnosis endpoints
  async diagnosePlant(imageFile: File): Promise<Diagnosis> {
    const formData = new FormData()
    formData.append('images', imageFile)

    const response: AxiosResponse<Diagnosis> = await this.axiosInstance.post('/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async getDiagnosisHistory(): Promise<Diagnosis[]> {
    const response: AxiosResponse<Diagnosis[]> = await this.axiosInstance.get('/diagnoses')
    return response.data
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.clearToken()
  }
}

// Create singleton instance
export const apiService = new AgriLensAPI()

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// React Hook for API state management (import React useState)
import { useState } from 'react'

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const handleError = (error: any) => {
    const message = handleApiError(error)
    setError(message)
  }

  return { error, clearError, handleError }
}

// File validation utility
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please select a valid image file (JPG, PNG, or WEBP)' }
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'Image file must be less than 10MB' }
  }

  return { isValid: true }
}

export default apiService