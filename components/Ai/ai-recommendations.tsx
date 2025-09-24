"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Download,
  Share2,
  AlertCircle,
  Power,
  PowerOff,
} from "lucide-react"
import { useChat, apiService } from "../../lib/api_service"
import { AuthModal } from "../Auth/auth-modal"

function AIRecommendations() {
  const [isMounted, setIsMounted] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const {
    messages,
    isConnected,
    isTyping,
    error,
    currentSessionId,
    startChat,
    sendMessage,
    endChat,
    clearError,
  } = useChat()

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isMounted && apiService.isAuthenticated() && !isConnected && !currentSessionId) {
      handleStartChat()
    }
  }, [isMounted, isConnected, currentSessionId])

  const formatTime = (date: Date) => {
    if (!isMounted) return "00:00:00"
    return date.toLocaleTimeString()
  }

  const handleStartChat = async () => {
    try {
      clearError()
      await startChat()
    } catch (error) {
      console.error("Failed to start chat:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return

    const messageToSend = inputMessage.trim()
    setInputMessage("")

    try {
      await sendMessage(messageToSend)
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleEndChat = async () => {
    try {
      await endChat()
    } catch (error) {
      console.error("Failed to end chat:", error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()
      setIsRecording(true)

      mediaRecorder.ondataavailable = (event) => {
        console.log("Audio data available:", event.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        handleVoiceMessage()
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const handleVoiceMessage = async () => {
    const voiceText = "Voice message: Asked about pest control methods"
    setInputMessage(voiceText)
  }

  const downloadChatHistory = () => {
    const chatData = {
      sessionId: currentSessionId,
      messages: messages,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(chatData, null, 2)
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `agrilens-chat-${
      currentSessionId?.split("_")[1] || Date.now()
    }.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const shareChat = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AgriLens AI Chat",
          text: "Check out my conversation with AgriLens AI assistant",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      const shareText = `AgriLens AI Chat Session\n\n${messages
        .map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`)
        .join("\n\n")}`

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText)
        alert("Chat copied to clipboard!")
      }
    }
  }

  if (!apiService.isAuthenticated()) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-4">
            Please log in to access the AI chat assistant and get personalized
            recommendations based on your diagnosis history.
          </p>

          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
          >
            Go to Login
          </button>

       {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialView="login" />
      
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6" >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Chat Assistant</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-emerald-100 text-sm">
                    Personalized farming advice based on your diagnosis history
                  </p>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-300" : "bg-red-300"
                    }`}
                  />
                  <span className="text-emerald-100 text-xs">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isConnected ? (
                <button
                  onClick={handleEndChat}
                  className="bg-red-500/20 p-2 rounded-lg text-white hover:bg-red-500/30 transition-colors"
                  title="End Chat Session"
                >
                  <PowerOff className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleStartChat}
                  className="bg-green-500/20 p-2 rounded-lg text-white hover:bg-green-500/30 transition-colors"
                  title="Start New Chat Session"
                >
                  <Power className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={downloadChatHistory}
                disabled={messages.length === 0}
                className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 transition-colors disabled:opacity-50"
                title="Download Chat History"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={shareChat}
                disabled={messages.length === 0}
                className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 transition-colors disabled:opacity-50"
                title="Share Chat"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 m-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-200 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content */}
        <div className="h-96 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Chat Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.length === 0 && !isConnected ? (
                <div className="text-center text-gray-400 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Start a new chat session to begin</p>
                  <button
                    onClick={handleStartChat}
                    className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                  >
                    Start Chat
                  </button>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.timestamp.toString() ?? index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                          message.role === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-emerald-500"
                              : "bg-slate-700"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.role === "user"
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-800 text-gray-300 border border-emerald-500/20"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70" >
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-full bg-slate-700">
                          <Bot className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="bg-slate-800 border border-emerald-500/20 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-emerald-500/20 p-4">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Ask about your crops, diseases, or treatment recommendations..."
                      disabled={isTyping}
                      className="w-full bg-slate-800 border border-emerald-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-slate-800 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                    disabled={isTyping}
                  >
                    {isRecording ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Please start a chat session to send messages.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIRecommendations
