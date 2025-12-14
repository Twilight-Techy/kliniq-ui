"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Home, MessageSquare, Calendar, History, Settings, LogOut, X, Mic } from "lucide-react"

const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: 3 },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: Mic, label: "Consultations", href: "/dashboard/consultations" },
    { icon: History, label: "History", href: "/dashboard/history" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

interface PatientSidebarProps {
    activePath: string
    sidebarOpen?: boolean
    onClose?: () => void
}

export function PatientSidebar({ activePath, sidebarOpen = false, onClose }: PatientSidebarProps) {
    const router = useRouter()
    const { logout, user } = useAuth()

    const handleLogout = () => {
        logout()
        router.push("/auth")
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-10 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">K</span>
                    </div>
                </div>
                <span className="text-xl font-bold text-foreground">Kliniq</span>
            </Link>

            {/* User Profile Card */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/50 mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {user?.first_name?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">
                            {user ? `${user.first_name} ${user.last_name}` : 'Patient'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            ID: {user?.id ? `KLQ-${user.id.substring(0, 4).toUpperCase()}` : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>{user?.role === 'patient' ? 'Patient' : 'User'}</span>
                    <span className="text-border">•</span>
                    <span>{user?.is_verified ? 'Verified' : 'Not Verified'}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = activePath === item.href
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border/50 space-y-2">
                <ThemeToggle />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border/50 p-6">
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
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border/50 p-6 z-50 flex flex-col"
                        >
                            {/* Close button */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-medium text-muted-foreground">Menu</span>
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
