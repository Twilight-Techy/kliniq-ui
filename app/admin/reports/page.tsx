"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin-sidebar"
import { FileText, Download, Plus, Eye, Bell, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function AdminReportsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/reports" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
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
                            <Button className="rounded-xl bg-primary">
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

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid gap-6 md:grid-cols-2">
                            {[
                                { title: "Monthly Performance Report", desc: "Patient volume, revenue, and satisfaction metrics", date: "Generated Dec 1, 2025" },
                                { title: "Clinician Activity Report", desc: "Doctor and nurse engagement statistics", date: "Generated Nov 28, 2025" },
                                { title: "Financial Summary", desc: "Revenue breakdown and billing analytics", date: "Generated Nov 25, 2025" },
                                { title: "Patient Satisfaction Survey", desc: "Feedback and ratings from patients", date: "Generated Nov 20, 2025" }
                            ].map((report, idx) => (
                                <motion.div key={report.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-2">{report.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-3">{report.desc}</p>
                                            <p className="text-xs text-muted-foreground">{report.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button size="sm" variant="outline" className="flex-1 rounded-xl bg-transparent">
                                            <Eye className="w-4 h-4 mr-2" />View
                                        </Button>
                                        <Button size="sm" className="flex-1 rounded-xl bg-primary">
                                            <Download className="w-4 h-4 mr-2" />Download
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
