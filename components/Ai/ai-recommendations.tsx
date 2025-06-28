"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Volume2,
  VolumeX,
  Download,
  Share2,
} from "lucide-react"

interface Recommendation {
  id: string
  type: "disease" | "treatment" | "prevention" | "general"
  title: string
  description: string
  confidence: number
  severity: "low" | "medium" | "high"
  actions: string[]
  timestamp: Date
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  isVoice?: boolean
}

export const AIRecommendations = () => {
  const [activeTab, setActiveTab] = useState<"recommendations" | "chat">("recommendations")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AgriLens AI assistant. I can help you with crop disease analysis, treatment recommendations, and farming advice. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const recommendations: Recommendation[] = [
    {
      id: "1",
      type: "disease",
      title: "Early Blight Detected",
      description:
        "Your tomato plants show signs of early blight (Alternaria solani). This fungal disease appears as dark spots with concentric rings on leaves.",
      confidence: 94,
      severity: "medium",
      actions: [
        "Remove affected leaves immediately",
        "Apply copper-based fungicide",
        "Improve air circulation",
        "Water at soil level to avoid wetting leaves",
      ],
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "treatment",
      title: "Recommended Treatment Plan",
      description: "Based on the detected early blight, here's a comprehensive treatment approach to save your crop.",
      confidence: 89,
      severity: "medium",
      actions: [
        "Spray with Bordeaux mixture every 7-10 days",
        "Apply organic neem oil in the evening",
        "Ensure proper plant spacing",
        "Monitor daily for new symptoms",
      ],
      timestamp: new Date(),
    },
    {
      id: "3",
      type: "prevention",
      title: "Prevention Strategy",
      description: "Prevent future outbreaks with these proactive measures for your tomato cultivation.",
      confidence: 96,
      severity: "low",
      actions: [
        "Use drip irrigation instead of overhead watering",
        "Apply mulch around plants",
        "Rotate crops annually",
        "Choose disease-resistant varieties",
      ],
      timestamp: new Date(),
    },
  ]

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Based on your description, it sounds like you might be dealing with a fungal infection. I recommend taking a clear photo of the affected area for more accurate analysis.",
      "That's a great question! For organic treatment options, you can try neem oil or copper-based fungicides. These are effective and environmentally friendly.",
      "The symptoms you're describing are common in this season. Make sure to maintain proper spacing between plants and avoid overhead watering.",
      "I'd be happy to help you create a treatment schedule. Can you tell me more about the current stage of your crop and the affected area size?",
      "Prevention is key! Consider implementing crop rotation and using disease-resistant varieties for your next planting season.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()
      setIsRecording(true)

      mediaRecorder.ondataavailable = (event) => {
        // Handle audio data here
        console.log("Audio data available:", event.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        // Process voice message
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

  const handleVoiceMessage = () => {
    const voiceMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: "Voice message: Asked about pest control methods",
      timestamp: new Date(),
      isVoice: true,
    }
    setChatMessages((prev) => [...prev, voiceMessage])

    // Simulate AI voice response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I heard your question about pest control. For organic pest management, I recommend using beneficial insects like ladybugs, applying diatomaceous earth, or using companion planting with marigolds.",
        timestamp: new Date(),
        isVoice: true,
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "disease":
        return AlertTriangle
      case "treatment":
        return Leaf
      case "prevention":
        return CheckCircle
      default:
        return Bot
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                <p className="text-emerald-100 text-sm">Crop Analysis & Recommendations</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="bg-white/20 p-2 rounded-lg text-white hover:bg-white/30 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "recommendations" ? "bg-white/20 text-white" : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "chat" ? "bg-white/20 text-white" : "text-emerald-100 hover:bg-white/10"
              }`}
            >
              Chat Assistant
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-96 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "recommendations" && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full overflow-y-auto p-6 space-y-4"
              >
                {recommendations.map((rec, index) => {
                  const IconComponent = getTypeIcon(rec.type)
                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800 border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{rec.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(rec.severity)}`}
                              >
                                {rec.severity.toUpperCase()}
                              </span>
                              <span className="text-emerald-400 text-sm">{rec.confidence}% confidence</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {rec.timestamp.toLocaleTimeString()}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{rec.description}</p>

                      <div className="space-y-2">
                        <h4 className="text-emerald-400 font-medium text-sm">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start space-x-2 text-gray-300 text-sm">
                              <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xs ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`p-2 rounded-full ${message.type === "user" ? "bg-emerald-500" : "bg-slate-700"}`}
                        >
                          {message.type === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-800 text-gray-300 border border-emerald-500/20"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                            {message.isVoice && (
                              <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
                              >
                                {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
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
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="border-t border-emerald-500/20 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask about your crops..."
                        className="w-full bg-slate-800 border border-emerald-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-slate-800 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
export default AIRecommendations