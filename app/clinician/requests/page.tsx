"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClinicianSidebar } from "@/components/clinician-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useToast } from "@/hooks/use-toast"
import { useClinicianRole } from "@/contexts/clinician-role-context"
import { cn } from "@/lib/utils"
import {
    Menu,
    Search,
    Filter,
    Clock,
    Calendar,
    User,
    X,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    Phone,
    Mail,
    MapPin,
    Stethoscope,
    Video,
    Building2,
} from "lucide-react"

interface AppointmentRequest {
    id: string
    patientName: string
    patientAge: number
    patientPhone: string
    patientEmail: string
    hospital: string
    department: string
    reason: string
    preferredType: "video" | "in-person"
    urgency: "low" | "normal" | "urgent"
    status: "pending" | "approved" | "rejected"
    submittedAt: string
    submittedDate: string
}

const mockRequests: AppointmentRequest[] = [
    {
        id: "1",
        patientName: "Adebayo Ogundimu",
        patientAge: 34,
        patientPhone: "+234 801 234 5678",
        patientEmail: "adebayo@email.com",
        hospital: "Lagos University Teaching Hospital",
        department: "General Medicine",
        reason: "Persistent headaches for the past week, accompanied by mild fever. Need a general checkup.",
        preferredType: "in-person",
        urgency: "normal",
        status: "pending",
        submittedAt: "2 hours ago",
        submittedDate: "Dec 9, 2025",
    },
    {
        id: "2",
        patientName: "Chioma Nwankwo",
        patientAge: 28,
        patientPhone: "+234 802 345 6789",
        patientEmail: "chioma@email.com",
        hospital: "Lagos University Teaching Hospital",
        department: "Cardiology",
        reason: "Follow-up consultation for heart condition monitoring. Blood pressure has been fluctuating.",
        preferredType: "video",
        urgency: "urgent",
        status: "pending",
        submittedAt: "4 hours ago",
        submittedDate: "Dec 9, 2025",
    },
    {
        id: "3",
        patientName: "Emeka Okoro",
        patientAge: 45,
        patientPhone: "+234 803 456 7890",
        patientEmail: "emeka@email.com",
        hospital: "Lagos University Teaching Hospital",
        department: "Dermatology",
        reason: "Skin rash that appeared 3 days ago. Spreading to arms and chest.",
        preferredType: "in-person",
        urgency: "normal",
        status: "pending",
        submittedAt: "6 hours ago",
        submittedDate: "Dec 9, 2025",
    },
    {
        id: "4",
        patientName: "Fatima Aliyu",
        patientAge: 52,
        patientPhone: "+234 804 567 8901",
        patientEmail: "fatima@email.com",
        hospital: "Lagos University Teaching Hospital",
        department: "General Medicine",
        reason: "Annual health checkup and routine blood tests.",
        preferredType: "in-person",
        urgency: "low",
        status: "pending",
        submittedAt: "1 day ago",
        submittedDate: "Dec 8, 2025",
    },
    {
        id: "5",
        patientName: "Obinna Eze",
        patientAge: 39,
        patientPhone: "+234 805 678 9012",
        patientEmail: "obinna@email.com",
        hospital: "Lagos University Teaching Hospital",
        department: "Orthopedics",
        reason: "Lower back pain that started after lifting heavy objects. Difficulty walking.",
        preferredType: "in-person",
        urgency: "urgent",
        status: "pending",
        submittedAt: "30 minutes ago",
        submittedDate: "Dec 9, 2025",
    },
]

const mockDoctors = [
    { id: "1", name: "Dr. Oluwaseun Adeyemi", specialty: "General Medicine" },
    { id: "2", name: "Dr. Amara Obi", specialty: "Cardiology" },
    { id: "3", name: "Dr. Chidinma Nwosu", specialty: "Dermatology" },
    { id: "4", name: "Dr. Yusuf Ibrahim", specialty: "Orthopedics" },
    { id: "5", name: "Dr. Grace Ojo", specialty: "Pediatrics" },
]

