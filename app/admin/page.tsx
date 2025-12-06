"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Building2,
  Users,
  UserCheck,
  Calendar,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  PieChart,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Star,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Filter,
  Download,
  RefreshCw,
  Stethoscope,
  MessageSquare,
  Zap,
  Shield,
  Menu,
  X,
  Home,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  gradient: string
}

interface Clinician {
  id: string
  name: string
  role: "doctor" | "nurse"
  specialty?: string
  avatar: string
  status: "active" | "offline" | "busy"
  patients: number
  points: number
  rating: number
  lastActive: string
}

interface ChartData {
  label: string
  value: number
  color: string
}

const stats: StatCard[] = [
  {
    title: "Total Patients",
    value: "2,847",
    change: 12.5,
    changeLabel: "vs last month",
    icon: Users,
    gradient: "from-primary to-primary/70",
  },
  {
    title: "Active Clinicians",
    value: "48",
    change: 8.2,
    changeLabel: "vs last month",
    icon: UserCheck,
    gradient: "from-accent to-accent/70",
  },
  {
    title: "Consultations",
    value: "1,234",
    change: -3.1,
    changeLabel: "vs last month",
    icon: Stethoscope,
    gradient: "from-kliniq-cyan to-kliniq-cyan/70",
  },
  {
    title: "Revenue",
    value: "₦4.2M",
    change: 18.7,
    changeLabel: "vs last month",
    icon: CreditCard,
    gradient: "from-green-500 to-green-500/70",
  },
]

const clinicians: Clinician[] = [
  {
    id: "1",
    name: "Dr. Oluwaseun Adeyemi",
    role: "doctor",
    specialty: "General Practice",
    avatar: "OA",
    status: "active",
    patients: 156,
    points: 2450,
    rating: 4.9,
    lastActive: "Now",
  },
  {
    id: "2",
    name: "Dr. Amaka Okonkwo",
    role: "doctor",
    specialty: "Pediatrics",
    avatar: "AO",
    status: "busy",
    patients: 132,
    points: 2180,
    rating: 4.8,
    lastActive: "10 mins ago",
  },
  {
    id: "3",
    name: "Nurse Fatima Ibrahim",
    role: "nurse",
    avatar: "FI",
    status: "active",
    patients: 89,
    points: 1850,
    rating: 4.9,
    lastActive: "Now",
  },
  {
    id: "4",
    name: "Dr. Chukwuemeka Nwosu",
    role: "doctor",
    specialty: "Internal Medicine",
    avatar: "CN",
    status: "offline",
    patients: 178,
    points: 2890,
    rating: 4.7,
    lastActive: "2 hours ago",
  },
  {
    id: "5",
    name: "Nurse Blessing Eze",
    role: "nurse",
    avatar: "BE",
    status: "active",
    patients: 67,
    points: 1420,
    rating: 4.8,
    lastActive: "5 mins ago",
  },
]

const weeklyData: ChartData[] = [
  { label: "Mon", value: 65, color: "bg-primary" },
  { label: "Tue", value: 85, color: "bg-primary" },
  { label: "Wed", value: 72, color: "bg-primary" },
  { label: "Thu", value: 90, color: "bg-primary" },
  { label: "Fri", value: 78, color: "bg-primary" },
  { label: "Sat", value: 45, color: "bg-primary/60" },
  { label: "Sun", value: 30, color: "bg-primary/60" },
]

const departmentData: ChartData[] = [
  { label: "General Practice", value: 35, color: "bg-primary" },
  { label: "Pediatrics", value: 25, color: "bg-accent" },
  { label: "Internal Medicine", value: 20, color: "bg-kliniq-cyan" },
  { label: "OB/GYN", value: 12, color: "bg-green-500" },
  { label: "Others", value: 8, color: "bg-muted-foreground" },
]

const statusStyles = {
  active: "bg-green-500",
  busy: "bg-amber-500",
  offline: "bg-muted-foreground",
}

const statusLabels = {
  active: "Active",
  busy: "In Consultation",
  offline: "Offline",
}

