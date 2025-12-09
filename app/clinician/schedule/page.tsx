"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { ClinicianSidebar } from "@/components/clinician-sidebar"
import { useToast } from "@/hooks/use-toast"
import { useClinicianRole } from "@/contexts/clinician-role-context"
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
    Trash,
    AlertCircle,
    ClipboardList,
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

const mockPatients = [
    "Adebayo Ogundimu",
    "Chioma Eze",
    "Ibrahim Musa",
    "Funke Adeoye",
    "Amara Nwosu",
    "Oluwaseun Adeyemi",
    "Chidi Okafor",
]

export default function SchedulePage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false)
    const [showAddSlot, setShowAddSlot] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [appointmentDate, setAppointmentDate] = useState("")
    const [appointmentTime, setAppointmentTime] = useState("")
    const [appointmentDuration, setAppointmentDuration] = useState("")
    const [appointmentType, setAppointmentType] = useState<"in-person" | "video">("in-person")
    const [newSlot, setNewSlot] = useState({ patient: "", date: "", time: "", duration: "30", type: "in-person" as "in-person" | "video" })
    const [patientSuggestions, setPatientSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const { toast } = useToast()
    const { role } = useClinicianRole()

    useEffect(() => {
        setMounted(true)
    }, [])

    const getWeekString = () => {
        const baseDate = new Date(2025, 11, 2) // Dec 2, 2025
        baseDate.setDate(baseDate.getDate() + (currentWeekOffset * 7))
        const endDate = new Date(baseDate)
        endDate.setDate(endDate.getDate() + 6)
        return `${baseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.getDate()}, ${baseDate.getFullYear()}`
    }

    const handleAddSlot = () => {
        setShowAddSlot(true)
    }

    const handleSlotClick = (day: string, time: string, appointment?: Appointment) => {
        if (appointment) {
            setSelectedAppointment(appointment)
            setAppointmentDate(day)
            setAppointmentTime(time)
            setAppointmentDuration(appointment.duration.toString())
            setAppointmentType(appointment.type)
            setShowAppointmentDetails(true)
        } else {
            setNewSlot({ ...newSlot, date: day, time })
            setShowAddSlot(true)
        }
    }

    const handlePatientSearch = (value: string) => {
        setNewSlot({ ...newSlot, patient: value })
        if (value.trim()) {
            const filtered = mockPatients.filter(p =>
                p.toLowerCase().includes(value.toLowerCase())
            )
            setPatientSuggestions(filtered)
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }

    const handleSelectPatient = (patient: string) => {
        setNewSlot({ ...newSlot, patient })
        setShowSuggestions(false)
    }

    const handleSaveAppointment = () => {
        toast({
            title: "Appointment Updated",
            description: `Appointment for ${selectedAppointment?.patient} updated successfully`,
        })
        setShowAppointmentDetails(false)
    }

    const handleDeleteAppointment = () => {
        toast({
            title: "Appointment Deleted",
            description: `Appointment for ${selectedAppointment?.patient} has been cancelled`,
            variant: "destructive",
        })
        setShowAppointmentDetails(false)
    }

    const handleCreateSlot = () => {
        if (!newSlot.patient || !newSlot.date || !newSlot.time) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }
        toast({
            title: "Appointment Created",
            description: `Appointment with ${newSlot.patient} scheduled for ${newSlot.date} at ${newSlot.time}`,
        })
        setShowAddSlot(false)
        setNewSlot({ patient: "", date: "", time: "", duration: "30", type: "in-person" })
    }

    if (!mounted) return null

    // Redirect nurses to requests page
    if (role === "nurse") {
        return (
            <div className="min-h-screen bg-background flex">
                <ClinicianSidebar activePath="/clinician/schedule" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 flex flex-col items-center justify-center p-6">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
                    <p className="text-muted-foreground text-center mb-4">
                        The Schedule page is only available for doctors.<br />
                        As a nurse, please use the Requests page to manage appointments.
                    </p>
                    <Button onClick={() => window.location.href = "/clinician/requests"} className="gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Go to Requests
                    </Button>
                </main>
            </div>
        )
    }

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
                            <Button onClick={handleAddSlot} className="bg-gradient-to-r from-primary to-primary/80">
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
                        <button
                            onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                            className="p-2 rounded-xl hover:bg-secondary transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-foreground">{getWeekString()}</h2>
                        <button
                            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                            className="p-2 rounded-xl hover:bg-secondary transition-colors"
                        >
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
                                                onClick={() => handleSlotClick(day, time, appt)}
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

            {/* Appointment Details Modal */}
            <AnimatePresence>
                {showAppointmentDetails && selectedAppointment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAppointmentDetails(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl max-w-md w-full p-6 shadow-xl border border-border/50"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Appointment Details</h3>
                                    <p className="text-muted-foreground">Edit appointment date and time</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-xl"
                                    onClick={handleDeleteAppointment}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Patient</label>
                                    <Input
                                        value={selectedAppointment.patient}
                                        disabled
                                        className="rounded-xl bg-secondary/30 border-border/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Day</label>
                                    <select
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                    <select
                                        value={appointmentTime}
                                        onChange={(e) => setAppointmentTime(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Duration (minutes)</label>
                                    <select
                                        value={appointmentDuration}
                                        onChange={(e) => setAppointmentDuration(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">60 minutes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Appointment Type</label>
                                    <select
                                        value={appointmentType}
                                        onChange={(e) => setAppointmentType(e.target.value as "in-person" | "video")}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="in-person">In-Person</option>
                                        <option value="video">Video Call</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAppointmentDetails(false)}>
                                        Cancel
                                    </Button>
                                    <Button className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80" onClick={handleSaveAppointment}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Slot Modal */}
            <AnimatePresence>
                {showAddSlot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddSlot(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl max-w-md w-full p-6 shadow-xl border border-border/50"
                        >
                            <h3 className="text-2xl font-bold text-foreground mb-2">Create Appointment</h3>
                            <p className="text-muted-foreground mb-6">Schedule a new appointment with a patient</p>


                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Patient Name</label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter patient name..."
                                            value={newSlot.patient}
                                            onChange={(e) => handlePatientSearch(e.target.value)}
                                            onFocus={() => newSlot.patient && setShowSuggestions(true)}
                                            className="rounded-xl bg-secondary/30 border-border/50"
                                        />
                                        {showSuggestions && patientSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                                {patientSuggestions.map((patient, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSelectPatient(patient)}
                                                        className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-sm text-foreground"
                                                    >
                                                        {patient}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Day</label>
                                    <select
                                        value={newSlot.date}
                                        onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select a day</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                    <select
                                        value={newSlot.time}
                                        onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select a time</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Duration (minutes)</label>
                                    <select
                                        value={newSlot.duration}
                                        onChange={(e) => setNewSlot({ ...newSlot, duration: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">60 minutes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Appointment Type</label>
                                    <select
                                        value={newSlot.type}
                                        onChange={(e) => setNewSlot({ ...newSlot, type: e.target.value as "in-person" | "video" })}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="in-person">In-Person</option>
                                        <option value="video">Video Call</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddSlot(false)}>
                                        Cancel
                                    </Button>
                                    <Button className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80" onClick={handleCreateSlot}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Appointment
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
