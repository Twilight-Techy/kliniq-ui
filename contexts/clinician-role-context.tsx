"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type ClinicianRole = "nurse" | "doctor"

interface ClinicianRoleContextType {
    role: ClinicianRole
    setRole: (role: ClinicianRole) => void
    isLoading: boolean
}

const ClinicianRoleContext = createContext<ClinicianRoleContextType | undefined>(undefined)

export function ClinicianRoleProvider({ children }: { children: ReactNode }) {
    const [role, setRoleState] = useState<ClinicianRole>("doctor")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load role from localStorage on mount
        const savedRole = localStorage.getItem("clinicianRole") as ClinicianRole
        if (savedRole === "nurse" || savedRole === "doctor") {
            setRoleState(savedRole)
        }
        setIsLoading(false)
    }, [])

    const setRole = (newRole: ClinicianRole) => {
        setRoleState(newRole)
        localStorage.setItem("clinicianRole", newRole)
    }

    return (
        <ClinicianRoleContext.Provider value={{ role, setRole, isLoading }}>
            {children}
        </ClinicianRoleContext.Provider>
    )
}

export function useClinicianRole() {
    const context = useContext(ClinicianRoleContext)
    if (context === undefined) {
        throw new Error("useClinicianRole must be used within a ClinicianRoleProvider")
    }
    return context
}
