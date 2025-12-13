// lib/history-api.ts
// API client for medical history endpoints

import { apiClient } from './api-client'

// ============================================================================
// HELPER
// ============================================================================

const getToken = (): string | undefined => {
    if (typeof window === 'undefined') return undefined
    return localStorage.getItem('kliniq_token') || undefined
}

// ============================================================================
// TYPES
// ============================================================================

export type MedicalHistoryType = 'consultation' | 'prescription' | 'test' | 'diagnosis'

export interface MedicalHistoryResponse {
    id: string
    type: MedicalHistoryType
    title: string
    doctor_name?: string
    description?: string
    date: string
    status?: string
    created_at: string
}

export interface MedicalHistoryListResponse {
    history: MedicalHistoryResponse[]
    total: number
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const historyApi = {
    /**
     * Get all medical history for the current patient
     */
    getHistory: async (type?: string): Promise<MedicalHistoryListResponse> => {
        const token = getToken()
        const params = type && type !== 'all' ? `?type=${type}` : ''
        return apiClient.get<MedicalHistoryListResponse>(`/history${params}`, token)
    },

    /**
     * Get a single history item by ID
     */
    getHistoryItem: async (historyId: string): Promise<MedicalHistoryResponse> => {
        const token = getToken()
        return apiClient.get<MedicalHistoryResponse>(`/history/${historyId}`, token)
    },
}
