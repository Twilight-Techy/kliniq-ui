"use client"

import { ClinicianRoleProvider } from "@/contexts/clinician-role-context"

export default function ClinicianLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClinicianRoleProvider>
            {children}
        </ClinicianRoleProvider>
    )
}
