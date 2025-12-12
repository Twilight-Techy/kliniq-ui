"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { authApi } from "@/lib/auth-api"
import { ApiError } from "@/lib/api-client"
import { CheckCircle, Mail, ArrowRight, Loader2 } from "lucide-react"

function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { toast } = useToast()
    const { setAuthData } = useAuth()

    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Get code from URL if present
        const codeParam = searchParams.get("code")
        if (codeParam) {
            setCode(codeParam)
        }
        // Get email from URL if present
        const emailParam = searchParams.get("email")
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [searchParams])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !code) {
            toast({
                variant: "destructive",
                title: "Missing information",
                description: "Please enter both email and verification code.",
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await authApi.verifyEmail({
                email,
                verification_code: code,
            })

            setIsVerified(true)

            // Update auth context state (this also updates localStorage)
            setAuthData(response.access_token, response.user)

            toast({
                title: "Email verified!",
                description: "Your account is now active. Redirecting...",
            })

            // Redirect based on role
            setTimeout(() => {
                switch (response.user.role) {
                    case "patient":
                        router.push("/onboarding")
                        break
                    case "clinician":
                        router.push("/clinician")
                        break
                    case "admin":
                        router.push("/admin")
                        break
                    default:
                        router.push("/onboarding")
                }
            }, 2000)
        } catch (err) {
            if (err instanceof ApiError) {
                toast({
                    variant: "destructive",
                    title: "Verification failed",
                    description: err.message,
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (!email) {
            toast({
                variant: "destructive",
                title: "Email required",
                description: "Please enter your email address first.",
            })
            return
        }

        setIsResending(true)

        try {
            await authApi.resendVerification(email)
            toast({
                title: "Code sent!",
                description: "A new verification code has been sent to your email.",
            })
        } catch (err) {
            if (err instanceof ApiError) {
                toast({
                    variant: "destructive",
                    title: "Failed to resend",
                    description: err.message,
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to resend verification code.",
                })
            }
        } finally {
            setIsResending(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b border-border/50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">K</span>
                    </div>
                    <span className="text-xl font-bold">Kliniq</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {isVerified ? (
                        // Success State
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-3">Email Verified!</h1>
                            <p className="text-muted-foreground mb-6">
                                Your account is now active. Redirecting you to your dashboard...
                            </p>
                            <div className="flex items-center justify-center gap-2 text-primary">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Redirecting...</span>
                            </div>
                        </div>
                    ) : (
                        // Verification Form
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-3">Verify Your Email</h1>
                                <p className="text-muted-foreground">
                                    Enter the verification code sent to your email address.
                                </p>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20 transition-all duration-300"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-foreground">
                                        Verification Code
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="Enter 6-character code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20 transition-all duration-300 text-center text-lg tracking-widest font-mono"
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full h-12 text-base font-medium overflow-hidden group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-xl"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Verify Email
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Didn&apos;t receive the code?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                                >
                                    {isResending ? "Sending..." : "Resend verification code"}
                                </button>
                            </div>

                            <div className="mt-8 text-center">
                                <Link
                                    href="/auth"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    ← Back to login
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            }
        >
            <VerifyContent />
        </Suspense>
    )
}
