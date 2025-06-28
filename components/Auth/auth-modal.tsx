"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { ForgotPasswordForm } from "./forgot-password-form"

type AuthView = "login" | "signup" | "forgot-password"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: AuthView
}

export const AuthModal = ({ isOpen, onClose, initialView = "login" }: AuthModalProps) => {
  const [currentView, setCurrentView] = useState<AuthView>(initialView)

  const handleClose = () => {
    onClose()
    // Reset to login view when modal closes
    setTimeout(() => setCurrentView("login"), 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal - perfectly centered in viewport */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {currentView === "login" && (
                  <LoginForm
                    key="login"
                    onSwitchToSignup={() => setCurrentView("signup")}
                    onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
                    onClose={handleClose}
                  />
                )}
                {currentView === "signup" && (
                  <SignupForm key="signup" onSwitchToLogin={() => setCurrentView("login")} onClose={handleClose} />
                )}
                {currentView === "forgot-password" && (
                  <ForgotPasswordForm key="forgot-password" onSwitchToLogin={() => setCurrentView("login")} />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthModal