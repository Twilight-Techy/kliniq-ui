"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { PatientSidebar } from "@/components/patient-sidebar"
import { useToast } from "@/hooks/use-toast"
import {
    Calendar as CalendarIcon,
    Clock,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    MessageSquare,
    History,
    Plus,
    Search,
    Filter,
    Video,
    MapPin,
    User,
    ChevronRight,
    Download,
    Edit,
    Trash2,
} from "lucide-react"

interface Appointment {
    id: string
    doctor: string
    specialty: string
    date: string
    time: string
    type: "in-person" | "video"
    status: "upcoming" | "completed" | "cancelled"
    location?: string
    notes?: string
}

const mockAppointments: Appointment[] = [
    {
        id: "1",
        doctor: "Dr. Oluwaseun Adeyemi",
        specialty: "General Medicine",
        date: "Dec 5, 2025",
        time: "10:00 AM",
        type: "in-person",
        status: "upcoming",
        location: "Lagos General Hospital",
        notes: "Bring previous test results",
    },
    {
        id: "2",
        doctor: "Dr. Amara Obi",
        specialty: "Cardiology",
        date: "Dec 12, 2025",
        time: "2:30 PM",
        type: "video",
        status: "upcoming",
    },
    {
        id: "3",
        doctor: "Dr. Chidinma Nwosu",
        specialty: "Dermatology",
        date: "Nov 28, 2025",
        time: "11:00 AM",
        type: "in-person",
        status: "completed",
        location: "Lagos General Hospital",
    },
    {
        id: "4",
        doctor: "Dr. Oluwaseun Adeyemi",
        specialty: "General Medicine",
        date: "Nov 15, 2025",
        time: "3:00 PM",
        type: "video",
        status: "completed",
    },
]

