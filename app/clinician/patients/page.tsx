"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { ClinicianSidebar } from "@/components/clinician-sidebar"
import {
    Users,
    Clock,
    ChevronRight,
    Bell,
    Settings,
    LogOut,
    Menu,
    Home,
    Calendar,
    Award,
    Search,
    Filter,
    Star,
    Eye,
    MessageSquare,
    Activity,
    AlertTriangle,
} from "lucide-react"

interface Patient {
    id: string
    name: string
    patientId: string
    age: number
    gender: string
    lastVisit: string
    status: "active" | "pending" | "completed"
    urgency: "low" | "medium" | "high"
    condition: string
    avatar: string
}

const mockPatients: Patient[] = [
    {
        id: "1",
        name: "Adebayo Ogundimu",
        patientId: "KLQ-2847",
        age: 45,
        gender: "Male",
        lastVisit: "2 days ago",
        status: "active",
        urgency: "medium",
        condition: "Tension headache",
        avatar: "AO",
    },
    {
        id: "2",
        name: "Chioma Eze",
        patientId: "KLQ-3921",
        age: 32,
        gender: "Female",
        lastVisit: "1 hour ago",
        status: "pending",
        urgency: "high",
        condition: "Chest pain",
        avatar: "CE",
    },
    {
        id: "3",
        name: "Ibrahim Musa",
        patientId: "KLQ-1573",
        age: 28,
        gender: "Male",
        lastVisit: "5 days ago",
        status: "completed",
        urgency: "low",
        condition: "Common cold",
        avatar: "IM",
    },
    {
        id: "4",
        name: "Funke Adeoye",
        patientId: "KLQ-4482",
        age: 51,
        gender: "Female",
        lastVisit: "1 day ago",
        status: "active",
        urgency: "medium",
        condition: "Arthritis",
        avatar: "FA",
    },
]

export default function PatientsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "completed">("all")

    useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        { icon: Home, label: "Dashboard", href: "/clinician" },
        { icon: Users, label: "Patients", href: "/clinician/patients", active: true, badge: 12 },
        { icon: Calendar, label: "Schedule", href: "/clinician/schedule" },
        { icon: Award, label: "Points", href: "/clinician/points", badge: "New" },
        { icon: Settings, label: "Settings", href: "/clinician/settings" },
    ]

    const filteredPatients = mockPatients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || patient.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const urgencyStyles = {
        low: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <ClinicianSidebar activePath="/clinician/patients" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">All Patients</h1>
                                <p className="text-sm text-muted-foreground">Manage and view patient records</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                        <div className="flex items-center gap-2 p-1.5 bg-secondary/30 rounded-xl">
                            {(["all", "active", "pending", "completed"] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                                        statusFilter === status
                                            ? "bg-card text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search patients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-card border-border/50 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Patient Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredPatients.map((patient, index) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative p-5 rounded-3xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
                            >
                                {patient.urgency === "high" && (
                                    <div className="absolute -top-px -left-px -right-px h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-t-3xl" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-lg">
                                        {patient.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground">{patient.name}</h3>
                                            <span
                                                className={cn(
                                                    "px-2 py-0.5 rounded-full text-xs font-medium border",
                                                    urgencyStyles[patient.urgency]
                                                )}
                                            >
                                                {patient.urgency}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{patient.patientId}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                            <span>{patient.age}y • {patient.gender}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {patient.lastVisit}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground mb-3">
                                            <Activity className="w-3 h-3 inline mr-1" />
                                            {patient.condition}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/clinician/patient/${patient.patientId}`}
                                                className="flex-1"
                                            >
                                                <Button size="sm" className="w-full rounded-xl">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </Link>
                                            <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredPatients.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No patients found</h3>
                            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
