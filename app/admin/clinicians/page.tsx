"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "@/components/admin-sidebar"
import { UserCheck, Star, Plus, Eye, Bell, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const mockClinicians = [
    { id: "1", name: "Dr. Oluwaseun Adeyemi", role: "Doctor", specialty: "Gen Med", patients: 156, points: 2450, rating: 4.9, status: "active" },
    { id: "2", name: "Nurse Amaka", role: "Nurse", patients: 89, points: 1850, rating: 4.8, status: "active" },
    { id: "3", name: "Dr. Amara Obi", role: "Doctor", specialty: "Cardiology", patients: 132, points: 2180, rating: 4.8, status: "busy" },
    { id: "4", name: "Dr. Chidinma Nwosu", role: "Doctor", specialty: "Dermatology", patients: 98, points: 1920, rating: 4.7, status: "active" }
]

export default function AdminCliniciansPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/clinicians" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Clinician Management</h1>
                                <p className="text-sm text-muted-foreground">Manage doctors and nurses across the platform</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                className="rounded-xl bg-primary hidden sm:flex"
                                onClick={() => toast({ title: "Add Clinician", description: "Clinician registration form would open here" })}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Clinician
                            </Button>
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
                                { label: "Total Clinicians", value: "48", icon: UserCheck },
                                { label: "Doctors", value: "28", icon: UserCheck },
                                { label: "Nurses", value: "20", icon: UserCheck },
                                { label: "Avg Rating", value: "4.8", icon: Star }
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
                            <div className="mb-6">
                                <Input placeholder="Search clinicians..." className="max-w-md rounded-xl" />
                            </div>
                            <div className="space-y-3">
                                {mockClinicians.map((c) => (
                                    <div key={c.id} className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {c.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{c.name}</p>
                                                <p className="text-sm text-muted-foreground">{c.role}{c.specialty && ` • ${c.specialty}`}</p>
                                                <p className="text-xs text-muted-foreground">{c.patients} patients • {c.points} points</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="text-sm font-medium">{c.rating}</span>
                                            </div>
                                            <span className={cn("w-2 h-2 rounded-full", c.status === "active" ? "bg-green-500" : "bg-amber-500")} />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="rounded-xl"
                                                onClick={() => toast({ title: `Viewing ${c.name}`, description: `${c.role} profile with ${c.patients} patients` })}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
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
