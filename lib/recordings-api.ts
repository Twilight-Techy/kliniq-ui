// lib/recordings-api.ts
// API client for recordings endpoints

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

export type RecordingStatus = 'processing' | 'completed' | 'failed'

export interface RecordingResponse {
    id: string
    title: string
    appointment_id?: string
    doctor_name?: string
    specialty?: string
    duration_seconds: number
    file_size_bytes?: number
    file_url?: string
    transcript?: string
    status: RecordingStatus
    created_at: string
}

export interface RecordingListResponse {
    recordings: RecordingResponse[]
    total: number
}

export interface RecordingCreateRequest {
    title: string
    appointment_id?: string
    duration_seconds?: number
}

export interface RecordingUploadRequest {
    file_url: string
    file_size_bytes?: number
    duration_seconds?: number
}

export interface RecordingActionResponse {
    success: boolean
    message: string
    recording?: RecordingResponse
}

export interface UpcomingAppointmentResponse {
    id: string
    doctor_name: string
    specialty: string
    hospital_name: string
    scheduled_date: string
    scheduled_time: string
    type: string
    status: string
}

export interface UpcomingAppointmentsListResponse {
    appointments: UpcomingAppointmentResponse[]
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const recordingsApi = {
    /**
     * Get all recordings for the current patient
     */
    getRecordings: async (): Promise<RecordingListResponse> => {
        const token = await getToken()
        return apiClient.get<RecordingListResponse>('/recordings', token)
    },

    /**
     * Get a single recording by ID
     */
    getRecording: async (recordingId: string): Promise<RecordingResponse> => {
        const token = await getToken()
        return apiClient.get<RecordingResponse>(`/recordings/${recordingId}`, token)
    },

    /**
     * Create a new recording entry
     */
    createRecording: async (request: RecordingCreateRequest): Promise<RecordingActionResponse> => {
        const token = await getToken()
        return apiClient.post<RecordingActionResponse>('/recordings', request, token)
    },

    /**
     * Update recording with file URL after upload
     */
    uploadRecording: async (recordingId: string, request: RecordingUploadRequest): Promise<RecordingActionResponse> => {
        const token = await getToken()
        return apiClient.put<RecordingActionResponse>(`/recordings/${recordingId}/upload`, request, token)
    },

    /**
     * Delete a recording
     */
    deleteRecording: async (recordingId: string): Promise<RecordingActionResponse> => {
        const token = await getToken()
        return apiClient.delete<RecordingActionResponse>(`/recordings/${recordingId}`, token)
    },

    /**
     * Get upcoming and in-progress appointments for recording selection
     */
    getUpcomingAppointments: async (): Promise<UpcomingAppointmentsListResponse> => {
        const token = await getToken()
        return apiClient.get<UpcomingAppointmentsListResponse>('/recordings/appointments', token)
    },
}
