"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Calendar, Clock, CheckCircle2, XCircle, Bell, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function AdminAppointmentsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/appointments" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Appointments Overview</h1>
                                <p className="text-sm text-muted-foreground">System-wide appointment analytics</p>
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
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="grid gap-6 md:grid-cols-4">
                            {[
                                { label: "Total Today", value: "45", icon: Calendar }, { label: "Completed", value: "32", icon: CheckCircle2 },
                                { label: "Upcoming", value: "13", icon: Clock }, { label: "No-Shows", value: "2", icon: XCircle }
                            ].map((stat, idx) => (
                                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-card border border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <stat.icon className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-6 rounded-3xl bg-card border border-border/50">
                            <h2 className="text-lg font-semibold text-foreground mb-6">Recent Appointments</h2>
                            <div className="space-y-3">
                                {[
                                    { patient: "Adebayo O.", doctor: "Dr. Oluwaseun", time: "10:00 AM", status: "completed" },
                                    { patient: "Chioma E.", doctor: "Dr. Amara", time: "11:30 AM", status: "in-progress" },
                                    { patient: "Ibrahim M.", doctor: "Nurse Amaka", time: "2:00 PM", status: "upcoming" }
                                ].map((apt, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">{apt.patient}</p>
                                            <p className="text-sm text-muted-foreground">{apt.doctor} • {apt.time}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === "completed" ? "bg-green-500/10 text-green-500" :
                                            apt.status === "in-progress" ? "bg-blue-500/10 text-blue-500" :
                                                "bg-amber-500/10 text-amber-500"
                                            }`}>{apt.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
