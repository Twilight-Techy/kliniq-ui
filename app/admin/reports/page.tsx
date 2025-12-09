"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin-sidebar"
import { FileText, Download, Plus, Eye, Menu, Search, Filter, X, Calendar, BarChart3, Users, DollarSign, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const mockReports = [
    {
        id: "1",
        title: "Monthly Performance Report",
        desc: "Patient volume, revenue, and satisfaction metrics",
        date: "Generated Dec 1, 2025",
        type: "performance",
        icon: BarChart3,
        status: "ready",
        size: "2.4 MB",
        pages: 24,
        content: {
            summary: "This comprehensive report covers all key performance indicators for the month of November 2025.",
            highlights: [
                "Total patient visits increased by 15% compared to last month",
                "Average consultation time reduced by 5 minutes",
                "Patient satisfaction score: 4.7/5.0",
                "Revenue target achieved: 112%"
            ],
            metrics: { patients: 1247, consultations: 3856, revenue: "₦4.2M", satisfaction: "94%" }
        }
    },
    {
        id: "2",
        title: "Clinician Activity Report",
        desc: "Doctor and nurse engagement statistics",
        date: "Generated Nov 28, 2025",
        type: "clinician",
        icon: Users,
        status: "ready",
        size: "1.8 MB",
        pages: 18,
        content: {
            summary: "Detailed analysis of clinician activities, patient interactions, and performance metrics.",
            highlights: [
                "48 active clinicians (28 doctors, 20 nurses)",
                "Average rating across all clinicians: 4.8/5.0",
                "Top performer: Dr. Oluwaseun Adeyemi",
                "156 new patient registrations attributed to referrals"
            ],
            metrics: { clinicians: 48, avgRating: "4.8", consultations: 2847, referrals: 156 }
        }
    },
    {
        id: "3",
        title: "Financial Summary",
        desc: "Revenue breakdown and billing analytics",
        date: "Generated Nov 25, 2025",
        type: "financial",
        icon: DollarSign,
        status: "ready",
        size: "3.1 MB",
        pages: 32,
        content: {
            summary: "Complete financial overview including revenue streams, expenses, and profitability analysis.",
            highlights: [
                "Total revenue: ₦4.2M (18.7% growth YoY)",
                "Collection rate: 94.3%",
                "Outstanding payments: ₦245K",
                "Operating margin: 32%"
            ],
            metrics: { revenue: "₦4.2M", collected: "₦3.96M", pending: "₦245K", growth: "+18.7%" }
        }
    },
    {
        id: "4",
        title: "Patient Satisfaction Survey",
        desc: "Feedback and ratings from patients",
        date: "Generated Nov 20, 2025",
        type: "satisfaction",
        icon: TrendingUp,
        status: "ready",
        size: "1.2 MB",
        pages: 15,
        content: {
            summary: "Analysis of patient feedback, satisfaction scores, and improvement recommendations.",
            highlights: [
                "Overall satisfaction: 94% positive",
                "Wait time satisfaction improved by 12%",
                "Staff courtesy rated highest (4.9/5.0)",
                "Top suggestion: Extended evening hours"
            ],
            metrics: { responses: 892, satisfaction: "94%", nps: 72, recommendations: 15 }
        }
    },
    {
        id: "5",
        title: "Weekly Operations Summary",
        desc: "Operational efficiency and resource utilization",
        date: "Generated Dec 5, 2025",
        type: "performance",
        icon: BarChart3,
        status: "processing",
        size: "Processing...",
        pages: 0,
        content: {
            summary: "Weekly overview of operational metrics and resource allocation.",
            highlights: [
                "Report is currently being generated",
                "Expected completion: 2 hours"
            ],
            metrics: { patients: 0, consultations: 0, revenue: "N/A", satisfaction: "N/A" }
        }
    },
]

export default function AdminReportsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<"all" | "performance" | "clinician" | "financial" | "satisfaction">("all")
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null)
    const { toast } = useToast()

    useEffect(() => setMounted(true), [])

    const filteredReports = mockReports.filter((report) => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.desc.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === "all" || report.type === typeFilter
        return matchesSearch && matchesType
    })

    const handleDownload = (report: typeof mockReports[0], e?: React.MouseEvent) => {
        if (e) e.stopPropagation()

        if (report.status === "processing") {
            toast({ title: "Report Processing", description: "This report is still being generated. Please try again later." })
            return
        }

        // Generate report content as text
        const reportContent = `
${report.title}
${"=".repeat(report.title.length)}

Generated: ${report.date}
Pages: ${report.pages}
File Size: ${report.size}

SUMMARY
-------
${report.content.summary}

KEY HIGHLIGHTS
--------------
${report.content.highlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

METRICS
-------
${Object.entries(report.content.metrics).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join("\n")}

---
Report generated by Kliniq Admin Dashboard
        `.trim()

        const blob = new Blob([reportContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${report.title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({ title: "Downloaded!", description: `${report.title} saved successfully` })
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "performance": return "Performance"
            case "clinician": return "Clinician"
            case "financial": return "Financial"
            case "satisfaction": return "Satisfaction"
            default: return "All Types"
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/reports" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden max-w-full">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Reports</h1>
                                <p className="text-sm text-muted-foreground">Generate and download reports</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                className="rounded-xl bg-primary"
                                onClick={() => toast({ title: "Create Report", description: "Report creation wizard would open here" })}
                            >
                                <Plus className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Create Report</span>
                            </Button>
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-full sm:w-72 rounded-xl"
                                />
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-sm"
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                >
                                    <Filter className="w-4 h-4" />
                                    {getTypeLabel(typeFilter)}
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg z-50 py-1">
                                        {[
                                            { value: "all", label: "All Types" },
                                            { value: "performance", label: "Performance" },
                                            { value: "clinician", label: "Clinician" },
                                            { value: "financial", label: "Financial" },
                                            { value: "satisfaction", label: "Satisfaction" },
                                        ].map((option) => (
                                            <button
                                                type="button"
                                                key={option.value}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${typeFilter === option.value ? "text-primary font-medium" : "text-foreground"
                                                    }`}
                                                onClick={() => {
                                                    setTypeFilter(option.value as typeof typeFilter)
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

                        {/* Reports Grid */}
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            {filteredReports.length === 0 ? (
                                <div className="col-span-2 text-center py-12 text-muted-foreground">
                                    No reports found matching your criteria
                                </div>
                            ) : (
                                filteredReports.map((report, idx) => (
                                    <motion.div
                                        key={report.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <report.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-foreground truncate">{report.title}</h3>
                                                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                                                        report.status === "ready" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                                    )}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{report.desc}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>{report.date}</span>
                                                    <span>{report.size}</span>
                                                    {report.pages > 0 && <span>{report.pages} pages</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 rounded-xl bg-transparent text-xs sm:text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedReport(report)
                                                }}
                                            >
                                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />View
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 rounded-xl bg-primary text-xs sm:text-sm"
                                                onClick={(e) => handleDownload(report, e)}
                                            >
                                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />Download
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Report Details Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedReport(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border"
                        >
                            <div className="flex items-start justify-between mb-4 sm:mb-6">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                                        <selectedReport.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">{selectedReport.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                                                selectedReport.status === "ready" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {selectedReport.status}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{selectedReport.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedReport(null)}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Report Info */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="p-2 sm:p-3 rounded-xl bg-secondary/30 text-center">
                                    <p className="text-sm sm:text-lg font-bold text-foreground">{selectedReport.pages}</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">Pages</p>
                                </div>
                                <div className="p-2 sm:p-3 rounded-xl bg-secondary/30 text-center">
                                    <p className="text-sm sm:text-lg font-bold text-foreground truncate">{selectedReport.size}</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">File Size</p>
                                </div>
                                <div className="p-2 sm:p-3 rounded-xl bg-secondary/30 text-center">
                                    <p className="text-sm sm:text-lg font-bold text-foreground capitalize">{selectedReport.type}</p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">Type</p>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Summary</h3>
                                <div className="p-4 rounded-xl bg-secondary/30">
                                    <p className="text-sm text-foreground">{selectedReport.content.summary}</p>
                                </div>
                            </div>

                            {/* Key Highlights */}
                            <div className="space-y-3 mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Highlights</h3>
                                <div className="space-y-2">
                                    {selectedReport.content.highlights.map((highlight, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-xs font-medium text-primary">{idx + 1}</span>
                                            </div>
                                            <p className="text-sm text-foreground">{highlight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metrics */}
                            {selectedReport.status === "ready" && (
                                <div className="space-y-3 mb-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key Metrics</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {Object.entries(selectedReport.content.metrics).map(([key, value]) => (
                                            <div key={key} className="p-3 rounded-xl bg-primary/10 text-center">
                                                <p className="text-lg font-bold text-foreground">{value}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{key}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 rounded-xl bg-primary"
                                    onClick={() => handleDownload(selectedReport)}
                                    disabled={selectedReport.status === "processing"}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Report
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl bg-transparent"
                                    onClick={() => setSelectedReport(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