export default function RequestsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [requests, setRequests] = useState(mockRequests)
    const [searchQuery, setSearchQuery] = useState("")
    const [urgencyFilter, setUrgencyFilter] = useState<"all" | "low" | "normal" | "urgent">("all")
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
    const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null)
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [requestToReject, setRequestToReject] = useState<AppointmentRequest | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const { toast } = useToast()
    const { role } = useClinicianRole()

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredRequests = requests.filter((req) => {
        const matchesSearch = req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.department.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesUrgency = urgencyFilter === "all" || req.urgency === urgencyFilter
        const matchesStatus = statusFilter === "all" || req.status === statusFilter
        return matchesSearch && matchesUrgency && matchesStatus
    })

    const handleApproveRequest = (request: AppointmentRequest) => {
        setSelectedRequest(request)
        setShowScheduleModal(true)
    }

    const handleRejectRequest = (request: AppointmentRequest) => {
        setRequestToReject(request)
        setShowRejectModal(true)
    }

    const confirmReject = () => {
        if (requestToReject) {
            setRequests(requests.map(req =>
                req.id === requestToReject.id ? { ...req, status: "rejected" as const } : req
            ))
            setShowRejectModal(false)
            setRequestToReject(null)
            setRejectReason("")
            toast({
                title: "Request Rejected",
                description: `Appointment request from ${requestToReject.patientName} has been declined.`,
                variant: "destructive",
            })
        }
    }

    const handleConfirmSchedule = () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            toast({
                title: "Missing Information",
                description: "Please select a doctor, date, and time.",
                variant: "destructive",
            })
            return
        }

        if (selectedRequest) {
            setRequests(requests.map(req =>
                req.id === selectedRequest.id ? { ...req, status: "approved" as const } : req
            ))
            setShowScheduleModal(false)
            setSelectedRequest(null)
            setSelectedDoctor("")
            setSelectedDate("")
            setSelectedTime("")
            toast({
                title: "Appointment Scheduled!",
                description: `Appointment confirmed for ${selectedRequest.patientName} with ${selectedDoctor}.`,
            })
        }
    }

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "urgent": return "bg-red-500/10 text-red-500 border-red-500/20"
            case "normal": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
            case "low": return "bg-green-500/10 text-green-500 border-green-500/20"
            default: return "bg-secondary text-muted-foreground"
        }
    }

    if (!mounted) return null

    // Redirect doctors to schedule page
    if (role === "doctor") {
        return (
            <div className="min-h-screen bg-background flex">
                <ClinicianSidebar activePath="/clinician/requests" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 flex flex-col items-center justify-center p-6">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
                    <p className="text-muted-foreground text-center mb-4">
                        The Requests page is only available for nurses.<br />
                        Please use the Schedule page to view your appointments.
                    </p>
                    <Button onClick={() => window.location.href = "/clinician/schedule"}>
                        Go to Schedule
                    </Button>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex">
            <ClinicianSidebar
                activePath="/clinician/requests"
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Appointment Requests</h1>
                                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Review and schedule patient appointments</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-card border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{requests.filter(r => r.status === "pending").length}</p>
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{requests.filter(r => r.urgency === "urgent" && r.status === "pending").length}</p>
                                        <p className="text-xs text-muted-foreground">Urgent</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{requests.filter(r => r.status === "approved").length}</p>
                                        <p className="text-xs text-muted-foreground">Approved</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{requests.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Today</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-full sm:w-72 rounded-xl"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <select
                                    value={urgencyFilter}
                                    onChange={(e) => setUrgencyFilter(e.target.value as typeof urgencyFilter)}
                                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-medium"
                                >
                                    <option value="all">All Urgency</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="normal">Normal</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Requests List */}
                        <div className="space-y-4">
                            {filteredRequests.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No requests found matching your criteria
                                </div>
                            ) : (
                                filteredRequests.map((request, idx) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={cn(
                                            "p-5 rounded-2xl bg-card border transition-all",
                                            request.urgency === "urgent" && request.status === "pending"
                                                ? "border-red-500/30 bg-red-500/5"
                                                : "border-border/50 hover:border-primary/30"
                                        )}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <User className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h3 className="font-semibold text-foreground">{request.patientName}</h3>
                                                        <span className="text-sm text-muted-foreground">({request.patientAge} yrs)</span>
                                                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", getUrgencyColor(request.urgency))}>
                                                            {request.urgency}
                                                        </span>
                                                        {request.status !== "pending" && (
                                                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                                                                request.status === "approved" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                            )}>
                                                                {request.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <Stethoscope className="w-3 h-3" />
                                                            {request.department}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            {request.preferredType === "video" ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                                                            {request.preferredType === "video" ? "Video Call" : "In-Person"}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {request.submittedAt}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground bg-secondary/30 p-3 rounded-xl">
                                                        <span className="text-muted-foreground">Reason: </span>
                                                        {request.reason}
                                                    </p>
                                                </div>
                                            </div>

                                            {request.status === "pending" && (
                                                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                                                    <Button
                                                        size="sm"
                                                        className="rounded-xl bg-primary"
                                                        onClick={() => handleApproveRequest(request)}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Schedule
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="rounded-xl text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleRejectRequest(request)}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Schedule Appointment Modal */}
            <AnimatePresence>
                {showScheduleModal && selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowScheduleModal(false)}
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
                                    <h2 className="text-xl font-bold text-foreground">Schedule Appointment</h2>
                                    <p className="text-sm text-muted-foreground">Assign a doctor and schedule time</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowScheduleModal(false)}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Patient Info */}
                            <div className="p-4 rounded-xl bg-secondary/30 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{selectedRequest.patientName}</p>
                                        <p className="text-sm text-muted-foreground">{selectedRequest.department}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedRequest.patientPhone}</span>
                                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedRequest.patientEmail}</span>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Assign Doctor</label>
                                    <select
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                                    >
                                        <option value="">Select a doctor...</option>
                                        {mockDoctors
                                            .filter(d => d.specialty === selectedRequest.department || selectedRequest.department === "General Medicine")
                                            .map((doctor) => (
                                                <option key={doctor.id} value={doctor.name}>
                                                    {doctor.name} - {doctor.specialty}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                                        <Input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                                        <Input
                                            type="time"
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <p className="text-xs text-foreground">
                                        <strong>Appointment Type:</strong> {selectedRequest.preferredType === "video" ? "Video Call" : "In-Person"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Patient will be notified once the appointment is confirmed.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl"
                                    onClick={() => setShowScheduleModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 rounded-xl bg-primary"
                                    onClick={handleConfirmSchedule}
                                >
                                    Confirm Appointment
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reject Confirmation Modal */}
            <AnimatePresence>
                {showRejectModal && requestToReject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRejectModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-3xl p-6 w-full max-w-md border border-border"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-destructive" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Reject Request?</h2>
                                    <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-secondary/30 mb-4">
                                <p className="text-sm text-foreground"><strong>Patient:</strong> {requestToReject.patientName}</p>
                                <p className="text-sm text-muted-foreground mt-1"><strong>Department:</strong> {requestToReject.department}</p>
                                <p className="text-sm text-muted-foreground mt-1"><strong>Reason:</strong> {requestToReject.reason}</p>
                            </div>

                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-2 block">Rejection Reason (Optional)</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Provide a reason for rejection..."
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground resize-none h-20"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl"
                                    onClick={() => {
                                        setShowRejectModal(false)
                                        setRequestToReject(null)
                                        setRejectReason("")
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90"
                                    onClick={confirmReject}
                                >
                                    Confirm Rejection
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
