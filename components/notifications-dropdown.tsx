"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { notificationsApi, Notification } from "@/lib/notifications-api"

export function NotificationsDropdown() {
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const data = await notificationsApi.getNotifications(20, false)
            setNotifications(data.notifications)
            setUnreadCount(data.unread_count)
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
            setNotifications([])
            setUnreadCount(0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (showNotifications) {
            fetchNotifications()
        }
    }, [showNotifications])

    const handleMarkAllRead = async () => {
        try {
            await notificationsApi.markAllRead()
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error("Failed to mark all as read:", error)
        }
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return `${diffDays}d ago`
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
            >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
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
                            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 flex items-center justify-between">
                                <h3 className="font-semibold text-foreground">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" />
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {loading ? (
                                    <div className="p-8 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                "p-4 border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors cursor-pointer",
                                                !notif.is_read && "bg-primary/5"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-foreground">{notif.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-1 truncate">{notif.message}</p>
                                                    <p className="text-xs text-muted-foreground/70 mt-1">{formatTime(notif.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
