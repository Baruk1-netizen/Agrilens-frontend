/*
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle, Leaf } from "lucide-react"

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void
}

export const ForgotPasswordForm = ({ onSwitchToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsEmailSent(true)
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center"
      >
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-full w-fit mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Check Your Email</h2>
          <p className="text-gray-300 mb-4 text-sm">
            We've sent a password reset link to <span className="text-emerald-400 font-medium">{email}</span>
          </p>
          <p className="text-xs text-gray-400">
            Didn't receive the email? Check your spam folder or try again in a few minutes.
          </p>
        </div>

        <button
          onClick={onSwitchToLogin}
          className="flex items-center justify-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-2 rounded-lg">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            AgriLens
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-400 text-sm">Enter your email to receive a password reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                error ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </motion.button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={onSwitchToLogin}
          className="flex items-center justify-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </motion.div>
  )
}
export default ForgotPasswordForm
*/