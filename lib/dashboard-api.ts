// lib/dashboard-api.ts
/**
 * Dashboard API client for patient dashboard endpoints.
 */

import { apiClient } from './api-client'

// ============================================================================
// TYPES
// ============================================================================

export interface DashboardStats {
  total_appointments: number
  completed_appointments: number
  linked_hospitals: number
  active_chats: number
}

export interface AppointmentSummary {
  id: string
  doctor_name: string
  specialty?: string
  hospital_name: string
  scheduled_date: string
  scheduled_time: string
  type: 'in-person' | 'video'
  status: 'upcoming' | 'completed' | 'cancelled' | 'in-progress'
}

export interface LinkedHospital {
  id: string
  hospital_code: string
  name: string
  location: string
  type: string
  departments: string[]
  linked_since: string
  total_visits: number
  rating: number
}

export interface RecordingSummary {
  id: string
  title: string
  doctor_name: string
  duration_seconds: number
  has_transcript: boolean
  created_at: string
}

export interface DoctorNote {
  id: string
  type: string
  title: string
  description?: string
  doctor_name: string
  date: string
}

export interface HealthVitals {
  heart_rate?: number
  blood_pressure?: string
  temperature?: number
  weight?: number
  oxygen_saturation?: number
  recorded_at?: string
}

export interface RecentChat {
  id: string
  title?: string
  preview: string
  updated_at: string
}

export interface DashboardResponse {
  user_name: string
  preferred_language: string
  upcoming_appointments: AppointmentSummary[]
  linked_hospitals: LinkedHospital[]
  recent_recordings: RecordingSummary[]
  doctor_notes: DoctorNote[]
  health_vitals?: HealthVitals
  recent_chats: RecentChat[]
  stats: DashboardStats
  welcome_message: string
}

export interface HospitalSearchResult {
  id: string
  hospital_code: string
  name: string
  type: string
  city: string
  state: string
  rating: number
}

export interface HospitalSearchResponse {
  hospitals: HospitalSearchResult[]
  total: number
}

export interface LinkHospitalRequest {
  hospital_code?: string
  hospital_id?: string
}

export interface LinkHospitalResponse {
  success: boolean
  message: string
  hospital?: LinkedHospital
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface ChatRequest {
  message: string
  chat_id?: string
}

export interface ToolAction {
  tool: string
  success: boolean
  message: string
  details: Record<string, string>
}

export interface ChatResponse {
  chat_id: string
  response: string
  tool_actions: ToolAction[]
  usage?: Record<string, number>
}

export interface ChatHistory {
  id: string
  title?: string
  messages: ChatMessage[]
  language: string
  created_at: string
  updated_at: string
}

// ============================================================================
// HELPER
// ============================================================================

const getToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined
  return localStorage.getItem('kliniq_token') || undefined
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const dashboardApi = {
  /**
   * Get main dashboard data
   */
  getDashboard: async (): Promise<DashboardResponse> => {
    return apiClient.get<DashboardResponse>('/dashboard', getToken())
  },

  /**
   * Get all hospitals for selection
   */
  getHospitals: async (): Promise<HospitalSearchResponse> => {
    return apiClient.get<HospitalSearchResponse>('/dashboard/hospitals', getToken())
  },

  /**
   * Search hospitals by name, code, or city
   */
  searchHospitals: async (query: string): Promise<HospitalSearchResponse> => {
    return apiClient.get<HospitalSearchResponse>(
      `/dashboard/hospitals/search?q=${encodeURIComponent(query)}`,
      getToken()
    )
  },

  /**
   * Link patient to hospital by code or ID
   */
  linkHospital: async (request: LinkHospitalRequest): Promise<LinkHospitalResponse> => {
    return apiClient.post<LinkHospitalResponse>('/dashboard/hospitals/link', request, getToken())
  },

  /**
   * Unlink patient from hospital
   */
  unlinkHospital: async (hospitalId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/dashboard/hospitals/${hospitalId}`,
      getToken()
    )
  },

  /**
   * Send message to AI assistant
   */
  sendChatMessage: async (message: string, chatId?: string): Promise<ChatResponse> => {
    const request: ChatRequest = { message }
    if (chatId) request.chat_id = chatId
    return apiClient.post<ChatResponse>('/dashboard/chat', request, getToken())
  },

  /**
   * Get chat history
   */
  getChatHistory: async (limit: number = 10): Promise<ChatHistory[]> => {
    return apiClient.get<ChatHistory[]>(`/dashboard/chat/history?limit=${limit}`, getToken())
  },
}
