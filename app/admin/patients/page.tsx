"use client"

import { adminApi } from "@/lib/admin-api"

type AdminPatientRow = {
    id: string
    name: string
    age: number | string
    condition: string
    lastVisit: string
    status: string
    email: string
    phone: string
    location: string
    bloodType: string
    allergies: string
    nextAppointment: string
}

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Users, TrendingUp, Activity, Menu, Search, Filter, X, Phone, Mail, MapPin, Calendar, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function AdminPatientsPage() {
    const [mockPatients, setPatients] = useState<AdminPatientRow[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        adminApi
            .getPatients({ limit: 200 })
            .then((res) => {
                if (cancelled) return
                setPatients(
                    res.patients.map((pt) => {
                        const age = pt.date_of_birth
                            ? Math.floor(
                                  (Date.now() - new Date(pt.date_of_birth).getTime()) /
                                      (365.25 * 86_400_000),
                              )
                            : "—"
                        return {
                            id: pt.id,
                            name: pt.name,
                            age,
                            // Clinical detail is not exposed to hospital admins,
                            // so these read as unavailable rather than invented.
                            condition: "—",
                            lastVisit: "—",
                            status: pt.onboarding_completed ? "active" : "pending",
                            email: pt.email,
                            phone: pt.phone ?? "—",
                            location: [pt.city, pt.state].filter(Boolean).join(", ") || "—",
                            bloodType: pt.blood_type ?? "—",
                            allergies: "—",
                            nextAppointment: "—",
                        }
                    }),
                )
            })
            .catch((e) => { if (!cancelled) setLoadError(e?.message || "Could not load patients.") })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [])

    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "stable" | "monitoring" | "treatment">("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<AdminPatientRow | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredPatients = mockPatients.filter((patient) => {
        const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || patient.status === statusFilter
        return matchesSearch && matchesStatus
    })

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
                            {/* Search and Filter Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-lg font-semibold text-foreground">All Patients</h2>
                                <div className="flex items-center gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1 sm:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search patients..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 w-full sm:w-64 rounded-xl"
                                        />
                                    </div>
                                    {/* Filter */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm"
                                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        >
                                            <Filter className="w-4 h-4" />
                                            <span className="hidden sm:inline">
                                                {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                            </span>
                                        </button>
                                        {showFilterDropdown && (
                                            <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                                                {[
                                                    { value: "all", label: "All Status" },
                                                    { value: "stable", label: "Stable" },
                                                    { value: "monitoring", label: "Monitoring" },
                                                    { value: "treatment", label: "Treatment" },
                                                ].map((option) => (
                                                    <button
                                                        type="button"
                                                        key={option.value}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${statusFilter === option.value ? "text-primary font-medium" : "text-foreground"
                                                            }`}
                                                        onClick={() => {
                                                            setStatusFilter(option.value as typeof statusFilter)
                                                            setShowFilterDropdown(false)
                                                        }}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Patient List */}
                            <div className="space-y-3">
                                {filteredPatients.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No patients found matching your criteria
                                    </div>
                                ) : (
                                    filteredPatients.map((patient) => (
                                        <motion.div
                                            key={patient.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
                                            onClick={() => setSelectedPatient(patient)}
                                        >
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
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Patient Details Modal */}
            <AnimatePresence>
                {selectedPatient && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedPatient(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-xl">
                                        {selectedPatient.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">{selectedPatient.name}</h2>
                                        <p className="text-sm text-muted-foreground">{selectedPatient.age} years old</p>
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${selectedPatient.status === "stable" ? "bg-green-500/10 text-green-500" :
                                            selectedPatient.status === "monitoring" ? "bg-blue-500/10 text-blue-500" :
                                                "bg-amber-500/10 text-amber-500"
                                            }`}>
                                            {selectedPatient.status}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPatient(null)}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Info</h3>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{selectedPatient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{selectedPatient.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{selectedPatient.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Medical Info</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-secondary/30">
                                        <p className="text-xs text-muted-foreground mb-1">Condition</p>
                                        <p className="text-sm font-medium text-foreground">{selectedPatient.condition}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/30">
                                        <p className="text-xs text-muted-foreground mb-1">Blood Type</p>
                                        <p className="text-sm font-medium text-foreground">{selectedPatient.bloodType}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/30">
                                        <p className="text-xs text-muted-foreground mb-1">Allergies</p>
                                        <p className="text-sm font-medium text-foreground">{selectedPatient.allergies}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/30">
                                        <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
                                        <p className="text-sm font-medium text-foreground">{selectedPatient.lastVisit}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Next Appointment */}
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next Appointment</p>
                                        <p className="text-sm font-medium text-foreground">{selectedPatient.nextAppointment}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button className="flex-1 rounded-xl bg-primary">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contact
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-xl bg-transparent">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Schedule
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
