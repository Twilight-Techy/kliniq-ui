"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { ClinicianSidebar } from "@/components/clinician-sidebar"
import {
    Calendar as CalendarIcon,
    Clock,
    Bell,
    Settings,
    LogOut,
    Menu,
    Home,
    Users,
    Award,
    ChevronLeft,
    ChevronRight,
    Plus,
    Video,
    User,
    Edit,
} from "lucide-react"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

interface Appointment {
    id: string
    patient: string
    time: string
    duration: number
    type: "in-person" | "video"
    status: "confirmed" | "pending"
}

const mockAppointments: Record<string, Appointment[]> = {
    Mon: [
        { id: "1", patient: "Adebayo O.", time: "09:00", duration: 30, type: "in-person", status: "confirmed" },
        { id: "2", patient: "Chioma E.", time: "14:00", duration: 45, type: "video", status: "confirmed" },
    ],
    Wed: [
        { id: "3", patient: "Ibrahim M.", time: "10:30", duration: 30, type: "in-person", status: "pending" },
    ],
    Fri: [
        { id: "4", patient: "Funke A.", time: "11:00", duration: 60, type: "in-person", status: "confirmed" },
    ],
}

export default function SchedulePage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentWeek, setCurrentWeek] = useState("Dec 2-8, 2025")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <ClinicianSidebar activePath="/clinician/schedule" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">My Schedule</h1>
                                <p className="text-sm text-muted-foreground">Manage availability</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button className="bg-gradient-to-r from-primary to-primary/80">
                                <Plus className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Add Slot</span>
                            </Button>
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Week Navigator */}
                    <div className="flex items-center justify-between mb-6">
                        <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-foreground">{currentWeek}</h2>
                        <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="rounded-3xl bg-card border border-border/50 overflow-hidden">
                        <div className="grid grid-cols-8 border-b border-border/50">
                            <div className="p-4 border-r border-border/50">
                                <span className="text-sm text-muted-foreground">Time</span>
                            </div>
                            {daysOfWeek.map((day) => (
                                <div key={day} className="p-4 border-r border-border/50 last:border-r-0 text-center">
                                    <span className="text-sm font-medium text-foreground">{day}</span>
                                    <p className="text-xs text-muted-foreground mt-1">Dec {daysOfWeek.indexOf(day) + 2}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-8">
                            {timeSlots.map((time, idx) => (
                                <div key={time} className="contents">
                                    <div className="p-3 border-r border-b border-border/50 bg-secondary/20">
                                        <span className="text-xs text-muted-foreground">{time}</span>
                                    </div>
                                    {daysOfWeek.map((day) => {
                                        const dayAppts = mockAppointments[day] || []
                                        const appt = dayAppts.find((a) => a.time === time)

                                        return (
                                            <div
                                                key={day}
                                                className="relative p-2 border-r border-b border-border/50 last:border-r-0 min-h-[60px] hover:bg-secondary/30 transition-colors cursor-pointer group"
                                            >
                                                {appt && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className={cn(
                                                            "p-2 rounded-xl text-xs",
                                                            appt.type === "video"
                                                                ? "bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30"
                                                                : "bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-1 mb-1">
                                                            {appt.type === "video" ? (
                                                                <Video className="w-3 h-3 text-accent" />
                                                            ) : (
                                                                <User className="w-3 h-3 text-primary" />
                                                            )}
                                                            <span className="font-medium text-foreground">{appt.patient}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{appt.duration}min</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Plus className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30" />
                            <span className="text-sm text-muted-foreground">In-Person</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30" />
                            <span className="text-sm text-muted-foreground">Video Call</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
