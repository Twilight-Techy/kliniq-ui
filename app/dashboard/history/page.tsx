"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PatientSidebar } from "@/components/patient-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { historyApi, MedicalHistoryResponse } from "@/lib/history-api"
import {
    History as HistoryIcon,
    Bell,
    Settings,
    LogOut,
    Menu,
    Home,
    MessageSquare,
    Calendar,
    FileText,
    Pill,
    Activity,
    Download,
    ChevronRight,
    Clock,
    User,
    Search,
    Loader2,
} from "lucide-react"

interface HistoryItem {
    id: string
    type: "consultation" | "prescription" | "test" | "diagnosis"
    title: string
    doctor: string
    date: string
    description: string
    status?: string
}

// Transform API response to local format
function transformHistory(item: MedicalHistoryResponse): HistoryItem {
    return {
        id: item.id,
        type: item.type,
        title: item.title,
        doctor: item.doctor_name || "Unknown Doctor",
        date: item.date,
        description: item.description || "",
        status: item.status,
    }
}

const typeStyles = {
    consultation: { gradient: "from-primary/20 to-primary/10", icon: User, color: "text-primary" },
    prescription: { gradient: "from-accent/20 to-accent/10", icon: Pill, color: "text-accent" },
    test: { gradient: "from-kliniq-cyan/20 to-kliniq-cyan/10", icon: Activity, color: "text-kliniq-cyan" },
    diagnosis: { gradient: "from-green-500/20 to-green-500/10", icon: FileText, color: "text-green-500" },
}

export default function HistoryPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "consultation" | "prescription" | "test" | "diagnosis">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

    // Store all history for client-side filtering
    const [allHistory, setAllHistory] = useState<HistoryItem[]>([])

    const { toast } = useToast()

    // Download a single history item
    const handleDownloadItem = (item: HistoryItem) => {
        const content = `
MEDICAL RECORD
==============

Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
Title: ${item.title}
Doctor: ${item.doctor}
Date: ${item.date}
${item.status ? `Status: ${item.status}` : ''}

Description:
${item.description}

---
Generated from Kliniq Health Platform
`.trim()

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${item.title.replace(/[^a-zA-Z0-9]/g, '_')}_${item.date.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({ title: 'Downloaded', description: 'Medical record saved' })
    }

    // Export all history
    const handleExportAll = () => {
        if (allHistory.length === 0) {
            toast({ title: 'No Data', description: 'No medical history to export', variant: 'destructive' })
            return
        }

        const content = `
MEDICAL HISTORY EXPORT
======================
Exported on: ${new Date().toLocaleDateString('en-NG', { dateStyle: 'full' })}
Total Records: ${allHistory.length}

${'='.repeat(60)}

${allHistory.map((item, i) => `
RECORD ${i + 1}
${'-'.repeat(40)}
Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
Title: ${item.title}
Doctor: ${item.doctor}
Date: ${item.date}
${item.status ? `Status: ${item.status}` : ''}

Description:
${item.description}
`).join('\n')}

${'='.repeat(60)}
Generated from Kliniq Health Platform
`.trim()

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `medical_history_export_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({ title: 'Exported', description: `${allHistory.length} records exported successfully` })
    }

    // Fetch all data once on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await historyApi.getHistory()
                setAllHistory(response.history.map(transformHistory))
            } catch (error) {
                console.error("Failed to load history:", error)
                toast({
                    title: "Error",
                    description: "Failed to load medical history",
                    variant: "destructive"
                })
            } finally {
                setLoading(false)
            }
        }

        setMounted(true)
        fetchData()
    }, [])

    // Client-side filtering
    const filteredHistory = allHistory.filter((item) => {
        // Apply type filter
        if (filter !== "all" && item.type !== filter) return false
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                item.title.toLowerCase().includes(query) ||
                item.doctor.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            )
        }
        return true
    })

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex max-w-full overflow-x-hidden">
            <PatientSidebar activePath="/dashboard/history" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen max-w-full">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Medical History</h1>
                                <p className="text-sm text-muted-foreground">Your complete healthcare timeline</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-xl bg-transparent" onClick={handleExportAll}>
                                <Download className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl bg-card border-border/50"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 p-1.5 bg-secondary/30 rounded-xl mb-6 overflow-x-auto">
                        {(["all", "consultation", "prescription", "test", "diagnosis"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                                    filter === f
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredHistory.length > 0 ? (
                        /* Timeline */
                        <div className="relative space-y-6">

                            {filteredHistory.map((item, index) => {
                                const style = typeStyles[item.type]
                                const Icon = style.icon

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative pl-16"
                                    >
                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-0">
                                            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center", style.gradient)}>
                                                <Icon className={cn("w-6 h-6", style.color)} />
                                            </div>
                                        </div>

                                        {/* Content card */}
                                        <div className="group p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                                            <div className="relative">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                                                            {item.status && (
                                                                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                                                                    {item.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-primary">{item.doctor}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Clock className="w-4 h-4" />
                                                        {item.date}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                                <button
                                                    onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                                                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                                                >
                                                    {selectedItem === item.id ? "Hide Details" : "View Details"}
                                                    <ChevronRight className={cn(
                                                        "w-4 h-4 transition-transform",
                                                        selectedItem === item.id && "rotate-90"
                                                    )} />
                                                </button>

                                                <AnimatePresence>
                                                    {selectedItem === item.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="mt-4 pt-4 border-t border-border/50 overflow-hidden"
                                                        >
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-muted-foreground">Type</p>
                                                                    <p className="font-medium text-foreground capitalize">{item.type}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Provider</p>
                                                                    <p className="font-medium text-foreground">{item.doctor}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Date</p>
                                                                    <p className="font-medium text-foreground">{item.date}</p>
                                                                </div>
                                                                {item.status && (
                                                                    <div>
                                                                        <p className="text-muted-foreground">Status</p>
                                                                        <p className="font-medium text-foreground">{item.status}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="mt-4 flex gap-2">
                                                                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => handleDownloadItem(item)}>
                                                                    <Download className="w-4 h-4 mr-2" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12">
                            <HistoryIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No History Found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || filter !== "all"
                                    ? "Try adjusting your search or filter"
                                    : "Your medical history will appear here"}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
