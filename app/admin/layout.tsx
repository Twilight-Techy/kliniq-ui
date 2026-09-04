"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Gate for the hospital administration portal.
 *
 * Previously every /admin page rendered for anyone who knew the URL. This
 * checks for a session and an admin role before rendering anything. The
 * backend enforces the same rule independently through require_admin, so a
 * crafted request cannot bypass this either.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [state, setState] = useState<"checking" | "allowed" | "denied">("checking")

    useEffect(() => {
        const token = localStorage.getItem("kliniq_token")
        const raw = localStorage.getItem("kliniq_user")

        if (!token || !raw) {
            router.replace("/auth?next=/admin")
            return
        }

        try {
            const user = JSON.parse(raw)
            setState(user?.role === "admin" ? "allowed" : "denied")
        } catch {
            router.replace("/auth?next=/admin")
        }
    }, [router])

    if (state === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (state === "denied") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                <div>
                    <h1 className="text-xl font-semibold">Administrators only</h1>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        This area shows hospital-wide data and is limited to administrator
                        accounts.
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.replace("/")}>
                    Back to Kliniq
                </Button>
            </div>
        )
    }

    return <>{children}</>
}