export default function AppointmentsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [appointments, setAppointments] = useState(mockAppointments)
    const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
    const [showBookModal, setShowBookModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredAppointments = appointments.filter((apt) => {
        const matchesFilter = filter === "all" || apt.status === filter
        const matchesSearch =
            apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleBookAppointment = () => {
        setShowBookModal(true)
    }

    const handleEditAppointment = (appointment: Appointment) => {
        setAppointmentToEdit(appointment)
        setShowEditModal(true)
    }

    const handleCancelAppointment = (appointmentId: string) => {
        const appointment = appointments.find(apt => apt.id === appointmentId)
        setAppointments(appointments.filter(apt => apt.id !== appointmentId))
        toast({
            title: "Appointment Cancelled",
            description: `Your appointment with ${appointment?.doctor} has been cancelled.`,
            variant: "destructive",
        })
    }

    const handleDownloadReport = (appointment: Appointment) => {
        // Show initial toast
        toast({
            title: "Preparing Download",
            description: `Generating report for ${appointment.doctor}...`,
        })

        // Simulate report generation and download
        setTimeout(() => {
            // Create a mock PDF blob (in real app, this would be actual PDF data)
            const reportContent = `
MEDICAL APPOINTMENT REPORT
==========================

Patient: Adebayo Ogundimu
Doctor: ${appointment.doctor}
Specialty: ${appointment.specialty}
Date: ${appointment.date}
Time: ${appointment.time}
Type: ${appointment.type === "video" ? "Video Consultation" : "In-Person Consultation"}
${appointment.location ? `Location: ${appointment.location}` : ''}

Summary:
This was a follow-up consultation regarding the patient's ongoing treatment plan.

Recommendations:
- Continue current medication
- Schedule follow-up in 2 weeks
- Monitor symptoms daily

Report generated on: ${new Date().toLocaleDateString()}
            `.trim()

            // Create blob and download
            const blob = new Blob([reportContent], { type: 'text/plain' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `medical-report-${appointment.date.replace(/\s/g, '-')}.txt`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            // Show success toast
            toast({
                title: "Download Complete",
                description: "Medical report has been downloaded successfully.",
            })
        }, 1000)
    }

    const handleToggleDetails = (appointmentId: string) => {
        setSelectedAppointment(selectedAppointment === appointmentId ? null : appointmentId)
    }

    const handleReschedule = (appointment: Appointment) => {
        setAppointmentToEdit(appointment)
        setShowRescheduleModal(true)
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex max-w-full overflow-x-hidden">
            <PatientSidebar activePath="/dashboard/appointments" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen max-w-full">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Appointments</h1>
                                <p className="text-sm text-muted-foreground">Manage your healthcare appointments</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button onClick={handleBookAppointment} className="bg-gradient-to-r from-primary to-primary/80 sm:px-4">
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">Book Appointment</span>
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
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                        <div className="flex items-center gap-2 p-1.5 bg-secondary/30 rounded-xl">
                            {(["all", "upcoming", "completed"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
                                        filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search appointments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-card border-border/50 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Appointments Grid */}
                    <div className="grid gap-4">
                        {filteredAppointments.map((apt, index) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative p-6 rounded-3xl bg-card border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center",
                                                apt.type === "video"
                                                    ? "bg-gradient-to-br from-accent/20 to-accent/10"
                                                    : "bg-gradient-to-br from-primary/20 to-primary/10"
                                            )}
                                        >
                                            {apt.type === "video" ? (
                                                <Video className="w-6 h-6 text-accent" />
                                            ) : (
                                                <User className="w-6 h-6 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-foreground text-lg">{apt.doctor}</h3>
                                                <span
                                                    className={cn(
                                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                                        apt.status === "upcoming"
                                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                            : apt.status === "completed"
                                                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                                                    )}
                                                >
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-primary mb-3">{apt.specialty}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {apt.date}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {apt.time}
                                                </span>
                                                {apt.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        {apt.location}
                                                    </span>
                                                )}
                                            </div>
                                            {apt.notes && (
                                                <p className="mt-3 text-sm text-muted-foreground italic">Note: {apt.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {apt.status === "upcoming" && (
                                            <>
                                                <button onClick={() => handleEditAppointment(apt)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                                                    <Edit className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button onClick={() => handleCancelAppointment(apt.id)} className="p-2 rounded-xl hover:bg-destructive/10 transition-colors">
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </button>
                                            </>
                                        )}
                                        {apt.status === "completed" && (
                                            <button onClick={() => handleDownloadReport(apt)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
                                                <Download className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {apt.status === "upcoming" && (
                                    <div className="relative mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                                        <Button
                                            onClick={() => handleToggleDetails(apt.id)}
                                            size="sm"
                                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                                        >
                                            {selectedAppointment === apt.id ? "Close" : (apt.type === "video" ? "Join Video Call" : "View Details")}
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <Button
                                            onClick={() => handleReschedule(apt)}
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 rounded-xl bg-transparent"
                                        >
                                            Reschedule
                                        </Button>
                                    </div>
                                )}

                                {/* Expandable Details */}
                                <AnimatePresence>
                                    {selectedAppointment === apt.id && apt.status === "upcoming" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-border/50 space-y-3"
                                        >
                                            {apt.type === "video" ? (
                                                <>
                                                    <p className="text-sm font-medium text-foreground">Video Call Link</p>
                                                    <button
                                                        onClick={() => toast({
                                                            title: "Launching Video Call",
                                                            description: "Opening video call in new window...",
                                                        })}
                                                        className="w-full p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Video className="w-4 h-4" />
                                                        Launch Video Call
                                                    </button>
                                                    <p className="text-xs text-muted-foreground">The call will start in your browser</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground mb-1">Type</p>
                                                            <p className="font-medium">In-Person</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground mb-1">Status</p>
                                                            <p className="font-medium capitalize">{apt.status}</p>
                                                        </div>
                                                        {apt.location && (
                                                            <div className="col-span-2">
                                                                <p className="text-muted-foreground mb-1">Location</p>
                                                                <p className="font-medium">{apt.location}</p>
                                                            </div>
                                                        )}
                                                        {apt.notes && (
                                                            <div className="col-span-2">
                                                                <p className="text-muted-foreground mb-1">Notes</p>
                                                                <p className="font-medium">{apt.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(apt.location || "Lagos General Hospital")}`
                                                            window.open(mapUrl, '_blank')
                                                        }}
                                                        className="w-full rounded-xl"
                                                        variant="outline"
                                                    >
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        Get Directions
                                                    </Button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {filteredAppointments.length === 0 && (
                        <div className="text-center py-12">
                            <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No appointments found</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                {filter === "all" ? "You haven't booked any appointments yet" : `No ${filter} appointments`}
                            </p>
                            <Button className="bg-gradient-to-r from-primary to-primary/80">
                                <Plus className="w-4 h-4 mr-2" />
                                Book Your First Appointment
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Book Appointment Modal */}
            <AnimatePresence>
                {showBookModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowBookModal(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl max-w-md w-full p-6 shadow-xl"
                        >
                            <h3 className="text-2xl font-bold text-foreground mb-2">Book New Appointment</h3>
                            <p className="text-muted-foreground mb-6">Schedule an appointment with your healthcare provider</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Select Doctor</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground">
                                        <option>Dr. Oluwaseun Adeyemi - General Medicine</option>
                                        <option>Dr. Amara Obi - Cardiology</option>
                                        <option>Dr. Chidinma Nwosu - Dermatology</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Appointment Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="px-4 py-3 rounded-xl border-2 border-primary bg-primary/10 text-primary font-medium">Video Call</button>
                                        <button className="px-4 py-3 rounded-xl border border-border hover:bg-secondary text-foreground">In-Person</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                                        <Input type="date" className="rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                        <Input type="time" className="rounded-xl" />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowBookModal(false)}>Cancel</Button>
                                    <Button
                                        className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80"
                                        onClick={() => {
                                            setShowBookModal(false)
                                            toast({
                                                title: "Appointment Booked!",
                                                description: "Your appointment has been scheduled successfully.",
                                            })
                                        }}
                                    >
                                        Book Appointment
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Appointment Modal */}
            <AnimatePresence>
                {showEditModal && appointmentToEdit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowEditModal(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl max-w-md w-full p-6 shadow-xl"
                        >
                            <h3 className="text-2xl font-bold text-foreground mb-2">Edit Appointment</h3>
                            <p className="text-muted-foreground mb-6">{appointmentToEdit.doctor}</p>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                                        <Input type="date" defaultValue="2025-12-05" className="rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                        <Input type="time" defaultValue="10:00" className="rounded-xl" />
                                    </div>
                                </div>
                                {appointmentToEdit.location && (
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                                        <Input defaultValue={appointmentToEdit.location} className="rounded-xl" />
                                    </div>
                                )}
                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowEditModal(false)}>Cancel</Button>
                                    <Button
                                        className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80"
                                        onClick={() => {
                                            setShowEditModal(false)
                                            toast({
                                                title: "Appointment Updated",
                                                description: "Your appointment has been updated successfully.",
                                            })
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reschedule Appointment Modal */}
            <AnimatePresence>
                {showRescheduleModal && appointmentToEdit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRescheduleModal(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl max-w-md w-full p-6 shadow-xl"
                        >
                            <h3 className="text-2xl font-bold text-foreground mb-2">Reschedule Appointment</h3>
                            <p className="text-muted-foreground mb-6">{appointmentToEdit.doctor} - {appointmentToEdit.specialty}</p>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                                    <p className="text-sm text-muted-foreground mb-1">Current Appointment</p>
                                    <p className="font-medium text-foreground">{appointmentToEdit.date} at {appointmentToEdit.time}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">New Date</label>
                                        <Input type="date" className="rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">New Time</label>
                                        <Input type="time" className="rounded-xl" />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowRescheduleModal(false)}>Cancel</Button>
                                    <Button
                                        className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80"
                                        onClick={() => {
                                            setShowRescheduleModal(false)
                                            toast({
                                                title: "Appointment Rescheduled",
                                                description: "Your appointment has been rescheduled successfully.",
                                            })
                                        }}
                                    >
                                        Confirm Reschedule
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
