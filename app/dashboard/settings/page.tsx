"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { PatientSidebar } from "@/components/patient-sidebar"
import {
    Settings as SettingsIcon,
    Bell,
    LogOut,
    Menu,
    Home,
    MessageSquare,
    Calendar,
    History,
    User,
    Globe,
    Shield,
    Smartphone,
    Link as LinkIcon,
    Trash2,
    Plus,
    Check,
    ChevronRight,
    Edit,
} from "lucide-react"

const languages = [
    { code: "yo", name: "Yoruba", native: "Yorùbá" },
    { code: "ig", name: "Igbo", native: "Igbo" },
    { code: "ha", name: "Hausa", native: "Hausa" },
    { code: "en", name: "English", native: "English" },
    { code: "pcm", name: "Pidgin", native: "Naija" },
]

const linkedDoctors = [
    { id: "1", name: "Dr. Oluwaseun Adeyemi", specialty: "General Medicine", code: "DOC-4521" },
    { id: "2", name: "Dr. Amara Obi", specialty: "Cardiology", code: "DOC-7832" },
]

export default function SettingsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState("yo")
    const [notifications, setNotifications] = useState({
        appointments: true,
        messages: true,
        reminders: true,
        updates: false,
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <PatientSidebar activePath="/dashboard/settings" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Settings</h1>
                                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
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
                        {/* Profile Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                                    <p className="text-sm text-muted-foreground">Update your personal details</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                                    <Input defaultValue="Adebayo Ogundimu" className="rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Patient ID</label>
                                    <Input defaultValue="KLQ-2847" disabled className="rounded-xl bg-secondary/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                                    <Input type="email" defaultValue="adebayo@example.com" className="rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                                    <Input type="tel" defaultValue="+234 801 234 5678" className="rounded-xl" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                                    <Input defaultValue="Lagos, Nigeria" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="outline" className="rounded-xl bg-transparent">
                                    Cancel
                                </Button>
                                <Button className="rounded-xl bg-gradient-to-r from-primary to-primary/80">
                                    Save Changes
                                </Button>
                            </div>
                        </motion.div>

                        {/* Language Preferences */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Language</h2>
                                    <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setSelectedLanguage(lang.code)}
                                        className={cn(
                                            "p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                                            selectedLanguage === lang.code
                                                ? "border-primary bg-primary/10"
                                                : "border-border/50 hover:border-primary/30"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-foreground">{lang.name}</p>
                                                <p className="text-sm text-muted-foreground">{lang.native}</p>
                                            </div>
                                            {selectedLanguage === lang.code && <Check className="w-5 h-5 text-primary" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kliniq-cyan/20 to-kliniq-cyan/10 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-kliniq-cyan" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                                    <p className="text-sm text-muted-foreground">Manage how you receive updates</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                                        <div>
                                            <p className="font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified about {key.toLowerCase()} activities
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-colors duration-200 relative",
                                                value ? "bg-primary" : "bg-muted-foreground/30"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200",
                                                    value ? "right-0.5" : "left-0.5"
                                                )}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Linked Doctors */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground">Linked Doctors</h2>
                                        <p className="text-sm text-muted-foreground">Doctors with access to your records</p>
                                    </div>
                                </div>
                                <Button size="sm" className="rounded-xl bg-primary">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Link Doctor
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {linkedDoctors.map((doctor) => (
                                    <div key={doctor.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                                        <div>
                                            <p className="font-medium text-foreground">{doctor.name}</p>
                                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Code: {doctor.code}</p>
                                        </div>
                                        <button className="p-2 rounded-xl hover:bg-destructive/10 transition-colors">
                                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Privacy & Security */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
                                    <p className="text-sm text-muted-foreground">Manage your data and security settings</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <span className="text-foreground font-medium">Change Password</span>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <span className="text-foreground font-medium">Privacy Policy</span>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                    <span className="text-foreground font-medium">Data Download</span>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive">
                                    <span className="font-medium">Delete Account</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}
