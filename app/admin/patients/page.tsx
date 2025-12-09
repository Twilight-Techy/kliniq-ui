"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Users, TrendingUp, Activity, Menu, Search, Filter, X, Phone, Mail, MapPin, Calendar, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const mockPatients = [
    { id: "1", name: "Adebayo Okafor", age: 34, condition: "Hypertension", lastVisit: "2 days ago", status: "stable", email: "adebayo@email.com", phone: "+234 801 234 5678", location: "Lagos, Nigeria", bloodType: "O+", allergies: "None", nextAppointment: "Dec 15, 2025" },
    { id: "2", name: "Chioma Eze", age: 28, condition: "Diabetes", lastVisit: "1 week ago", status: "monitoring", email: "chioma@email.com", phone: "+234 802 345 6789", location: "Abuja, Nigeria", bloodType: "A+", allergies: "Penicillin", nextAppointment: "Dec 12, 2025" },
    { id: "3", name: "Ibrahim Mohammed", age: 45, condition: "Asthma", lastVisit: "3 days ago", status: "stable", email: "ibrahim@email.com", phone: "+234 803 456 7890", location: "Kano, Nigeria", bloodType: "B+", allergies: "Dust", nextAppointment: "Dec 18, 2025" },
    { id: "4", name: "Ngozi Okoro", age: 52, condition: "Arthritis", lastVisit: "5 days ago", status: "treatment", email: "ngozi@email.com", phone: "+234 804 567 8901", location: "Port Harcourt, Nigeria", bloodType: "AB-", allergies: "Aspirin", nextAppointment: "Dec 20, 2025" },
    { id: "5", name: "Emeka Nwankwo", age: 38, condition: "Malaria", lastVisit: "1 day ago", status: "treatment", email: "emeka@email.com", phone: "+234 805 678 9012", location: "Enugu, Nigeria", bloodType: "O-", allergies: "None", nextAppointment: "Dec 11, 2025" },
    { id: "6", name: "Fatima Abubakar", age: 29, condition: "Pregnancy", lastVisit: "4 days ago", status: "monitoring", email: "fatima@email.com", phone: "+234 806 789 0123", location: "Kaduna, Nigeria", bloodType: "A-", allergies: "Latex", nextAppointment: "Dec 14, 2025" },
]

export default function AdminPatientsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "stable" | "monitoring" | "treatment">("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null)

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
