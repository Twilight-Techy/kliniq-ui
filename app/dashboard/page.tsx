"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { PatientSidebar } from "@/components/patient-sidebar"
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Calendar,
  User,
  Stethoscope,
  Clock,
  ChevronRight,
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Heart,
  Activity,
  FileText,
  Phone,
  Video,
  Bot,
  Volume2,
  Home,
  History,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isAudio?: boolean
}

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  type: "in-person" | "video"
  status: "upcoming" | "completed" | "cancelled"
}

interface LinkedHospital {
  id: string
  name: string
  location: string
  type: string
  departments: string[]
  linkedSince: string
  totalVisits: number
  rating: number
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Oluwaseun Adeyemi",
    specialty: "General Medicine",
    date: "Dec 5, 2025",
    time: "10:00 AM",
    type: "in-person",
    status: "upcoming",
  },
  {
    id: "2",
    doctor: "Dr. Amara Obi",
    specialty: "Cardiology",
    date: "Dec 12, 2025",
    time: "2:30 PM",
    type: "video",
    status: "upcoming",
  },
]

const mockHospitals: LinkedHospital[] = [
  {
    id: "1",
    name: "Lagos University Teaching Hospital",
    location: "Idi-Araba, Lagos",
    type: "Teaching Hospital",
    departments: ["General Medicine", "Cardiology", "Pediatrics", "Surgery"],
    linkedSince: "Jan 15, 2025",
    totalVisits: 12,
    rating: 4.8,
  },
  {
    id: "2",
    name: "National Hospital Abuja",
    location: "Central Business District, Abuja",
    type: "Federal Hospital",
    departments: ["Cardiology", "Neurology", "Orthopedics"],
    linkedSince: "Mar 20, 2025",
    totalVisits: 5,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Reddington Hospital",
    location: "Victoria Island, Lagos",
    type: "Private Hospital",
    departments: ["General Medicine", "Dermatology", "ENT"],
    linkedSince: "Aug 10, 2025",
    totalVisits: 3,
    rating: 4.9,
  },
]

const quickActions = [
  { icon: MessageSquare, label: "New Triage", color: "from-primary to-primary/80" },
  { icon: Calendar, label: "Request Appointment", color: "from-accent to-accent/80" },
  { icon: FileText, label: "Medical Records", color: "from-kliniq-cyan to-kliniq-cyan/80" },
  { icon: Phone, label: "Emergency", color: "from-destructive to-destructive/80" },
]

