// lib/admin-api.ts
/**
 * Admin API client for the hospital administration portal.
 *
 * Every value returned here comes from the backend. Fields the schema has no
 * source for arrive as null so the UI can show "unavailable" rather than a
 * fabricated figure.
 */

import { apiClient } from './api-client'

const getToken = (): string | undefined => {
    if (typeof window === 'undefined') return undefined
    return localStorage.getItem('kliniq_token') || undefined
}

// =============================================================================
// TYPES
// =============================================================================

export interface AdminHospital {
    id: string
    name: string
    code: string
    city: string | null
    state: string | null
    rating: number | null
    subscription_plan: string | null
    subscription_expires: string | null
    days_until_renewal: number | null
}

export interface AdminStats {
    total_patients: number
    total_patients_change: number | null
    active_clinicians: number
    total_clinicians: number
    consultations: number
    consultations_change: number | null
    revenue: number
    revenue_change: number | null
    currency: string
}

export interface AdminOverview {
    hospital: AdminHospital
    stats: AdminStats
    weekly_consultations: { day: string; count: number }[]
    departments: { name: string; count: number; percentage: number }[]
}

export interface AdminClinician {
    id: string
    name: string
    email: string
    phone: string | null
    role: string | null
    specialty: string | null
    years_of_experience: number | null
    rating: number | null
    total_consultations: number
    points: number
    status: string | null
    is_available: boolean
    avatar_url: string | null
}

export interface AdminPatient {
    id: string
    name: string
    email: string
    phone: string | null
    gender: string | null
    date_of_birth: string | null
    blood_type: string | null
    city: string | null
    state: string | null
    preferred_language: string | null
    onboarding_completed: boolean
    joined: string | null
}

export interface AdminAppointment {
    id: string
    patient_name: string
    scheduled_date: string | null
    scheduled_time: string | null
    duration_minutes: number | null
    type: string | null
    status: string | null
    location: string | null
    notes: string | null
}

export interface AdminInvoice {
    id: string
    invoice_number: string
    amount: number
    currency: string
    status: string | null
    due_date: string | null
    paid_at: string | null
    description: string | null
}

export interface AdminReport {
    id: string
    title: string
    description: string | null
    type: string | null
    status: string | null
    file_url: string | null
    file_size_bytes: number | null
    page_count: number | null
    summary: string | null
  highlights: string[]
  metrics: Record<string, string | number>
    created_at: string | null
}

export interface AdminSettings {
    id: string
    name: string
    hospital_code: string
    type: string | null
    address: string | null
    city: string | null
    state: string | null
    phone: string | null
    email: string | null
    website: string | null
    logo_url: string | null
    is_active: boolean
    subscription_plan: string | null
    subscription_expires: string | null
}

// =============================================================================
// CALLS
// =============================================================================

export const adminApi = {
    getOverview: () => apiClient.get<AdminOverview>('/admin/overview', getToken()),

    getClinicians: (params?: { role?: string; search?: string }) => {
        const qs = new URLSearchParams()
        if (params?.role && params.role !== 'all') qs.set('role', params.role)
        if (params?.search) qs.set('search', params.search)
        const suffix = qs.toString() ? `?${qs}` : ''
        return apiClient.get<{ clinicians: AdminClinician[]; total: number }>(
            `/admin/clinicians${suffix}`,
            getToken(),
        )
    },

    getPatients: (params?: { search?: string; limit?: number; offset?: number }) => {
        const qs = new URLSearchParams()
        if (params?.search) qs.set('search', params.search)
        if (params?.limit) qs.set('limit', String(params.limit))
        if (params?.offset) qs.set('offset', String(params.offset))
        const suffix = qs.toString() ? `?${qs}` : ''
        return apiClient.get<{
            patients: AdminPatient[]
            total: number
            limit: number
            offset: number
        }>(`/admin/patients${suffix}`, getToken())
    },

    getAppointments: (status?: string) => {
        const suffix = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''
        return apiClient.get<{ appointments: AdminAppointment[]; total: number }>(
            `/admin/appointments${suffix}`,
            getToken(),
        )
    },

    getAnalytics: () =>
        apiClient.get<{
            monthly_consultations: { month: string; count: number }[]
            appointment_status: { status: string; count: number }[]
            escalated_queries_30d: number
        }>('/admin/analytics', getToken()),

    getBilling: () =>
        apiClient.get<{
            invoices: AdminInvoice[]
            totals: { paid: number; pending: number; count: number }
        }>('/admin/billing', getToken()),

    getReports: () =>
        apiClient.get<{ reports: AdminReport[]; total: number }>('/admin/reports', getToken()),

    getSettings: () => apiClient.get<AdminSettings>('/admin/settings', getToken()),

    updateSettings: (payload: Partial<AdminSettings>) =>
        apiClient.patch<AdminSettings>('/admin/settings', payload, getToken()),
}

/** Formats a currency amount, or a dash when the backend has no figure. */
export function formatMoney(amount: number | null | undefined, currency = 'NGN'): string {
    if (amount === null || amount === undefined) return '—'
    const symbol = currency === 'NGN' ? '₦' : ''
    if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`
    if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`
    return `${symbol}${amount.toLocaleString()}`
}

/** Renders a percentage change, or null when there is no baseline. */
export function formatChange(change: number | null | undefined): string | null {
    if (change === null || change === undefined) return null
    return `${change >= 0 ? '+' : ''}${change}%`
}
