"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { ClinicianSidebar } from "@/components/clinician-sidebar"
import {
    Award,
    Bell,
    Settings,
    LogOut,
    Menu,
    Home,
    Users,
    Calendar,
    TrendingUp,
    Gift,
    Star,
    CheckCircle2,
    MessageSquare,
    FileText,
    Trophy,
    Target,
} from "lucide-react"

const pointsData = {
    current: 2450,
    goal: 3000,
    thisMonth: 450,
    lastMonth: 420,
    rank: 3,
    totalClinicians: 48,
}

const activityLog = [
    { id: "1", action: "Verified triage summary", points: 5, patient: "Adebayo O.", time: "2 hours ago" },
    { id: "2", action: "Answered patient query", points: 10, patient: "Chioma E.", time: "5 hours ago" },
    { id: "3", action: "Updated medical notes", points: 15, patient: "Ibrahim M.", time: "1 day ago" },
    { id: "4", action: "Completed consultation", points: 20, patient: "Funke A.", time: "1 day ago" },
    { id: "5", action: "Verified triage summary", points: 5, patient: "Bola S.", time: "2 days ago" },
]

const rewards = [
    { id: "1", title: "Premium Badge", points: 500, description: "Unlock premium profile badge", unlocked: true },
    { id: "2", title: "Priority Support", points: 1000, description: "Get priority customer support", unlocked: true },
    { id: "3", title: "Bonus Payout", points: 3000, description: "Unlock monthly bonus payment", unlocked: false },
    { id: "4", title: "Featured Profile", points: 5000, description: "Get featured on the platform", unlocked: false },
]

export default function PointsPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <ClinicianSidebar activePath="/clinician/points" pointsData={pointsData} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Points & Rewards</h1>
                                <p className="text-sm text-muted-foreground">Track your activity and unlock rewards</p>
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
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Points Overview */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative p-6 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />

                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-2xl bg-white/20">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Total Points</h3>
                                            <p className="text-xs text-white/70">All time earnings</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-white">{pointsData.current}</span>
                                            <span className="text-white/70">/ {pointsData.goal}</span>
                                        </div>
                                        <div className="mt-3 h-3 bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(pointsData.current / pointsData.goal) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-white rounded-full"
                                            />
                                        </div>
                                        <p className="text-sm text-white/70 mt-2">{pointsData.goal - pointsData.current} points to next reward</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-6 rounded-3xl bg-card border border-border/50"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Your Rank</h3>
                                        <p className="text-sm text-muted-foreground">Among all clinicians</p>
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <div className="text-4xl font-bold text-foreground mb-2">#{pointsData.rank}</div>
                                    <p className="text-sm text-muted-foreground">out of {pointsData.totalClinicians} clinicians</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                        <span className="text-sm text-foreground">This Month</span>
                                        <span className="font-semibold text-primary flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            +{pointsData.thisMonth}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                        <span className="text-sm text-foreground">Last Month</span>
                                        <span className="font-semibold text-muted-foreground">+{pointsData.lastMonth}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Activity Log */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
                            <div className="space-y-3">
                                {activityLog.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{activity.action}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.patient} • {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                            <span className="font-semibold text-primary">+{activity.points}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Rewards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 rounded-3xl bg-card border border-border/50"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                                    <Gift className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">Available Rewards</h2>
                                    <p className="text-sm text-muted-foreground">Unlock exclusive benefits</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {rewards.map((reward) => (
                                    <div
                                        key={reward.id}
                                        className={cn(
                                            "p-5 rounded-2xl border-2 transition-all",
                                            reward.unlocked
                                                ? "bg-green-500/5 border-green-500/30"
                                                : "bg-secondary/20 border-border/50"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">{reward.title}</h3>
                                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                                            </div>
                                            {reward.unlocked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-primary">{reward.points} points</span>
                                            {reward.unlocked ? (
                                                <span className="text-xs text-green-500 font-medium">Unlocked!</span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    {reward.points - pointsData.current} more needed
                                                </span>
                                            )}
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
