"use client"

import { motion } from "framer-motion"
import { Upload, ArrowRight, Sprout, Zap, Shield, BarChart3 } from "lucide-react"

export const HeroSection = () => {
  const scrollToUpload = () => {
    console.log('HeroSection: Attempting to scroll to upload area');
    
    // Try multiple selectors for robustness
    const selectors = ['#upload', '#upload-text', '[data-upload-area]'];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`HeroSection: Found element with selector: ${selector}`);
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
        return;
      }
    }
    
    console.log('HeroSection: No upload element found, trying fallback');
    // Fallback: scroll to a reasonable position
    window.scrollTo({
      top: window.innerHeight * 1.5,
      behavior: 'smooth'
    });
  };

  const scrollToHowItWorks = () => {
    console.log('HeroSection: Attempting to scroll to how it works section');
    
    const element = document.getElementById('how-it-works');
    if (element) {
      console.log('HeroSection: Found how-it-works element');
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      console.log('HeroSection: How It Works section not found, trying fallback');
      // Fallback: scroll to a reasonable position
      window.scrollTo({
        top: window.innerHeight * 2,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2"
            >
              <Sprout className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">AI-Powered Crop Health</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-white">Detect Crop</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Diseases
              </span>
              <br />
              <span className="text-white">Instantly</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Upload a photo of your crops and get instant AI-powered disease detection, treatment recommendations, and
              preventive measures to maximize your harvest.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToUpload}
              >
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </motion.button>

              <motion.button
                className="border-2 border-emerald-500 text-emerald-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-500 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToHowItWorks}
              >
                <span>Learn More</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">99%</div>
                <div className="text-gray-400 text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">{"<"}3s</div>
                <div className="text-gray-400 text-sm">Detection Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">50+</div>
                <div className="text-gray-400 text-sm">Diseases</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: Zap,
                title: "Instant Diagnosis",
                description: "Get immediate results with our advanced AI model trained on thousands of crop images",
              },
              {
                icon: Shield,
                title: "Treatment Plans",
                description: "Receive personalized treatment recommendations and preventive measures",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description: "Monitor your crop health over time with detailed analytics and insights",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
export default HeroSection