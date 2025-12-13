"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PatientSidebar } from "@/components/patient-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { recordingsApi, RecordingResponse, UpcomingAppointmentResponse } from "@/lib/recordings-api"
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
    Loader2,
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
    file_url?: string
    transcript?: string
}

// Transform API response to local format
function transformRecording(rec: RecordingResponse): Recording {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const formatSize = (bytes?: number) => {
        if (!bytes) return "Processing..."
        const mb = bytes / (1024 * 1024)
        return `${mb.toFixed(1)} MB`
    }

    return {
        id: rec.id,
        title: rec.title,
        doctor: rec.doctor_name || "Unknown Doctor",
        specialty: rec.specialty || "General",
        date: new Date(rec.created_at).toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }),
        duration: rec.status === 'processing' ? "Processing..." : formatDuration(rec.duration_seconds),
        durationSeconds: rec.duration_seconds,
        status: rec.status === 'completed' ? 'completed' : 'processing',
        size: formatSize(rec.file_size_bytes),
        file_url: rec.file_url,
        transcript: rec.transcript,
    }
}

export default function ConsultationsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // Recording states
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Data states - fetch once, filter client-side
    const [allRecordings, setAllRecordings] = useState<Recording[]>([])
    const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointmentResponse[]>([])
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("")

    // Filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [filterDoctor, setFilterDoctor] = useState<string>("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)

    // Player states
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playbackProgress, setPlaybackProgress] = useState(0)

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const playbackRef = useRef<NodeJS.Timeout | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const { toast } = useToast()

    // Fetch all data once on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [recordingsRes, appointmentsRes] = await Promise.all([
                    recordingsApi.getRecordings(),
                    recordingsApi.getUpcomingAppointments()
                ])
                setAllRecordings(recordingsRes.recordings.map(transformRecording))
                setUpcomingAppointments(appointmentsRes.appointments)
            } catch (error) {
                console.error("Failed to load data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load recordings",
                    variant: "destructive"
                })
            } finally {
                setLoading(false)
            }
        }

        setMounted(true)
        fetchData()

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (playbackRef.current) clearInterval(playbackRef.current)
        }
    }, [])

    // Recording timer
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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.start(1000) // Capture in 1s chunks
            setIsRecording(true)
            setRecordingTime(0)
            setIsPaused(false)
            toast({ title: "Recording Started", description: "Your consultation is now being recorded" })
        } catch (error) {
            console.error("Failed to start recording:", error)
            toast({
                title: "Microphone Access Required",
                description: "Please allow microphone access to record consultations",
                variant: "destructive"
            })
        }
    }

    const pauseRecording = () => {
        if (!mediaRecorderRef.current) return

        if (isPaused) {
            mediaRecorderRef.current.resume()
        } else {
            mediaRecorderRef.current.pause()
        }
        setIsPaused(!isPaused)
        toast({ title: isPaused ? "Recording Resumed" : "Recording Paused" })
    }

    const stopRecording = async () => {
        if (!mediaRecorderRef.current) return

        setIsSaving(true)
        const duration = recordingTime

        return new Promise<void>((resolve) => {
            mediaRecorderRef.current!.onstop = async () => {
                try {
                    // Create audio blob
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

                    // Get appointment details for title
                    const selectedAppt = upcomingAppointments.find(a => a.id === selectedAppointmentId)
                    const title = selectedAppt
                        ? `${selectedAppt.doctor_name} - ${selectedAppt.specialty}`
                        : `Recording ${new Date().toLocaleDateString()}`

                    // Create recording entry in backend
                    const createResult = await recordingsApi.createRecording({
                        title,
                        appointment_id: selectedAppointmentId || undefined,
                        duration_seconds: duration,
                    })

                    if (!createResult.success || !createResult.recording) {
                        throw new Error(createResult.message)
                    }

                    // Upload to Vercel Blob
                    const formData = new FormData()
                    formData.append('file', audioBlob, `recording-${Date.now()}.webm`)
                    formData.append('filename', `${title.replace(/[^a-zA-Z0-9]/g, '_')}.webm`)

                    const uploadResponse = await fetch('/api/recordings/upload', {
                        method: 'POST',
                        body: formData,
                    })

                    const uploadResult = await uploadResponse.json()

                    if (!uploadResult.success) {
                        throw new Error('Upload failed')
                    }

                    // Update recording with file URL
                    await recordingsApi.uploadRecording(createResult.recording.id, {
                        file_url: uploadResult.url,
                        file_size_bytes: uploadResult.size,
                        duration_seconds: duration,
                    })

                    // Add to local state
                    const newRecording = transformRecording({
                        ...createResult.recording,
                        file_url: uploadResult.url,
                        file_size_bytes: uploadResult.size,
                        duration_seconds: duration,
                        status: 'completed',
                    })
                    setAllRecordings(prev => [newRecording, ...prev])

                    toast({
                        title: "Recording Saved",
                        description: `Consultation recording (${formatTime(duration)}) saved successfully`
                    })
                } catch (error) {
                    console.error("Failed to save recording:", error)
                    toast({
                        title: "Error",
                        description: "Failed to save recording",
                        variant: "destructive"
                    })
                } finally {
                    // Stop all tracks
                    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())
                    setIsRecording(false)
                    setIsPaused(false)
                    setRecordingTime(0)
                    setIsSaving(false)
                    resolve()
                }
            }

            mediaRecorderRef.current!.stop()
        })
    }

    const handlePlayPause = async () => {
        if (!selectedRecording || !selectedRecording.file_url) return

        if (isPlaying) {
            if (playbackRef.current) clearInterval(playbackRef.current)
            audioRef.current?.pause()
            setIsPlaying(false)
        } else {
            try {
                // Create new audio element if needed or if source changed
                if (!audioRef.current || audioRef.current.src !== selectedRecording.file_url) {
                    if (audioRef.current) {
                        audioRef.current.pause()
                    }
                    audioRef.current = new Audio(selectedRecording.file_url)
                    audioRef.current.onended = () => {
                        setIsPlaying(false)
                        setPlaybackProgress(0)
                        if (playbackRef.current) clearInterval(playbackRef.current)
                    }
                }

                // Wait for audio to be ready
                await audioRef.current.play()
                setIsPlaying(true)

                // Start progress tracking
                playbackRef.current = setInterval(() => {
                    if (audioRef.current && !isNaN(audioRef.current.duration)) {
                        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
                        setPlaybackProgress(progress)
                    }
                }, 100)
            } catch (error) {
                console.error("Playback error:", error)
                setIsPlaying(false)
            }
        }
    }

    const handleDownload = (recording: Recording, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()

        if (recording.file_url) {
            // Download actual audio file
            const a = document.createElement("a")
            a.href = recording.file_url
            a.download = `${recording.title.replace(/[^a-zA-Z0-9]/g, "_")}.webm`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } else {
            // Download transcript
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
        }

        toast({ title: "Downloaded!", description: "Recording saved" })
    }

    const handleDelete = async (recordingId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()

        try {
            const result = await recordingsApi.deleteRecording(recordingId)
            if (result.success) {
                setAllRecordings(prev => prev.filter(r => r.id !== recordingId))
                if (selectedRecording?.id === recordingId) {
                    setSelectedRecording(null)
                    audioRef.current?.pause()
                    audioRef.current = null
                }
                toast({ title: "Deleted", description: "Recording has been deleted" })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete recording",
                variant: "destructive"
            })
        }
    }

    // Client-side filtering
    const filteredRecordings = allRecordings.filter((rec) => {
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.doctor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDoctor = filterDoctor === "all" || rec.doctor === filterDoctor
        return matchesSearch && matchesDoctor
    })

    const uniqueDoctors = [...new Set(allRecordings.map(r => r.doctor))]

    // Calculate total duration
    const totalDurationSeconds = allRecordings.reduce((sum, r) => sum + r.durationSeconds, 0)
    const formatTotalDuration = () => {
        const hours = Math.floor(totalDurationSeconds / 3600)
        const mins = Math.floor((totalDurationSeconds % 3600) / 60)
        const secs = totalDurationSeconds % 60
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

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
                                        disabled={isSaving}
                                        className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-50",
                                            isRecording
                                                ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                                                : "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                        )}
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                                        ) : isRecording ? (
                                            <Square className="w-10 h-10 text-white" />
                                        ) : (
                                            <Mic className="w-10 h-10 text-white" />
                                        )}
                                    </motion.button>
                                    <p className="text-sm font-medium text-foreground">
                                        {isSaving ? "Saving..." : isRecording ? "Stop Recording" : "Start Recording"}
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
                                                    disabled={isSaving}
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
                                        <div className="space-y-3">
                                            <h2 className="text-xl font-semibold text-foreground">Ready to Record</h2>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                Select an appointment and press the button to start recording.
                                            </p>
                                            {/* Appointment Selection */}
                                            <select
                                                value={selectedAppointmentId}
                                                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                                                className="w-full max-w-md px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm"
                                            >
                                                <option value="">Select an appointment (optional)</option>
                                                {upcomingAppointments.map((appt) => (
                                                    <option key={appt.id} value={appt.id}>
                                                        {appt.doctor_name} - {appt.specialty} ({appt.scheduled_date} {appt.scheduled_time})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-secondary/30 text-center">
                                        <p className="text-2xl font-bold text-foreground">{allRecordings.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Recordings</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/30 text-center">
                                        <p className="text-2xl font-bold text-foreground">{formatTotalDuration()}</p>
                                        <p className="text-xs text-muted-foreground">Total Duration</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search recordings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 rounded-xl bg-card border-border/50"
                                />
                            </div>
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className="rounded-xl w-full sm:w-auto"
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    {filterDoctor === "all" ? "All Doctors" : filterDoctor}
                                </Button>
                                <AnimatePresence>
                                    {showFilterDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-card border border-border shadow-lg z-10"
                                        >
                                            <button
                                                onClick={() => { setFilterDoctor("all"); setShowFilterDropdown(false) }}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 rounded-lg text-sm",
                                                    filterDoctor === "all" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                                                )}
                                            >
                                                All Doctors
                                            </button>
                                            {uniqueDoctors.map((doctor) => (
                                                <button
                                                    key={doctor}
                                                    onClick={() => { setFilterDoctor(doctor); setShowFilterDropdown(false) }}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 rounded-lg text-sm",
                                                        filterDoctor === doctor ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                                                    )}
                                                >
                                                    {doctor}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Recordings List */}
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : filteredRecordings.length > 0 ? (
                            <div className="space-y-4">
                                {filteredRecordings.map((recording, index) => (
                                    <motion.div
                                        key={recording.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => {
                                            setSelectedRecording(recording)
                                            setPlaybackProgress(0)
                                            setIsPlaying(false)
                                            if (audioRef.current) {
                                                audioRef.current.pause()
                                                audioRef.current = null
                                            }
                                        }}
                                        className={cn(
                                            "p-4 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer",
                                            selectedRecording?.id === recording.id
                                                ? "bg-primary/5 border-primary/30"
                                                : "bg-card border-border/50 hover:border-primary/20"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                recording.status === "completed"
                                                    ? "bg-gradient-to-br from-accent/20 to-accent/10"
                                                    : "bg-gradient-to-br from-amber-500/20 to-amber-500/10"
                                            )}>
                                                {recording.status === "completed" ? (
                                                    <Volume2 className="w-5 h-5 text-accent" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-amber-500 animate-spin" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-foreground truncate">{recording.title}</h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {recording.doctor}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{recording.specialty}</span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
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
                                                {recording.status === "completed" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => handleDownload(recording, e)}
                                                        className="rounded-lg"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => handleDelete(recording.id, e)}
                                                    className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded Player */}
                                        <AnimatePresence>
                                            {selectedRecording?.id === recording.id && recording.status === "completed" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4 pt-4 border-t border-border/50"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handlePlayPause()
                                                            }}
                                                            className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
                                                        >
                                                            {isPlaying ? (
                                                                <Pause className="w-5 h-5" />
                                                            ) : (
                                                                <Play className="w-5 h-5 ml-0.5" />
                                                            )}
                                                        </Button>
                                                        <div className="flex-1">
                                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-primary"
                                                                    style={{ width: `${playbackProgress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                                                            {recording.duration}
                                                        </span>
                                                    </div>
                                                    {recording.transcript && (
                                                        <div className="mt-4 p-4 rounded-xl bg-secondary/30">
                                                            <p className="text-xs font-medium text-muted-foreground mb-2">TRANSCRIPT</p>
                                                            <p className="text-sm text-foreground">{recording.transcript}</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Volume2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">No Recordings Found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery || filterDoctor !== "all"
                                        ? "Try adjusting your search or filter"
                                        : "Start recording your first consultation"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
