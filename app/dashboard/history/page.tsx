"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { PatientSidebar } from "@/components/patient-sidebar"
import {
    History as HistoryIcon,
    Bell,
    Settings,
    LogOut,
    Menu,
    Home,
    MessageSquare,
    Calendar,
    FileText,
    Pill,
    Activity,
    Download,
    ChevronRight,
    Clock,
    User,
} from "lucide-react"

interface HistoryItem {
    id: string
    type: "consultation" | "prescription" | "test" | "diagnosis"
    title: string
    doctor: string
    date: string
    description: string
    status?: string
}

const mockHistory: HistoryItem[] = [
    {
        id: "1",
        type: "consultation",
        title: "General Checkup",
        doctor: "Dr. Oluwaseun Adeyemi",
        date: "Nov 28, 2025",
        description: "Routine health checkup. Blood pressure normal, recommended continued medication.",
    },
    {
        id: "2",
        type: "prescription",
        title: "Paracetamol 500mg",
        doctor: "Dr. Oluwaseun Adeyemi",
        date: "Nov 28, 2025",
        description: "Take one tablet every 6 hours after meals for headache relief.",
        status: "Active",
    },
    {
        id: "3",
        type: "test",
        title: "Blood Test Results",
        doctor: "Dr. Amara Obi",
        date: "Nov 15, 2025",
        description: "Complete blood count - All values within normal range.",
        status: "Normal",
    },
    {
        id: "4",
        type: "diagnosis",
        title: "Tension Headache",
        doctor: "Dr. Oluwaseun Adeyemi",
        date: "Nov 10, 2025",
        description: "Diagnosed with tension-type headache. Prescribed medication and lifestyle modifications.",
    },
    {
        id: "5",
        type: "consultation",
        title: "Follow-up Appointment",
        doctor: "Dr. Chidinma Nwosu",
        date: "Oct 22, 2025",
        description: "Follow-up for skin condition. Significant improvement noted.",
    },
]

const typeStyles = {
    consultation: { gradient: "from-primary/20 to-primary/10", icon: User, color: "text-primary" },
    prescription: { gradient: "from-accent/20 to-accent/10", icon: Pill, color: "text-accent" },
    test: { gradient: "from-kliniq-cyan/20 to-kliniq-cyan/10", icon: Activity, color: "text-kliniq-cyan" },
    diagnosis: { gradient: "from-green-500/20 to-green-500/10", icon: FileText, color: "text-green-500" },
}

export default function HistoryPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [filter, setFilter] = useState<"all" | "consultation" | "prescription" | "test" | "diagnosis">("all")

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredHistory = mockHistory.filter((item) => filter === "all" || item.type === filter)

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex max-w-full overflow-x-hidden">
            <PatientSidebar activePath="/dashboard/history" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen max-w-full">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Medical History</h1>
                                <p className="text-sm text-muted-foreground">Your complete healthcare timeline</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-xl bg-transparent">
                                <Download className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Filters */}
                    <div className="flex items-center gap-2 p-1.5 bg-secondary/30 rounded-xl mb-6 overflow-x-auto">
                        {(["all", "consultation", "prescription", "test", "diagnosis"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap",
                                    filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="relative space-y-6">

                        {filteredHistory.map((item, index) => {
                            const style = typeStyles[item.type]
                            const Icon = style.icon

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-16"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-0 top-0">
                                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center", style.gradient)}>
                                            <Icon className={cn("w-6 h-6", style.color)} />
                                        </div>
                                    </div>

                                    {/* Content card */}
                                    <div className="group p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                                        <div className="relative">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                                        {item.status && (
                                                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                                                                {item.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-primary">{item.doctor}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    {item.date}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                            <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                                                View Details
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {filteredHistory.length === 0 && (
                        <div className="text-center py-12">
                            <HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No history found</h3>
                            <p className="text-sm text-muted-foreground">
                                {filter === "all" ? "Your medical history will appear here" : `No ${filter} records found`}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
