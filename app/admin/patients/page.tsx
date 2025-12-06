"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Users, TrendingUp, Activity, Bell, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

const mockPatients = [
    { id: "1", name: "Adebayo Okafor", age: 34, condition: "Hypertension", lastVisit: "2 days ago", status: "stable" },
    { id: "2", name: "Chioma Eze", age: 28, condition: "Diabetes", lastVisit: "1 week ago", status: "monitoring" },
    { id: "3", name: "Ibrahim Mohammed", age: 45, condition: "Asthma", lastVisit: "3 days ago", status: "stable" },
    { id: "4", name: "Ngozi Okoro", age: 52, condition: "Arthritis", lastVisit: "5 days ago", status: "treatment" }
]

export default function AdminPatientsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/patients" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Patient Management</h1>
                                <p className="text-sm text-muted-foreground">View and manage all patients across the system</p>
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
                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                { label: "Total Patients", value: "1,247", icon: Users },
                                { label: "Active Cases", value: "892", icon: Activity },
                                { label: "Growth", value: "+12%", icon: TrendingUp }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-card border border-border/50"
                                >
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
                            <h2 className="text-lg font-semibold text-foreground mb-6">Recent Patients</h2>
                            <div className="space-y-3">
                                {mockPatients.map((patient) => (
                                    <div key={patient.id} className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {patient.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{patient.name}</p>
                                                <p className="text-sm text-muted-foreground">{patient.age} years • {patient.condition}</p>
                                                <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${patient.status === "stable" ? "bg-green-500/10 text-green-500" :
                                            patient.status === "monitoring" ? "bg-blue-500/10 text-blue-500" :
                                                "bg-amber-500/10 text-amber-500"
                                            }`}>
                                            {patient.status}
                                        </span>
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
