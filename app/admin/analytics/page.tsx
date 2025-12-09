"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin-sidebar"
import { BarChart3, TrendingUp, PieChart, Download, Bell, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useToast } from "@/hooks/use-toast"

export default function AdminAnalyticsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { toast } = useToast()
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/analytics" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                                <p className="text-sm text-muted-foreground">Detailed insights and trends</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-xl bg-transparent"
                                onClick={() => toast({ title: "Exporting Analytics", description: "Analytics report exporting to PDF..." })}
                            >
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
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                { label: "Revenue (MTD)", value: "₦4.2M", change: "+18.7%", icon: TrendingUp },
                                { label: "Consultations", value: "1,234", change: "+12.3%", icon: BarChart3 },
                                { label: "Satisfaction", value: "96%", change: "+2.4%", icon: PieChart }
                            ].map((stat, idx) => (
                                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-card border border-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <stat.icon className="w-8 h-8 text-primary" />
                                        <span className="text-sm font-medium text-green-500">{stat.change}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="p-6 rounded-3xl bg-card border border-border/50">
                                <h2 className="text-lg font-semibold text-foreground mb-4">Top Performing Doctors</h2>
                                <div className="space-y-3">
                                    {["Dr. Oluwaseun", "Dr. Amara", "Dr. Chidinma"].map((name, idx) => (
                                        <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                            <span className="text-foreground">{name}</span>
                                            <span className="text-primary font-medium">{156 - idx * 20} patients</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-card border border-border/50">
                                <h2 className="text-lg font-semibold text-foreground mb-4">Patient Growth</h2>
                                <div className="h-48 flex items-end justify-between gap-2">
                                    {[65, 85, 72, 90, 78, 95, 88].map((h, idx) => (
                                        <div key={idx} className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:opacity-80"
                                            style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
