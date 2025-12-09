"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Home, Users, Calendar, Award, Settings, LogOut, Star, X, MessageSquare, ClipboardList } from "lucide-react"
import { useClinicianRole } from "@/contexts/clinician-role-context"

const doctorNavItems = [
    { icon: Home, label: "Dashboard", href: "/clinician" },
    { icon: Users, label: "Patients", href: "/clinician/patients" },
    { icon: MessageSquare, label: "Messages", href: "/clinician/messages" },
    { icon: Calendar, label: "Schedule", href: "/clinician/schedule" },
    { icon: Award, label: "Points", href: "/clinician/points", badge: "New" },
    { icon: Settings, label: "Settings", href: "/clinician/settings" },
]

const nurseNavItems = [
    { icon: Home, label: "Dashboard", href: "/clinician" },
    { icon: Users, label: "Patients", href: "/clinician/patients" },
    { icon: MessageSquare, label: "Messages", href: "/clinician/messages" },
    { icon: ClipboardList, label: "Requests", href: "/clinician/requests" },
    { icon: Award, label: "Points", href: "/clinician/points", badge: "New" },
    { icon: Settings, label: "Settings", href: "/clinician/settings" },
]

interface ClinicianSidebarProps {
    activePath: string
    pointsData?: { current: number }
    sidebarOpen?: boolean
    onClose?: () => void
}

export function ClinicianSidebar({
    activePath,
    pointsData,
    sidebarOpen = false,
    onClose
}: ClinicianSidebarProps) {
    const { role, setRole, isLoading } = useClinicianRole()
    const navItems = role === "nurse" ? nurseNavItems : doctorNavItems
    const patientBadge = role === "nurse" ? 12 : 7

    const SidebarContent = ({ layoutId }: { layoutId: string }) => (
        <>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-8 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">K</span>
                    </div>
                </div>
                <span className="text-xl font-bold text-foreground">Kliniq</span>
            </Link>

            {/* Role Switcher */}
            <div className="relative p-1.5 bg-secondary/50 rounded-2xl mb-6">
                <div className="grid grid-cols-2 gap-1">
                    {(["nurse", "doctor"] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={cn(
                                "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                                role === r ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {role === r && (
                                <motion.div
                                    layoutId={layoutId}
                                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative capitalize">{r}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Profile Card */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-border/50 mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {role === "nurse" ? "NA" : "DR"}
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">{role === "nurse" ? "Nurse Amaka" : "Dr. Oluwaseun"}</p>
                        <p className="text-xs text-muted-foreground">{role === "nurse" ? "Triage Specialist" : "General Physician"}</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Online</span>
                    </div>
                    {pointsData && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                            <Star className="w-3 h-3 fill-primary" />
                            <span>{pointsData.current} pts</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = activePath === item.href
                    const badge = item.href === "/clinician/patients" ? patientBadge :
                        item.href === "/clinician/requests" ? 5 : item.badge

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
                            {badge && (
                                <span
                                    className={cn(
                                        "ml-auto px-2 py-0.5 rounded-full text-xs font-medium",
                                        typeof badge === "number" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                                    )}
                                >
                                    {badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border/50 space-y-2">
                <ThemeToggle />
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </>
    )

    if (isLoading) {
        return (
            <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border/50 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-secondary/50 rounded-xl" />
                    <div className="h-12 bg-secondary/50 rounded-xl" />
                    <div className="h-24 bg-secondary/50 rounded-xl" />
                </div>
            </aside>
        )
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border/50 p-6">
                <SidebarContent layoutId="roleIndicator" />
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
                            <SidebarContent layoutId="mobileRoleIndicator" />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
