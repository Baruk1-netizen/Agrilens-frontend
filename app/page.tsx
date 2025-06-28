"use client"

import Footer from "@/components/Footer"
import HeroSection from "@/components/HeroSection"
import { NavBar } from "@/components/NavBar"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Camera, CheckCircle, Microscope, Sun, Droplets, BarChart3, Users, Shield, Star } from "lucide-react"
import AIRecommendations from "@/components/Ai/ai-recommendations"

// Internal Features Section (not exported)
const FeaturesSection = () => {
  const features = [
    {
      icon: Microscope,
      title: "Advanced AI Detection",
      description: "Our machine learning model can identify over 50 different crop diseases with 99% accuracy",
    },
    {
      icon: Camera,
      title: "Easy Image Upload",
      description: "Simply take a photo with your phone or upload from your gallery for instant analysis",
    },
    {
      icon: Sun,
      title: "Weather Integration",
      description: "Get weather-based recommendations to prevent future disease outbreaks",
    },
    {
      icon: Droplets,
      title: "Treatment Guidance",
      description: "Receive specific treatment plans including organic and chemical solutions",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your crop health trends and get insights to improve your farming practices",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Connect with agricultural experts for personalized advice and consultation",
    },
  ]

  return (
    <section id="features" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {" "}
              Smart Farming
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to keep your crops healthy and maximize your yield
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/40 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl w-fit mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Internal How It Works Section (not exported)
const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Upload Image",
      description: "Take a photo of your crop or upload an existing image from your device",
      icon: Upload,
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our advanced AI model analyzes the image to detect diseases and health issues",
      icon: Microscope,
    },
    {
      step: "03",
      title: "Get Results",
      description: "Receive instant diagnosis with confidence scores and detailed explanations",
      icon: CheckCircle,
    },
    {
      step: "04",
      title: "Treatment Plan",
      description: "Get personalized treatment recommendations and preventive measures",
      icon: Shield,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Get crop disease detection in four simple steps</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent z-0"></div>
              )}

              <div className="relative z-10">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-full w-fit mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-400 font-bold text-lg">{step.step}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Internal Upload Section (not exported)
const UploadSection = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <section id="upload" className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Upload Your Crop Image</h2>
          <p className="text-xl text-gray-300">Get instant disease detection and treatment recommendations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-800/50 backdrop-blur-sm border-2 border-dashed border-emerald-500/30 rounded-3xl p-12 text-center hover:border-emerald-500/50 transition-all duration-300"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            borderColor: dragActive ? "#10b981" : undefined,
            backgroundColor: dragActive ? "rgba(16, 185, 129, 0.1)" : undefined,
          }}
        >
          {uploadedImage ? (
            <div className="space-y-6">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Uploaded crop"
                className="max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Analysis Complete</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Healthy Tomato Plant</h3>
                <p className="text-gray-300 mb-4">No diseases detected. Your crop appears healthy!</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-emerald-400 font-semibold">Confidence</div>
                    <div className="text-white">98.5%</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-emerald-400 font-semibold">Processing Time</div>
                    <div className="text-white">2.3s</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
              >
                Upload Another Image
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-full w-fit mx-auto">
                <Upload className="h-12 w-12 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Drop your image here or click to browse</h3>
                <p className="text-gray-300 mb-6">Supports JPG, PNG, and WEBP files up to 10MB</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 cursor-pointer flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Choose File</span>
                  <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                </label>

                <button className="border-2 border-emerald-500 text-emerald-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-500 hover:text-white transition-all duration-200 flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Take Photo</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// Internal Testimonials Section (not exported)
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Organic Farmer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content:
        "AgriLens has revolutionized how I manage my crops. The instant disease detection saved my entire tomato harvest last season!",
      rating: 5,
    },
    {
      name: "Miguel Rodriguez",
      role: "Agricultural Consultant",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content:
        "The accuracy is incredible. I recommend AgriLens to all my clients. It's like having an expert agronomist in your pocket.",
      rating: 5,
    },
    {
      name: "Dr. Emily Chen",
      role: "Plant Pathologist",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content:
        "As a researcher, I'm impressed by the AI model's precision. It's a game-changer for sustainable agriculture.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-900 to-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">What Farmers Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of farmers who trust AgriLens for their crop health management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/40 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-emerald-500/20"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-emerald-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <NavBar />
      <HeroSection />

      {/* Content sections - internal components not exported */}
      <FeaturesSection />
      <HowItWorksSection />
      <UploadSection />
      <TestimonialsSection />
      <AIRecommendations />
      <Footer />
    </div>
  )
}

export default home
