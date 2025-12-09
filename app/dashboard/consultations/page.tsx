"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PatientSidebar } from "@/components/patient-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
    Menu,
    Mic,
    MicOff,
    Square,
    Play,
    Pause,
    Download,
    Trash2,
    Search,
    Filter,
    Clock,
    Calendar,
    User,
    X,
    ChevronRight,
    Volume2,
    Share2,
    MoreVertical,
} from "lucide-react"

interface Recording {
    id: string
    title: string
    doctor: string
    specialty: string
    date: string
    duration: string
    durationSeconds: number
    status: "completed" | "processing"
    size: string
    transcript?: string
}

const mockRecordings: Recording[] = [
    {
        id: "1",
        title: "General Checkup Consultation",
        doctor: "Dr. Oluwaseun Adeyemi",
        specialty: "General Medicine",
        date: "Dec 5, 2025",
        duration: "15:32",
        durationSeconds: 932,
        status: "completed",
        size: "12.4 MB",
        transcript: "Patient presented with mild headaches for the past 3 days. No fever or other symptoms reported. Recommended rest, hydration, and Paracetamol 500mg as needed. Follow-up in 2 weeks if symptoms persist."
    },
    {
        id: "2",
        title: "Cardiac Follow-up",
        doctor: "Dr. Amara Obi",
        specialty: "Cardiology",
        date: "Nov 28, 2025",
        duration: "22:45",
        durationSeconds: 1365,
        status: "completed",
        size: "18.7 MB",
        transcript: "Blood pressure readings stable at 120/80. Heart rhythm normal. Patient reports no chest pain or shortness of breath. Continue current medications. Next checkup in 3 months."
    },
    {
        id: "3",
        title: "Prescription Review",
        doctor: "Dr. Chidinma Nwosu",
        specialty: "General Medicine",
        date: "Nov 15, 2025",
        duration: "08:20",
        durationSeconds: 500,
        status: "completed",
        size: "6.8 MB",
        transcript: "Reviewed current medications. Patient tolerating all prescriptions well. Minor adjustment to dosage schedule. Reminded patient about importance of taking medications with food."
    },
    {
        id: "4",
        title: "Recent Consultation",
        doctor: "Dr. Oluwaseun Adeyemi",
        specialty: "General Medicine",
        date: "Dec 8, 2025",
        duration: "Processing...",
        durationSeconds: 0,
        status: "processing",
        size: "Processing...",
    },
]