export default function PatientDashboard() {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "appointments" | "hospitals">("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Ẹ káàbọ̀! Welcome back, Adebayo. How can I help you today? You can ask me about your medications, previous consultations, or describe any symptoms you're experiencing.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null)
  const [showTranscript, setShowTranscript] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(inputValue),
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, aiResponse])
  }

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("headache") || lowerQuery.includes("head")) {
      return "I understand you're experiencing headaches. Based on Dr. Adeyemi's notes from your last visit, he recommended rest and hydration for mild headaches. If the pain is severe or persistent, I recommend booking a follow-up appointment. Would you like me to schedule one?"
    }
    if (lowerQuery.includes("medication") || lowerQuery.includes("pill") || lowerQuery.includes("drug")) {
      return "According to your records, Dr. Adeyemi prescribed Paracetamol 500mg - take one tablet every 6 hours as needed for pain. Remember to take it after eating, like after your morning pap. Do you need me to explain anything else about your medications?"
    }
    if (lowerQuery.includes("appointment") || lowerQuery.includes("book") || lowerQuery.includes("schedule")) {
      return "I can help you book an appointment! You have an upcoming visit with Dr. Adeyemi on December 5th at 10:00 AM. Would you like to reschedule this, or book a new appointment with a different specialist?"
    }
    return "I've noted your concern. To give you the best guidance, I'll flag this for the nursing team to review. In the meantime, if you're experiencing any severe symptoms, please don't hesitate to use the emergency contact feature. Is there anything else I can help clarify?"
  }

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true)
    } else {
      // Stop recording and send as audio message
      setIsRecording(false)

      const audioMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: "🎤 Voice message recorded",
        timestamp: new Date(),
        isAudio: true,
      }

      setMessages((prev) => [...prev, audioMessage])
      setIsTyping(true)

      // Simulate AI processing audio and responding
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've received your voice message. I'm analyzing it now... Based on what you've described, I recommend booking an appointment with Dr. Adeyemi. Would you like me to schedule that for you?",
          timestamp: new Date(),
        }
        setIsTyping(false)
        setMessages((prev) => [...prev, aiResponse])
      }, 1500)
    }
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: 3 },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: History, label: "History", href: "/dashboard/history" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex">
      <PatientSidebar activePath="/dashboard" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Good Morning, Adebayo</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">How are you feeling today?</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Notification Dropdown Panel */}
        <AnimatePresence>
          {showNotifications && (
            <div className="relative z-40">
              <div className="fixed inset-0" onClick={() => setShowNotifications(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-4 sm:right-6 top-2 w-80 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[
                    { title: "Appointment Reminder", message: "Dr. Adeyemi tomorrow at 10:00 AM", time: "1h ago", unread: true },
                    { title: "Prescription Ready", message: "Your medication is ready for pickup", time: "3h ago", unread: true },
                    { title: "Lab Results", message: "Blood test results are now available", time: "1d ago", unread: false },
                  ].map((notif, idx) => (
                    <div key={idx} className={cn("p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer", notif.unread && "bg-primary/5")}>
                      <div className="flex items-start gap-3">
                        {notif.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border/50">
                  <button className="w-full text-center text-sm text-primary hover:underline">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Emergency Contact Modal */}
        <AnimatePresence>
          {showEmergency && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEmergency(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-destructive/50 rounded-3xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-6 border-b border-border/50 bg-gradient-to-r from-destructive/10 to-destructive/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Emergency Contacts</h3>
                      <p className="text-sm text-muted-foreground">Get help immediately</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <a
                    href="tel:112"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-destructive flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Emergency Hotline</p>
                      <p className="text-2xl font-bold text-destructive">112</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-destructive group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="tel:+2348001234567"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Hospital Reception</p>
                      <p className="text-lg font-bold text-primary">+234 800 123 4567</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </a>

                  <button
                    onClick={() => window.location.href = "/dashboard/appointments"}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Schedule Urgent Appointment</span>
                  </button>
                </div>
                <div className="p-4 border-t border-border/50">
                  <button
                    onClick={() => setShowEmergency(false)}
                    className="w-full p-3 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (action.label === "New Triage") {
                    // Start a fresh triage session
                    setMessages([{
                      id: Date.now().toString(),
                      role: "assistant",
                      content: "Ẹ káàbọ̀! Welcome back, Adebayo. How can I help you today? You can ask me about your medications, previous consultations, or describe any symptoms you're experiencing.",
                      timestamp: new Date(),
                    }])
                    setActiveTab("chat")
                  } else if (action.label === "Medical Records") {
                    window.location.href = "/dashboard/history"
                  } else if (action.label === "Request Appointment") {
                    window.location.href = "/dashboard/appointments"
                  } else if (action.label === "Emergency") {
                    setShowEmergency(true)
                  }
                }}
                className="relative group p-5 rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div
                  className={cn(
                    "relative w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
                    action.color,
                  )}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="relative font-medium text-foreground">{action.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mb-6 p-1.5 bg-secondary/30 rounded-2xl w-fit">
            {[
              { id: "chat", label: "AI Assistant", icon: Bot },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "hospitals", label: "My Hospitals", icon: Stethoscope },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid lg:grid-cols-3 gap-6"
              >
                {/* Chat Area */}
                <div className="lg:col-span-2 flex flex-col bg-card rounded-3xl border border-border/50 overflow-hidden h-[600px]">
                  {/* Chat Header */}
                  <div className="flex items-center gap-4 p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Bot className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Kliniq AI Assistant</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Speaks Yoruba • Powered by N-ATLaS
                      </p>
                    </div>
                    <button className="ml-auto p-2 rounded-xl hover:bg-secondary transition-colors">
                      <Volume2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl",
                            message.role === "user"
                              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md"
                              : "bg-secondary/50 text-foreground rounded-bl-md",
                          )}
                        >
                          <div className="p-4">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.isAudio && (
                              <button
                                onClick={() => setShowTranscript(showTranscript === message.id ? null : message.id)}
                                className="mt-2 text-xs underline opacity-70 hover:opacity-100 transition-opacity"
                              >
                                {showTranscript === message.id ? "Hide Transcript" : "Show Transcript"}
                              </button>
                            )}
                            {message.isAudio && showTranscript === message.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pt-3 border-t border-primary-foreground/20"
                              >
                                <p className="text-xs opacity-70 mb-1">Transcribed:</p>
                                <p className="text-sm">"My head has been hurting since this morning"</p>
                              </motion.div>
                            )}
                            <p
                              className={cn(
                                "text-xs mt-2",
                                message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                              )}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-secondary/50 p-4 rounded-2xl rounded-bl-md">
                          <div className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-5 border-t border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleRecording}
                        className={cn(
                          "p-3 rounded-xl transition-all duration-300",
                          isRecording
                            ? "bg-destructive text-destructive-foreground animate-pulse"
                            : "bg-secondary hover:bg-secondary/80 text-muted-foreground",
                        )}
                      >
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <div className="flex-1 relative">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Type or speak your symptoms..."
                          className="h-12 bg-background/50 border-border/50 rounded-xl pr-12 focus:border-primary"
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 p-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      Kliniq AI will never diagnose. For emergencies, please contact your doctor directly.
                    </p>
                  </div>
                </div>

                {/* Health Summary Sidebar */}
                <div className="space-y-6">
                  {/* Consultation Recordings Widget */}
                  <div className="p-5 bg-card rounded-2xl border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Mic className="w-4 h-4 text-primary" />
                        Recordings
                      </h3>
                      <Link
                        href="/dashboard/consultations"
                        className="text-xs text-primary hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                    <button
                      onClick={() => window.location.href = "/dashboard/consultations"}
                      className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all mb-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">Start Recording</p>
                          <p className="text-xs text-muted-foreground">Record your consultation</p>
                        </div>
                      </div>
                    </button>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Recent Recordings</p>
                      <div className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => window.location.href = "/dashboard/consultations"}>
                        <p className="text-sm font-medium text-foreground truncate">General Checkup</p>
                        <p className="text-xs text-muted-foreground">Dec 5 • 15:32</p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => window.location.href = "/dashboard/consultations"}>
                        <p className="text-sm font-medium text-foreground truncate">Cardiac Follow-up</p>
                        <p className="text-xs text-muted-foreground">Nov 28 • 22:45</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Notes */}
                  <div className="p-5 bg-card rounded-2xl border border-border/50">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Latest Doctor Notes
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-1">Nov 28, 2025 • Dr. Adeyemi</p>
                        <p className="text-sm text-foreground">
                          Prescribed Paracetamol 500mg for headaches. Follow up in 2 weeks if symptoms persist.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-1">Nov 15, 2025 • Dr. Obi</p>
                        <p className="text-sm text-foreground">
                          Blood pressure normal. Continue current lifestyle modifications.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-5 bg-card rounded-2xl border border-border/50">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Health Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                        <Heart className="w-5 h-5 text-green-500 mb-2" />
                        <p className="text-lg font-bold text-foreground">72</p>
                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <Activity className="w-5 h-5 text-primary mb-2" />
                        <p className="text-lg font-bold text-foreground">120/80</p>
                        <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "appointments" && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Upcoming Appointments</h2>
                  <Button
                    onClick={() => window.location.href = "/dashboard/appointments"}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Request New
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {mockAppointments.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative p-5 bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              {apt.type === "video" ? (
                                <Video className="w-6 h-6 text-primary" />
                              ) : (
                                <User className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{apt.doctor}</h3>
                              <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                            {apt.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {apt.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              // Navigate to appointments page for rescheduling
                              window.location.href = "/dashboard/appointments"
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl bg-transparent"
                          >
                            Reschedule
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAppointment(selectedAppointment === apt.id ? null : apt.id)
                            }}
                            size="sm"
                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                          >
                            {apt.type === "video" ? (selectedAppointment === apt.id ? "Close" : "Join Call") : (selectedAppointment === apt.id ? "Close" : "View Details")}
                          </Button>
                        </div>

                        {/* Expandable Details */}
                        <AnimatePresence>
                          {selectedAppointment === apt.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border/50 space-y-2"
                            >
                              {apt.type === "video" ? (
                                <>
                                  <p className="text-sm font-medium text-foreground">Video Call Link</p>
                                  <button className="w-full p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center justify-center gap-2">
                                    <Video className="w-4 h-4" />
                                    Launch Video Call
                                  </button>
                                  <p className="text-xs text-muted-foreground">The call will start in your browser</p>
                                </>
                              ) : (
                                <>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="text-muted-foreground">Type</p>
                                      <p className="font-medium">In-Person</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Location</p>
                                      <p className="font-medium">Hospital Reception</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">Please arrive 10 minutes early</p>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "hospitals" && (
              <motion.div
                key="hospitals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">My Linked Hospitals</h2>
                  <Button
                    onClick={() => window.location.href = "/dashboard/appointments"}
                    variant="outline"
                    className="rounded-xl bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Link New Hospital
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockHospitals.map((hospital, index) => (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative p-5 bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                            <Stethoscope className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{hospital.name}</h3>
                            <p className="text-sm text-muted-foreground">{hospital.location}</p>
                            <p className="text-xs text-primary font-medium mt-1">{hospital.type}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-1 text-amber-500">
                            <span className="text-sm font-bold">{hospital.rating}</span>
                            <span className="text-xs">★</span>
                          </div>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{hospital.totalVisits} visits</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">Since {hospital.linkedSince}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {hospital.departments.slice(0, 3).map((dept) => (
                            <span key={dept} className="px-2 py-1 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                              {dept}
                            </span>
                          ))}
                          {hospital.departments.length > 3 && (
                            <span className="px-2 py-1 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                              +{hospital.departments.length - 3} more
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedHospital(selectedHospital === hospital.id ? null : hospital.id)}
                          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-secondary transition-colors text-sm text-muted-foreground"
                        >
                          <span>{selectedHospital === hospital.id ? "Hide Actions" : "View Actions"}</span>
                          <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", selectedHospital === hospital.id && "rotate-90")} />
                        </button>

                        {/* Expandable Actions */}
                        <AnimatePresence>
                          {selectedHospital === hospital.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border/50 space-y-2"
                            >
                              <button
                                onClick={() => window.location.href = "/dashboard/appointments"}
                                className="w-full p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-primary font-medium"
                              >
                                <Calendar className="w-4 h-4" />
                                Request Appointment
                              </button>
                              <button
                                onClick={() => window.location.href = "/dashboard/messages"}
                                className="w-full p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 font-medium"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Contact Hospital
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
