"use client"

import { adminApi } from "@/lib/admin-api"

type AdminClinicianRow = {
    id: string
    name: string
    role: string
    specialty: string
    patients: number
    points: number
    rating: number
    status: string
    email: string
    phone: string
    location: string
    experience: string
    consultations: number
    nextAvailable: string
}

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "@/components/admin-sidebar"
import { UserCheck, Star, Plus, Eye, Menu, Search, Filter, X, Phone, Mail, MapPin, Calendar, Award, Users, Clock, Stethoscope } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"


export default function AdminCliniciansPage() {
    const [mockClinicians, setClinicians] = useState<AdminClinicianRow[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        adminApi
            .getClinicians()
            .then((res) => {
                if (cancelled) return
                setClinicians(
                    res.clinicians.map((c) => ({
                        id: c.id,
                        name: c.name,
                        role: c.role === "nurse" ? "Nurse" : "Doctor",
                        specialty: c.specialty ?? "—",
                        // The admin API reports consultations, not a live panel size.
                        patients: c.total_consultations,
                        points: c.points,
                        rating: c.rating ?? 0,
                        status: c.is_available ? "active" : (c.status ?? "offline"),
                        email: c.email,
                        phone: c.phone ?? "—",
                        location: "—",
                        experience:
                            c.years_of_experience != null ? `${c.years_of_experience} years` : "—",
                        consultations: c.total_consultations,
                        nextAvailable: c.is_available ? "Available now" : "—",
                    })),
                )
            })
            .catch((e) => { if (!cancelled) setLoadError(e?.message || "Could not load clinicians.") })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [])

    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "nurse">("all")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "busy">("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedClinician, setSelectedClinician] = useState<AdminClinicianRow | null>(null)
    const { toast } = useToast()

    useEffect(() => setMounted(true), [])

    const filteredClinicians = mockClinicians.filter((clinician) => {
        const matchesSearch = clinician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clinician.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === "all" || clinician.role.toLowerCase() === roleFilter
        const matchesStatus = statusFilter === "all" || clinician.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
    })

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
                                { label: "Doctors", value: "28", icon: Stethoscope },
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
                            {/* Search and Filter Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-lg font-semibold text-foreground">All Clinicians</h2>
                                <div className="flex items-center gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1 sm:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search clinicians..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 w-full sm:w-64 rounded-xl"
                                        />
                                    </div>
                                    {/* Role Filter */}
                                    <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
                                        {[
                                            { value: "all", label: "All" },
                                            { value: "doctor", label: "Doctors" },
                                            { value: "nurse", label: "Nurses" },
                                        ].map((option) => (
                                            <button
                                                type="button"
                                                key={option.value}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm transition-colors",
                                                    roleFilter === option.value
                                                        ? "bg-primary text-primary-foreground"
                                                        : "hover:bg-secondary text-foreground"
                                                )}
                                                onClick={() => setRoleFilter(option.value as typeof roleFilter)}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
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
                                                {statusFilter === "all" ? "Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                            </span>
                                        </button>
                                        {showFilterDropdown && (
                                            <div className="absolute top-full right-0 mt-2 w-36 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                                                {[
                                                    { value: "all", label: "All Status" },
                                                    { value: "active", label: "Active" },
                                                    { value: "busy", label: "Busy" },
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

                            {/* Clinician List */}
                            <div className="space-y-3">
                                {filteredClinicians.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No clinicians found matching your criteria
                                    </div>
                                ) : (
                                    filteredClinicians.map((c) => (
                                        <motion.div
                                            key={c.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
                                            onClick={() => setSelectedClinician(c)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{c.name}</p>
                                                    <p className="text-sm text-muted-foreground">{c.role} • {c.specialty}</p>
                                                    <p className="text-xs text-muted-foreground">{c.patients} patients • {c.points} points</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="text-sm font-medium">{c.rating}</span>
                                                </div>
                                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                                                    c.status === "active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {c.status}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="rounded-xl"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedClinician(c)
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Clinician Details Modal */}
            <AnimatePresence>
                {selectedClinician && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedClinician(null)}
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
                                        {selectedClinician.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">{selectedClinician.name}</h2>
                                        <p className="text-sm text-muted-foreground">{selectedClinician.role} • {selectedClinician.specialty}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                                                selectedClinician.status === "active" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {selectedClinician.status}
                                            </span>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-xs font-medium">{selectedClinician.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedClinician(null)}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-secondary/30 text-center">
                                    <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                                    <p className="text-lg font-bold text-foreground">{selectedClinician.patients}</p>
                                    <p className="text-xs text-muted-foreground">Patients</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30 text-center">
                                    <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                                    <p className="text-lg font-bold text-foreground">{selectedClinician.consultations}</p>
                                    <p className="text-xs text-muted-foreground">Consultations</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30 text-center">
                                    <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
                                    <p className="text-lg font-bold text-foreground">{selectedClinician.points}</p>
                                    <p className="text-xs text-muted-foreground">Points</p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Info</h3>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{selectedClinician.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{selectedClinician.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-foreground">{selectedClinician.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Experience</p>
                                    <p className="text-sm font-medium text-foreground">{selectedClinician.experience}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Specialty</p>
                                    <p className="text-sm font-medium text-foreground">{selectedClinician.specialty}</p>
                                </div>
                            </div>

                            {/* Next Available */}
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next Available</p>
                                        <p className="text-sm font-medium text-foreground">{selectedClinician.nextAvailable}</p>
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