export default function ConsultationsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterDoctor, setFilterDoctor] = useState<string>("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playbackProgress, setPlaybackProgress] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const playbackRef = useRef<NodeJS.Timeout | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        setMounted(true)
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (playbackRef.current) clearInterval(playbackRef.current)
        }
    }, [])

    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isRecording, isPaused])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const startRecording = () => {
        setIsRecording(true)
        setRecordingTime(0)
        setIsPaused(false)
        toast({ title: "Recording Started", description: "Your consultation is now being recorded" })
    }

    const pauseRecording = () => {
        setIsPaused(!isPaused)
        toast({ title: isPaused ? "Recording Resumed" : "Recording Paused" })
    }

    const stopRecording = () => {
        setIsRecording(false)
        setIsPaused(false)
        const duration = formatTime(recordingTime)
        setRecordingTime(0)
        toast({
            title: "Recording Saved",
            description: `Consultation recording (${duration}) saved successfully`
        })
    }

    const handlePlayPause = () => {
        if (!selectedRecording) return

        if (isPlaying) {
            setIsPlaying(false)
            if (playbackRef.current) clearInterval(playbackRef.current)
        } else {
            setIsPlaying(true)
            playbackRef.current = setInterval(() => {
                setPlaybackProgress(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false)
                        if (playbackRef.current) clearInterval(playbackRef.current)
                        return 0
                    }
                    return prev + 1
                })
            }, (selectedRecording.durationSeconds * 10))
        }
    }

    const handleDownload = (recording: Recording, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()

        if (recording.status === "processing") {
            toast({ title: "Processing", description: "This recording is still being processed" })
            return
        }

        const content = `
CONSULTATION RECORDING
======================

Title: ${recording.title}
Doctor: ${recording.doctor}
Specialty: ${recording.specialty}
Date: ${recording.date}
Duration: ${recording.duration}

TRANSCRIPT
----------
${recording.transcript || "No transcript available"}

---
Recorded via Kliniq Health Platform
        `.trim()

        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `consultation_${recording.date.replace(/[^a-zA-Z0-9]/g, "_")}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({ title: "Downloaded!", description: "Recording transcript saved" })
    }

    const filteredRecordings = mockRecordings.filter((rec) => {
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.doctor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDoctor = filterDoctor === "all" || rec.doctor === filterDoctor
        return matchesSearch && matchesDoctor
    })

    const uniqueDoctors = [...new Set(mockRecordings.map(r => r.doctor))]

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <PatientSidebar activePath="/dashboard/consultations" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Consultation Recordings</h1>
                                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Record and review your consultations</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Recording Control Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Recording Button */}
                                <div className="flex flex-col items-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                                            isRecording
                                                ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                                                : "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                        )}
                                    >
                                        {isRecording ? (
                                            <Square className="w-10 h-10 text-white" />
                                        ) : (
                                            <Mic className="w-10 h-10 text-white" />
                                        )}
                                    </motion.button>
                                    <p className="text-sm font-medium text-foreground">
                                        {isRecording ? "Stop Recording" : "Start Recording"}
                                    </p>
                                </div>

                                {/* Recording Status */}
                                <div className="flex-1 text-center sm:text-left">
                                    {isRecording ? (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Recording in progress</p>
                                                <p className="text-4xl font-bold text-foreground font-mono">
                                                    {formatTime(recordingTime)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={pauseRecording}
                                                    className="rounded-xl"
                                                >
                                                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                                                    {isPaused ? "Resume" : "Pause"}
                                                </Button>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "w-3 h-3 rounded-full",
                                                        isPaused ? "bg-amber-500" : "bg-destructive animate-pulse"
                                                    )} />
                                                    <span className="text-sm text-muted-foreground">
                                                        {isPaused ? "Paused" : "Recording"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-semibold text-foreground">Ready to Record</h2>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                Press the button to start recording your consultation.
                                                Recordings are automatically transcribed and saved securely.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-secondary/30 text-center">
                                        <p className="text-2xl font-bold text-foreground">{mockRecordings.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Recordings</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/30 text-center">
                                        <p className="text-2xl font-bold text-foreground">1:12:37</p>
                                        <p className="text-xs text-muted-foreground">Total Duration</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-foreground">Your Recordings</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search recordings..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 w-full sm:w-64 rounded-xl"
                                    />
                                </div>
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm"
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span className="hidden sm:inline">
                                            {filterDoctor === "all" ? "All Doctors" : filterDoctor.split(" ").slice(0, 2).join(" ")}
                                        </span>
                                    </button>
                                    {showFilterDropdown && (
                                        <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                                            <button
                                                type="button"
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${filterDoctor === "all" ? "text-primary font-medium" : "text-foreground"
                                                    }`}
                                                onClick={() => {
                                                    setFilterDoctor("all")
                                                    setShowFilterDropdown(false)
                                                }}
                                            >
                                                All Doctors
                                            </button>
                                            {uniqueDoctors.map((doctor) => (
                                                <button
                                                    type="button"
                                                    key={doctor}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${filterDoctor === doctor ? "text-primary font-medium" : "text-foreground"
                                                        }`}
                                                    onClick={() => {
                                                        setFilterDoctor(doctor)
                                                        setShowFilterDropdown(false)
                                                    }}
                                                >
                                                    {doctor}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recordings List */}
                        <div className="space-y-3">
                            {filteredRecordings.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    No recordings found matching your criteria
                                </div>
                            ) : (
                                filteredRecordings.map((recording, idx) => (
                                    <motion.div
                                        key={recording.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setSelectedRecording(recording)}
                                        className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                recording.status === "completed"
                                                    ? "bg-primary/10"
                                                    : "bg-amber-500/10"
                                            )}>
                                                {recording.status === "completed" ? (
                                                    <Volume2 className="w-6 h-6 text-primary" />
                                                ) : (
                                                    <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-foreground truncate">{recording.title}</h3>
                                                <p className="text-sm text-muted-foreground">{recording.doctor} • {recording.specialty}</p>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {recording.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {recording.duration}
                                                    </span>
                                                    <span>{recording.size}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium",
                                                    recording.status === "completed"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {recording.status}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="rounded-xl"
                                                    onClick={(e) => handleDownload(recording, e)}
                                                    disabled={recording.status === "processing"}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Recording Details Modal */}
            <AnimatePresence>
                {selectedRecording && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setSelectedRecording(null)
                            setIsPlaying(false)
                            setPlaybackProgress(0)
                        }}
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
                                    <h2 className="text-xl font-bold text-foreground">{selectedRecording.title}</h2>
                                    <p className="text-sm text-muted-foreground">{selectedRecording.doctor}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedRecording(null)
                                        setIsPlaying(false)
                                        setPlaybackProgress(0)
                                    }}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Playback Controls */}
                            {selectedRecording.status === "completed" && (
                                <div className="p-4 rounded-2xl bg-secondary/30 mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button
                                            onClick={handlePlayPause}
                                            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-5 h-5 text-white" />
                                            ) : (
                                                <Play className="w-5 h-5 text-white ml-0.5" />
                                            )}
                                        </button>
                                        <div className="flex-1">
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${playbackProgress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                                <span>{formatTime(Math.floor((playbackProgress / 100) * selectedRecording.durationSeconds))}</span>
                                                <span>{selectedRecording.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recording Details */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                                    <p className="text-sm font-medium text-foreground">{selectedRecording.date}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                                    <p className="text-sm font-medium text-foreground">{selectedRecording.duration}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">Specialty</p>
                                    <p className="text-sm font-medium text-foreground">{selectedRecording.specialty}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-secondary/30">
                                    <p className="text-xs text-muted-foreground mb-1">File Size</p>
                                    <p className="text-sm font-medium text-foreground">{selectedRecording.size}</p>
                                </div>
                            </div>

                            {/* Transcript */}
                            {selectedRecording.transcript && (
                                <div className="space-y-3 mb-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transcript</h3>
                                    <div className="p-4 rounded-xl bg-secondary/30 max-h-40 overflow-y-auto">
                                        <p className="text-sm text-foreground leading-relaxed">{selectedRecording.transcript}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 rounded-xl bg-primary"
                                    onClick={() => handleDownload(selectedRecording)}
                                    disabled={selectedRecording.status === "processing"}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl bg-transparent"
                                    onClick={() => toast({ title: "Share", description: "Sharing options would appear here" })}
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl bg-transparent text-destructive hover:bg-destructive/10"
                                    onClick={() => toast({ title: "Delete", description: "Recording would be deleted" })}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
