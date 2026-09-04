"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { adminApi, type AdminSettings } from "@/lib/admin-api"
import {
    Building2,
    Home,
    Users,
    UserCheck,
    Calendar,
    BarChart3,
    CreditCard,
    FileText,
    Settings,
    HelpCircle,
    LogOut,
    Sparkles,
    X,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
    { icon: Home, label: "Overview", href: "/admin" },
    { icon: Users, label: "Patients", href: "/admin/patients" },
    { icon: UserCheck, label: "Clinicians", href: "/admin/clinicians" },
    { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: CreditCard, label: "Billing", href: "/admin/billing" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
]

interface AdminSidebarProps {
    activePath: string
    sidebarOpen?: boolean
    onClose?: () => void
}

export function AdminSidebar({ activePath, sidebarOpen = false, onClose }: AdminSidebarProps) {
    const [hospital, setHospital] = useState<AdminSettings | null>(null)

    useEffect(() => {
        let cancelled = false
        adminApi
            .getSettings()
            .then((h) => { if (!cancelled) setHospital(h) })
            .catch(() => { /* sidebar degrades to placeholders */ })
        return () => { cancelled = true }
    }, [])

    const renewalDays = hospital?.subscription_expires
        ? Math.max(
              0,
              Math.ceil(
                  (new Date(hospital.subscription_expires).getTime() - Date.now()) / 86_400_000,
              ),
          )
        : null

    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        router.push("/auth")
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="w-5 h-5 text-primary-foreground" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse-glow opacity-50" />
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                                Kliniq
                            </span>
                            <p className="text-xs text-muted-foreground">Admin Portal</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hospital Info */}
            <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                            {hospital?.name ?? "Hospital"}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                            {hospital?.subscription_plan ?? "—"}
                        </p>
                    </div>
                </div>
                {renewalDays !== null && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Subscription</span>
                            <span className="text-xs text-muted-foreground">
                                {renewalDays} days left
                            </span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                style={{ width: `${Math.min(100, Math.round((renewalDays / 365) * 100))}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = activePath === item.href || (item.href !== "/admin" && activePath.startsWith(item.href))
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                            {isActive && <motion.div layoutId="activeSidebarIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 space-y-1">
                <div className="px-4 py-3">
                    <ThemeToggle />
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                    Help & Support
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-card/80 backdrop-blur-xl border-r border-border/50">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                        />
                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-card/80 backdrop-blur-xl border-r border-border/50 z-50 flex flex-col"
                        >
                            {/* Close button */}
                            <div className="flex items-center justify-end p-4">
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
