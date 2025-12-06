"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export function NotificationsDropdown() {
    const [showNotifications, setShowNotifications] = useState(false)

    const notifications = [
        { title: "Appointment Reminder", message: "Dr. Adeyemi tomorrow at 10:00 AM", time: "1h ago", unread: true },
        { title: "Prescription Ready", message: "Your medication is ready for pickup", time: "3h ago", unread: true },
        { title: "Lab Results", message: "Blood test results are now available", time: "1d ago", unread: false },
    ]

    const hasUnread = notifications.some(n => n.unread)

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
            >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
            </button>

            <AnimatePresence>
                {showNotifications && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 w-80 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-40"
                        >
                            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                                <h3 className="font-semibold text-foreground">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map((notif, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer",
                                            notif.unread && "bg-primary/5"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            {notif.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-foreground">{notif.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-border/50 bg-secondary/20">
                                <button className="text-xs text-primary hover:underline w-full text-center">
                                    View All Notifications
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