const sidebarLinks = [
  { icon: Home, label: "Overview", href: "/admin", active: true },
  { icon: Users, label: "Patients", href: "/admin/patients" },
  { icon: UserCheck, label: "Clinicians", href: "/admin/clinicians" },
  { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: CreditCard, label: "Billing", href: "/admin/billing" },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "doctor" | "nurse">("all")
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredClinicians = clinicians.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || c.role === filterRole
    return matchesSearch && matchesRole
  })

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary/8 via-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-kliniq-cyan/8 via-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <AdminSidebar activePath="/admin" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">Dashboard Overview</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Welcome back, Administrator</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search - Hidden on mobile */}
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-secondary/50 border-transparent focus:border-primary/50 rounded-xl"
                  />
                </div>

                {/* Period Selector */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  {selectedPeriod}
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                <NotificationsDropdown />

                {/* Admin Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-3xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", stat.gradient)}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        stat.change >= 0
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400",
                      )}
                    >
                      {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.changeLabel}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Consultations Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-card border border-border/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Weekly Consultations</h2>
                    <p className="text-sm text-muted-foreground">Patient visits this week</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                      <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="flex items-end justify-between gap-3 h-48">
                  {weeklyData.map((day, index) => (
                    <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${day.value}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={cn(
                          "w-full rounded-t-xl transition-all duration-300 hover:opacity-80 cursor-pointer relative group",
                          day.color,
                        )}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.value} visits
                        </div>
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{day.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Department Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-3xl bg-card border border-border/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Department Distribution</h2>
                    <p className="text-sm text-muted-foreground">Consultations by specialty</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary text-sm">
                    <PieChart className="w-4 h-4" />
                    View Details
                  </button>
                </div>

                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={dept.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">{dept.label}</span>
                        <span className="text-muted-foreground">{dept.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.value}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          className={cn("h-full rounded-full", dept.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Clinicians */}
            <div className="space-y-6">
              {/* Subscription Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-white/20">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Premium Plan</h3>
                      <p className="text-xs text-white/70">Active subscription</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Clinician Seats</span>
                      <span className="text-white font-medium">48/50</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">API Calls</span>
                      <span className="text-white font-medium">12,456/20,000</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Storage</span>
                      <span className="text-white font-medium">8.2/10 GB</span>
                    </div>
                  </div>

                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl">
                    Upgrade Plan
                  </Button>
                </div>
              </motion.div>

              {/* Clinician List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="p-6 rounded-3xl bg-card border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Clinicians</h2>
                  <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-4">
                  {(["all", "doctor", "nurse"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilterRole(role)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                        filterRole === role
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
                      )}
                    >
                      {role === "all" ? "All" : role === "doctor" ? "Doctors" : "Nurses"}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clinicians..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary/30 border-transparent focus:border-primary/50 rounded-xl text-sm"
                  />
                </div>

                {/* Clinician Items */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredClinicians.map((clinician, index) => (
                    <motion.div
                      key={clinician.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="group p-3 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-sm text-primary">
                            {clinician.avatar}
                          </div>
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                              statusStyles[clinician.status],
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">{clinician.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {clinician.specialty || "Nursing"} · {clinician.patients} patients
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-medium">{clinician.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{clinician.points} pts</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4 rounded-xl bg-transparent">
                  View All Clinicians
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 rounded-3xl bg-card border border-border/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                <p className="text-sm text-muted-foreground">Latest actions across the platform</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  color: "text-green-500 bg-green-500/10",
                  title: "Dr. Oluwaseun verified triage summary",
                  time: "2 minutes ago",
                  patient: "Adebayo Ogundimu",
                },
                {
                  icon: MessageSquare,
                  color: "text-primary bg-primary/10",
                  title: "Nurse Fatima responded to patient query",
                  time: "15 minutes ago",
                  patient: "Chidinma Okafor",
                },
                {
                  icon: AlertCircle,
                  color: "text-amber-500 bg-amber-500/10",
                  title: "High urgency case escalated to doctor",
                  time: "32 minutes ago",
                  patient: "Emmanuel Adewale",
                },
                {
                  icon: Zap,
                  color: "text-accent bg-accent/10",
                  title: "AI generated triage summary",
                  time: "1 hour ago",
                  patient: "Fatima Ibrahim",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <div className={cn("p-2.5 rounded-xl", activity.color)}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">Patient: {activity.patient}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
