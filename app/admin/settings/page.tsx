"use client"

import { adminApi, type AdminSettings } from "@/lib/admin-api"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Building2, Shield, Bell as BellIcon, ChevronRight, Menu, Edit2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function AdminSettingsPage() {
    const [hospital, setHospital] = useState<AdminSettings | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        adminApi
            .getSettings()
            .then((h) => { if (!cancelled) setHospital(h) })
            .catch((e) => { if (!cancelled) setLoadError(e?.message || "Could not load settings.") })
        return () => { cancelled = true }
    }, [])

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/settings" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">System Settings</h1>
                                <p className="text-sm text-muted-foreground">Configure hospital and platform settings</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-3xl bg-card border border-border/50">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground">Hospital Profile</h2>
                                        <p className="text-sm text-muted-foreground">Update hospital information</p>
                                    </div>
                                </div>
                                {!isEditingProfile && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                        onClick={() => setIsEditingProfile(true)}
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Hospital Name</label>
                                    <Input key={hospital?.id ?? "loading"} defaultValue={hospital?.name ?? ""} className="rounded-xl" disabled={!isEditingProfile} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                                        <Input key={`${hospital?.id ?? "loading"}-email`} defaultValue={hospital?.email ?? ""} className="rounded-xl" disabled={!isEditingProfile} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                                        <Input key={`${hospital?.id ?? "loading"}-phone`} defaultValue={hospital?.phone ?? ""} className="rounded-xl" disabled={!isEditingProfile} />
                                    </div>
                                </div>
                            </div>
                            {isEditingProfile && (
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="outline" className="rounded-xl bg-transparent" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                                    <Button className="rounded-xl bg-primary" onClick={() => setIsEditingProfile(false)}>Save Changes</Button>
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="p-6 rounded-3xl bg-card border border-border/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Security & Access</h2>
                                    <p className="text-sm text-muted-foreground">Manage platform security</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {["User Permissions", "API Keys", "Audit Logs", "Data Backup"].map((item) => (
                                    <button key={item} className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                        <span className="text-foreground font-medium">{item}</span>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="p-6 rounded-3xl bg-card border border-border/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-kliniq-cyan/10 flex items-center justify-center">
                                    <BellIcon className="w-5 h-5 text-kliniq-cyan" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
                                    <p className="text-sm text-muted-foreground">Configure system notifications</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {["System Alerts", "User Activity", "Performance Reports"].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                                        <span className="text-foreground">{item}</span>
                                        <div className="w-12 h-6 rounded-full bg-primary relative">
                                            <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
