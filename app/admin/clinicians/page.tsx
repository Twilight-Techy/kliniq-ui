"use client"

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

const mockClinicians = [
    { id: "1", name: "Dr. Oluwaseun Adeyemi", role: "Doctor", specialty: "General Medicine", patients: 156, points: 2450, rating: 4.9, status: "active", email: "oluwaseun@kliniq.com", phone: "+234 801 234 5678", location: "Lagos, Nigeria", experience: "12 years", consultations: 1847, nextAvailable: "Dec 10, 2025" },
    { id: "2", name: "Nurse Amaka Okonkwo", role: "Nurse", specialty: "Critical Care", patients: 89, points: 1850, rating: 4.8, status: "active", email: "amaka@kliniq.com", phone: "+234 802 345 6789", location: "Lagos, Nigeria", experience: "8 years", consultations: 945, nextAvailable: "Dec 9, 2025" },
    { id: "3", name: "Dr. Amara Obi", role: "Doctor", specialty: "Cardiology", patients: 132, points: 2180, rating: 4.8, status: "busy", email: "amara@kliniq.com", phone: "+234 803 456 7890", location: "Abuja, Nigeria", experience: "15 years", consultations: 2156, nextAvailable: "Dec 11, 2025" },
    { id: "4", name: "Dr. Chidinma Nwosu", role: "Doctor", specialty: "Dermatology", patients: 98, points: 1920, rating: 4.7, status: "active", email: "chidinma@kliniq.com", phone: "+234 804 567 8901", location: "Port Harcourt, Nigeria", experience: "10 years", consultations: 1234, nextAvailable: "Dec 9, 2025" },
    { id: "5", name: "Nurse Blessing Eze", role: "Nurse", specialty: "Pediatric Care", patients: 67, points: 1650, rating: 4.9, status: "active", email: "blessing@kliniq.com", phone: "+234 805 678 9012", location: "Kano, Nigeria", experience: "6 years", consultations: 756, nextAvailable: "Dec 10, 2025" },
    { id: "6", name: "Dr. Emeka Okafor", role: "Doctor", specialty: "Orthopedics", patients: 121, points: 2100, rating: 4.6, status: "busy", email: "emeka@kliniq.com", phone: "+234 806 789 0123", location: "Enugu, Nigeria", experience: "18 years", consultations: 2890, nextAvailable: "Dec 12, 2025" },
]

export default function AdminCliniciansPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<"all" | "doctor" | "nurse">("all")
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "busy">("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedClinician, setSelectedClinician] = useState<typeof mockClinicians[0] | null>(null)
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
