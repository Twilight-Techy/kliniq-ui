"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin-sidebar"
import { CreditCard, Download, DollarSign, TrendingUp, CheckCircle2, Clock, Bell, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useToast } from "@/hooks/use-toast"

const invoices = [
    { id: "INV-001", client: "Lagos General", amount: "₦125,000", amountRaw: 125000, status: "paid", date: "Dec 1, 2025" },
    { id: "INV-002", client: "National Hospital", amount: "₦98,500", amountRaw: 98500, status: "pending", date: "Dec 3, 2025" },
    { id: "INV-003", client: "City Clinic", amount: "₦45,000", amountRaw: 45000, status: "paid", date: "Dec 4, 2025" },
    { id: "INV-004", client: "Eko Hospital", amount: "₦210,000", amountRaw: 210000, status: "paid", date: "Dec 5, 2025" },
    { id: "INV-005", client: "Reddington Hospital", amount: "₦87,500", amountRaw: 87500, status: "pending", date: "Dec 6, 2025" },
]

export default function AdminBillingPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { toast } = useToast()

    const handleExport = () => {
        const csvContent = [
            ["Invoice ID", "Client", "Amount (NGN)", "Status", "Date"],
            ...invoices.map(inv => [inv.id, inv.client, inv.amountRaw.toString(), inv.status, inv.date])
        ].map(row => row.join(",")).join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({ title: "Downloaded!", description: "Invoice data saved as CSV" })
    }

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar activePath="/admin/billing" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Billing & Payments</h1>
                                <p className="text-sm text-muted-foreground">Manage invoices and track revenue</p>
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
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="grid gap-6 md:grid-cols-4">
                            {[
                                { label: "Total Revenue", value: "₦4.2M", icon: DollarSign }, { label: "Pending", value: "₦245K", icon: Clock },
                                { label: "Collected", value: "₦3.96M", icon: CheckCircle2 }, { label: "Growth", value: "+18.7%", icon: TrendingUp }
                            ].map((stat, idx) => (
                                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-3xl bg-card border border-border/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <stat.icon className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-6 rounded-3xl bg-card border border-border/50">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-foreground">Recent Invoices</h2>
                                <Button
                                    variant="outline"
                                    className="rounded-xl bg-transparent"
                                    onClick={handleExport}
                                >
                                    <Download className="w-4 h-4 mr-2" />Export
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {invoices.map((inv) => (
                                    <div key={inv.id} className="p-4 rounded-2xl bg-secondary/30 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-foreground">{inv.id}</p>
                                            <p className="text-sm text-muted-foreground">{inv.client} • {inv.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-foreground font-semibold">{inv.amount}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${inv.status === "paid" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                                }`}>{inv.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
