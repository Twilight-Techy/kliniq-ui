"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Calendar, Clock, CheckCircle2, XCircle, Menu, Search, Filter, X, User, Stethoscope, MapPin, FileText, Phone } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mockAppointments = [
    { id: "1", patient: "Adebayo Okafor", patientAge: 34, doctor: "Dr. Oluwaseun Adeyemi", specialty: "General Medicine", date: "Dec 9, 2025", time: "10:00 AM", duration: "30 min", status: "completed", type: "Check-up", location: "Room 101", notes: "Regular follow-up for hypertension management", phone: "+234 801 234 5678" },
    { id: "2", patient: "Chioma Eze", patientAge: 28, doctor: "Dr. Amara Obi", specialty: "Cardiology", date: "Dec 9, 2025", time: "11:30 AM", duration: "45 min", status: "in-progress", type: "Consultation", location: "Room 203", notes: "Diabetes monitoring and insulin adjustment", phone: "+234 802 345 6789" },
    { id: "3", patient: "Ibrahim Mohammed", patientAge: 45, doctor: "Nurse Amaka Okonkwo", specialty: "Critical Care", date: "Dec 9, 2025", time: "2:00 PM", duration: "30 min", status: "upcoming", type: "Follow-up", location: "Room 105", notes: "Asthma review and inhaler prescription renewal", phone: "+234 803 456 7890" },
    { id: "4", patient: "Ngozi Okoro", patientAge: 52, doctor: "Dr. Chidinma Nwosu", specialty: "Dermatology", date: "Dec 9, 2025", time: "3:30 PM", duration: "60 min", status: "upcoming", type: "Treatment", location: "Room 302", notes: "Skin allergy treatment session", phone: "+234 804 567 8901" },
    { id: "5", patient: "Emeka Nwankwo", patientAge: 38, doctor: "Dr. Oluwaseun Adeyemi", specialty: "General Medicine", date: "Dec 9, 2025", time: "9:00 AM", duration: "30 min", status: "completed", type: "Check-up", location: "Room 101", notes: "Malaria treatment follow-up", phone: "+234 805 678 9012" },
    { id: "6", patient: "Fatima Abubakar", patientAge: 29, doctor: "Dr. Amara Obi", specialty: "Cardiology", date: "Dec 9, 2025", time: "4:00 PM", duration: "45 min", status: "cancelled", type: "Consultation", location: "Room 203", notes: "Prenatal cardiac screening - rescheduled by patient", phone: "+234 806 789 0123" },
]

export default function AdminAppointmentsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in-progress" | "upcoming" | "cancelled">("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null)

    useEffect(() => setMounted(true), [])

    const filteredAppointments = mockAppointments.filter((apt) => {
        const matchesSearch = apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.type.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || apt.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-500/10 text-green-500"
            case "in-progress": return "bg-blue-500/10 text-blue-500"
            case "upcoming": return "bg-amber-500/10 text-amber-500"
            case "cancelled": return "bg-red-500/10 text-red-500"
            default: return "bg-secondary text-muted-foreground"
        }
    }

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
                                { label: "Total Today", value: "45", icon: Calendar },
                                { label: "Completed", value: "32", icon: CheckCircle2 },
                                { label: "Upcoming", value: "13", icon: Clock },
                                { label: "Cancelled", value: "2", icon: XCircle }
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
                            {/* Search and Filter Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-lg font-semibold text-foreground">All Appointments</h2>
                                <div className="flex items-center gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1 sm:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search appointments..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 w-full sm:w-64 rounded-xl"
                                        />
                                    </div>
                                    {/* Status Filter */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm"
                                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        >
                                            <Filter className="w-4 h-4" />
                                            <span className="hidden sm:inline">
                                                {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).replace("-", " ")}
                                            </span>
                                        </button>
                                        {showFilterDropdown && (
                                            <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                                                {[
                                                    { value: "all", label: "All Status" },
                                                    { value: "completed", label: "Completed" },
                                                    { value: "in-progress", label: "In Progress" },
                                                    { value: "upcoming", label: "Upcoming" },
                                                    { value: "cancelled", label: "Cancelled" },
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

                            {/* Appointments List */}
                            <div className="space-y-3">
                                {filteredAppointments.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No appointments found matching your criteria
                                    </div>
                                ) : (
                                    filteredAppointments.map((apt) => (
                                        <motion.div
                                            key={apt.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
                                            onClick={() => setSelectedAppointment(apt)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {apt.patient.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{apt.patient}</p>
                                                    <p className="text-sm text-muted-foreground">{apt.doctor} • {apt.specialty}</p>
                                                    <p className="text-xs text-muted-foreground">{apt.date} at {apt.time} • {apt.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-muted-foreground hidden sm:block">{apt.duration}</span>
                                                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(apt.status))}>
                                                    {apt.status.replace("-", " ")}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Appointment Details Modal */}
            <AnimatePresence>
                {selectedAppointment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedAppointment(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(selectedAppointment.status))}>
                                            {selectedAppointment.status.replace("-", " ")}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {selectedAppointment.type}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground">Appointment Details</h2>
                                    <p className="text-sm text-muted-foreground">{selectedAppointment.date} at {selectedAppointment.time}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedAppointment(null)}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Patient Info */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Patient</h3>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-lg">
                                        {selectedAppointment.patient.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-foreground">{selectedAppointment.patient}</p>
                                        <p className="text-sm text-muted-foreground">{selectedAppointment.patientAge} years old</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <Phone className="w-3 h-3" />
                                            {selectedAppointment.phone}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clinician Info */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Clinician</h3>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-500 font-bold text-lg">
                                        <Stethoscope className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{selectedAppointment.doctor}</p>
                                        <p className="text-sm text-muted-foreground">{selectedAppointment.specialty}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">Duration</p>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{selectedAppointment.duration}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">Location</p>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">{selectedAppointment.location}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h3>
                                <div className="p-4 rounded-xl bg-secondary/30">
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <p className="text-sm text-foreground">{selectedAppointment.notes}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button className="flex-1 rounded-xl bg-primary">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Reschedule
                                </Button>
                                <Button variant="outline" className="flex-1 rounded-xl bg-transparent">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contact
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
