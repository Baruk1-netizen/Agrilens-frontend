"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"


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
          {/* Backdrop Overlay with proper centering and margins */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-1"
            onClick={handleClose}
          >
            {/* Modal - centered with equal margins all around */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-y-auto max-h-[90vh] mt-135 scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* Internet Explorer 10+ */
              }}
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

              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthModal