"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { onboardingApi, LanguageOption } from "@/lib/onboarding-api"
import { ApiError } from "@/lib/api-client"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  User,
  Building2,
  Phone,
  Calendar,
  MapPin,
  Sparkles,
  Volume2,
  Link2,
  Search,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3

interface Language {
  id: LanguageOption
  name: string
  nativeName: string
  greeting: string
  flag: string
}

// Only supported languages: English, Hausa, Igbo, Yoruba
const languages: Language[] = [
  { id: "english", name: "English", nativeName: "English", greeting: "Hello!", flag: "🇬🇧" },
  { id: "yoruba", name: "Yoruba", nativeName: "Èdè Yorùbá", greeting: "Ẹ káàbọ̀!", flag: "🇳🇬" },
  { id: "hausa", name: "Hausa", nativeName: "Harshen Hausa", greeting: "Sannu!", flag: "🇳🇬" },
  { id: "igbo", name: "Igbo", nativeName: "Asụsụ Igbo", greeting: "Nnọọ!", flag: "🇳🇬" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
  })
  const [hospitalCode, setHospitalCode] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [linkedHospital, setLinkedHospital] = useState<{ name: string; location: string; type: string } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [authLoading, isAuthenticated, router])

  // Check onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated) return

      try {
        const status = await onboardingApi.getStatus()
        if (status.onboarding_completed) {
          // Already completed onboarding, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (err) {
        // If error, continue with onboarding
        console.error("Failed to check onboarding status:", err)
      }
    }

    if (mounted && isAuthenticated) {
      checkOnboardingStatus()
    }
  }, [mounted, isAuthenticated, router])

  // Pre-fill phone from user data if available
  useEffect(() => {
    if (user?.phone) {
      setProfile(prev => ({ ...prev, phone: user.phone || "" }))
    }
  }, [user])

  const handlePlayGreeting = (langId: string) => {
    setPlayingAudio(langId)
    // Simulate audio playback
    setTimeout(() => setPlayingAudio(null), 2000)
  }

  const handleLinkHospital = () => {
    if (hospitalCode.length >= 6) {
      // Simulate hospital lookup (will be implemented with real API later)
      setLinkedHospital({
        name: "Lagos University Teaching Hospital",
        location: "Idi-Araba, Lagos",
        type: "Teaching Hospital",
      })
    }
  }

  const handleStepChange = async (nextStep: Step) => {
    setIsSaving(true)

    try {
      // Save data for current step before moving to next
      if (currentStep === 1 && selectedLanguage) {
        await onboardingApi.setLanguage(selectedLanguage)
      } else if (currentStep === 2) {
        await onboardingApi.updateProfile({
          phone: profile.phone || undefined,
          date_of_birth: profile.dateOfBirth || undefined,
          gender: profile.gender || undefined,
          city: profile.city || undefined,
          state: profile.state || undefined,
        })
      }

      setCurrentStep(nextStep)
    } catch (err) {
      if (err instanceof ApiError) {
        toast({
          variant: "destructive",
          title: "Failed to save",
          description: err.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save your information. Please try again.",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Complete onboarding
      await onboardingApi.complete()

      toast({
        title: "Welcome to Kliniq!",
        description: "Your profile is set up. Let's get started!",
      })

      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        toast({
          variant: "destructive",
          title: "Failed to complete",
          description: err.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to complete onboarding. Please try again.",
        })
      }
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedLanguage !== null
      case 2:
        return profile.phone.length > 0
      case 3:
        return true // Hospital linking is optional
      default:
        return false
    }
  }

  const steps = [
    { number: 1, label: "Language", icon: Globe },
    { number: 2, label: "Profile", icon: User },
    { number: 3, label: "Link Hospital", icon: Building2 },
  ]

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              top: `${15 + i * 18}%`,
              left: `${5 + i * 8}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="absolute w-2 h-2 bg-accent/20 rounded-full animate-float"
            style={{
              top: `${20 + i * 16}%`,
              right: `${8 + i * 6}%`,
              animationDelay: `${i * 0.5 + 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
          </div>
          <span className="text-xl font-bold text-foreground">Kliniq</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 md:py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-2 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted
                          ? "var(--primary)"
                          : isActive
                            ? "var(--primary)"
                            : "var(--secondary)",
                      }}
                      className={cn(
                        "relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                        isActive && "shadow-lg shadow-primary/30",
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                      ) : (
                        <Icon
                          className={cn(
                            "w-5 h-5 md:w-6 md:h-6 transition-colors",
                            isActive ? "text-primary-foreground" : "text-muted-foreground",
                          )}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeStep"
                          className="absolute inset-0 rounded-2xl ring-2 ring-primary ring-offset-2 ring-offset-background"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        "text-xs md:text-sm mt-2 font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="w-8 md:w-16 h-0.5 mx-2 md:mx-4 rounded-full overflow-hidden bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step.number ? "100%" : "0%" }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Translation
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Choose Your Language</h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Kliniq will communicate with you in your preferred language for a better healthcare experience
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={cn(
                      "relative group p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden",
                      selectedLanguage === lang.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5",
                    )}
                  >
                    {/* Selected indicator */}
                    {selectedLanguage === lang.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <span className="text-2xl mb-3 block">{lang.flag}</span>
                      <h3 className="font-semibold text-foreground mb-0.5">{lang.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{lang.nativeName}</p>

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayGreeting(lang.id)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation()
                            handlePlayGreeting(lang.id)
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer",
                          playingAudio === lang.id ? "text-primary" : "text-muted-foreground hover:text-primary",
                        )}
                      >
                        <Volume2 className={cn("w-3.5 h-3.5", playingAudio === lang.id && "animate-pulse")} />
                        <span>{lang.greeting}</span>
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Complete Your Profile</h1>
                <p className="text-muted-foreground text-lg">This helps us personalize your healthcare experience</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+234 XXX XXX XXXX"
                      className="pl-12 h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-foreground">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                      className="pl-12 h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">
                      City
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        placeholder="Lagos"
                        className="pl-12 h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-foreground">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      placeholder="Lagos State"
                      className="h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Link Your Hospital</h1>
                <p className="text-muted-foreground text-lg">
                  Connect with a healthcare facility for seamless medical services
                </p>
              </div>

              {/* Doctor Code Input */}
              <div className="space-y-4">
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border/50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Enter Hospital Code</h3>
                        <p className="text-xs text-muted-foreground">Found on hospital registration documents</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Input
                        value={hospitalCode}
                        onChange={(e) => setHospitalCode(e.target.value.toUpperCase())}
                        placeholder="e.g., HOSP-A1B2C3"
                        maxLength={12}
                        className="h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary font-mono text-lg tracking-wider uppercase"
                      />
                      <Button
                        onClick={handleLinkHospital}
                        disabled={hospitalCode.length < 6}
                        className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90"
                      >
                        Link
                      </Button>
                    </div>
                  </div>
                </div>

                {/* OR Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground">Or search</span>
                  </div>
                </div>

                {/* Search Doctor/Hospital */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by hospital name or location..."
                      className="pl-12 h-12 bg-secondary/30 border-border/50 rounded-xl focus:border-primary"
                    />
                  </div>
                </div>

                {/* Linked Hospital Card */}
                <AnimatePresence>
                  {linkedHospital && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border-2 border-primary/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">{linkedHospital.name}</h3>
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{linkedHospital.type}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{linkedHospital.location}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Skip hint */}
                <p className="text-center text-sm text-muted-foreground">
                  You can also skip this step and link a hospital later
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 max-w-lg mx-auto">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))}
            disabled={currentStep === 1 || isSaving}
            className="h-12 px-6 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={() => {
              if (currentStep < 3) {
                handleStepChange((currentStep + 1) as Step)
              } else {
                handleComplete()
              }
            }}
            disabled={!canProceed() || isLoading || isSaving}
            className="relative h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              {isLoading || isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {currentStep === 3 ? "Complete Setup" : "Continue"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </div>
      </main>
    </div>
  )
}
