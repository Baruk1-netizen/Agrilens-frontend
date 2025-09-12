// lib/api.ts
import axios, { AxiosResponse } from 'axios'
import { io, Socket } from 'socket.io-client'

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://agrilens-backend-docker.onrender.com'

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

// WebSocket Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  sessionId: string
  createdAt: string
  lastActivity: string
  messageCount: number
  lastMessage: string
}

export interface ApiError {
  error: string
}

// API Service Class
class AgriLensAPI {
  private token: string | null = null
  private socket: Socket | null = null
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
      this.disconnectChat()
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

  // WebSocket Chat Methods
  connectChat(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (!this.token) {
        reject(new Error('No authentication token available'))
        return
      }

      if (this.socket && this.socket.connected) {
        resolve(this.socket)
        return
      }

      this.socket = io(API_BASE_URL, {
        auth: {
          token: this.token
        },
        transports: ['websocket', 'polling']
      })

      this.socket.on('connect', () => {
        console.log('Connected to chat server')
        resolve(this.socket!)
      })

      this.socket.on('connect_error', (error) => {
        console.error('Chat connection error:', error)
        reject(error)
      })

      this.socket.on('disconnect', () => {
        console.log('Disconnected from chat server')
      })
    })
  }

  disconnectChat() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  async startChatSession(): Promise<{ sessionId: string; message: string }> {
    const socket = await this.connectChat()
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for chat session start'))
      }, 10000)

      socket.once('chat_started', (data) => {
        clearTimeout(timeout)
        resolve(data)
      })

      socket.once('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })

      socket.emit('start_chat')
    })
  }

  async sendChatMessage(sessionId: string, message: string): Promise<void> {
    const socket = await this.connectChat()
    socket.emit('chat_message', { sessionId, message })
  }

  // Event listeners for chat
  onMessageReceived(callback: (message: ChatMessage) => void): () => void {
    if (!this.socket) return () => {}

    const messageHandler = (data: any) => {
      callback({
        role: data.role,
        content: data.content,
        timestamp: new Date(data.timestamp)
      })
    }

    this.socket.on('message_received', messageHandler)
    return () => this.socket?.off('message_received', messageHandler)
  }

  onAIResponse(callback: (message: ChatMessage) => void): () => void {
    if (!this.socket) return () => {}

    const responseHandler = (data: any) => {
      callback({
        role: data.role,
        content: data.content,
        timestamp: new Date(data.timestamp)
      })
    }

    this.socket.on('ai_response', responseHandler)
    return () => this.socket?.off('ai_response', responseHandler)
  }

  onChatError(callback: (error: { message: string }) => void): () => void {
    if (!this.socket) return () => {}

    this.socket.on('error', callback)
    return () => this.socket?.off('error', callback)
  }

  async getChatSessions(): Promise<ChatSession[]> {
    const response: AxiosResponse<ChatSession[]> = await this.axiosInstance.get('/chat/sessions')
    return response.data
  }

  async getChatHistory(sessionId: string): Promise<{ sessionId: string; messages: ChatMessage[] }> {
    const response = await this.axiosInstance.get(`/chat/sessions/${sessionId}`)
    return response.data
  }

  async endChatSession(sessionId: string): Promise<void> {
    const socket = await this.connectChat()
    socket.emit('end_chat', { sessionId })
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

// Chat Hook for managing chat state
export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startChat = async () => {
    try {
      setError(null)
      const { sessionId, message } = await apiService.startChatSession()
      setCurrentSessionId(sessionId)
      setMessages([{
        role: 'assistant',
        content: message,
        timestamp: new Date()
      }])
      setIsConnected(true)

      // Set up event listeners
      const cleanupMessageReceived = apiService.onMessageReceived((message) => {
        setMessages(prev => [...prev, message])
      })

      const cleanupAIResponse = apiService.onAIResponse((message) => {
        setMessages(prev => [...prev, message])
        setIsTyping(false)
      })

      const cleanupError = apiService.onChatError((error) => {
        setError(error.message)
        setIsTyping(false)
      })

      // Return cleanup function
      return () => {
        cleanupMessageReceived()
        cleanupAIResponse()
        cleanupError()
      }
    } catch (error) {
      setError(handleApiError(error))
      setIsConnected(false)
    }
  }

  const sendMessage = async (message: string) => {
    if (!currentSessionId || !message.trim()) return

    try {
      setError(null)
      setIsTyping(true)
      
      // Add user message immediately to UI
      // const userMessage: ChatMessage = {
      //   role: 'user',
      //   content: message,
      //   timestamp: new Date()
      // }
      // setMessages(prev => [...prev, userMessage])

      await apiService.sendChatMessage(currentSessionId, message)
    } catch (error) {
      setError(handleApiError(error))
      setIsTyping(false)
    }
  }

  const endChat = async () => {
    if (!currentSessionId) return

    try {
      await apiService.endChatSession(currentSessionId)
      setCurrentSessionId(null)
      setIsConnected(false)
      setMessages([])
    } catch (error) {
      setError(handleApiError(error))
    }
  }

  const clearError = () => setError(null)

  return {
    messages,
    isConnected,
    isTyping,
    error,
    currentSessionId,
    startChat,
    sendMessage,
    endChat,
    clearError
  }
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