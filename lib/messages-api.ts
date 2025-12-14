// lib/messages-api.ts
// API client for messages endpoints

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

export interface MessageResponse {
    id: string
    sender_type: 'patient' | 'clinician'
    sender_name: string
    content: string
    message_type: string
    is_read: boolean
    attachment_url?: string
    attachment_name?: string
    audio_duration?: number
    original_language?: string  // Language audio was spoken in
    transcripts?: Record<string, string>  // Multi-language transcripts {"english": "...", "yoruba": "..."}
    created_at: string
    is_mine: boolean
}

export interface ConversationResponse {
    id: string
    clinician_id: string
    clinician_name: string
    clinician_role: string
    clinician_avatar: string
    last_message?: string
    last_message_time?: string
    unread_count: number
    is_online: boolean
    created_at: string
}

export interface ConversationListResponse {
    conversations: ConversationResponse[]
    total: number
}

export interface ConversationDetailResponse {
    conversation: ConversationResponse
    messages: MessageResponse[]
}

export interface SendMessageRequest {
    content: string
    message_type?: string
    attachment_url?: string
    attachment_name?: string
}

export interface SendMessageResponse {
    success: boolean
    message: string
    sent_message?: MessageResponse
}

export interface StartConversationRequest {
    clinician_id: string
    initial_message?: string
}

export interface StartConversationResponse {
    success: boolean
    message: string
    conversation?: ConversationResponse
}

export interface MarkReadResponse {
    success: boolean
    message: string
    marked_count: number
}

export interface TranscriptionResponse {
    text: string
    transcripts?: Record<string, string>  // All language transcripts {"english": "...", "yoruba": "..."}
    language: string
    original_language?: string
    cached: boolean
    translated: boolean
    error?: string
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const messagesApi = {
    /**
     * Get all conversations for the patient
     */
    getConversations: async (): Promise<ConversationListResponse> => {
        const token = getToken()
        return apiClient.get<ConversationListResponse>('/messages/conversations', token)
    },

    /**
     * Start a new conversation with a clinician
     */
    startConversation: async (request: StartConversationRequest): Promise<StartConversationResponse> => {
        const token = getToken()
        return apiClient.post<StartConversationResponse>('/messages/conversations', request, token)
    },

    /**
     * Get a conversation with all its messages
     */
    getConversation: async (conversationId: string): Promise<ConversationDetailResponse> => {
        const token = getToken()
        return apiClient.get<ConversationDetailResponse>(`/messages/conversations/${conversationId}`, token)
    },

    /**
     * Send a message in a conversation
     */
    sendMessage: async (conversationId: string, request: SendMessageRequest): Promise<SendMessageResponse> => {
        const token = getToken()
        return apiClient.post<SendMessageResponse>(`/messages/conversations/${conversationId}`, request, token)
    },

    /**
     * Mark all messages in a conversation as read
     */
    markAsRead: async (conversationId: string): Promise<MarkReadResponse> => {
        const token = getToken()
        return apiClient.put<MarkReadResponse>(`/messages/conversations/${conversationId}/read`, {}, token)
    },

    /**
     * Get available clinicians from linked hospitals to start new conversations
     */
    getAvailableClinicians: async (): Promise<AvailableCliniciansListResponse> => {
        const token = getToken()
        return apiClient.get<AvailableCliniciansListResponse>('/messages/available-clinicians', token)
    },

    /**
     * Edit a message
     */
    editMessage: async (messageId: string, content: string): Promise<EditMessageResponse> => {
        const token = getToken()
        return apiClient.put<EditMessageResponse>(`/messages/messages/${messageId}`, { content }, token)
    },

    /**
     * Delete a message
     */
    deleteMessage: async (messageId: string): Promise<DeleteMessageResponse> => {
        const token = getToken()
        return apiClient.delete<DeleteMessageResponse>(`/messages/messages/${messageId}`, token)
    },

    /**
     * Transcribe an audio message using N-ATLaS ASR
     * Returns transcript in viewer's preferred language (auto-translates)
     * @param messageId The ID of the audio message 
     * @param overrideLanguage Override spoken language and re-transcribe (english, yoruba, hausa, igbo)
     * @param viewLanguage View transcript in different language (optional)
     */
    transcribeMessage: async (
        messageId: string,
        overrideLanguage?: string,
        viewLanguage?: string
    ): Promise<TranscriptionResponse> => {
        const token = getToken()
        const params = new URLSearchParams()
        if (overrideLanguage) params.append('override_language', overrideLanguage)
        if (viewLanguage) params.append('view_language', viewLanguage)
        const queryString = params.toString()
        const url = queryString
            ? `/messages/messages/${messageId}/transcribe?${queryString}`
            : `/messages/messages/${messageId}/transcribe`
        return apiClient.post<TranscriptionResponse>(url, {}, token)
    },
}

// Additional types for available clinicians
export interface AvailableClinician {
    user_id: string
    clinician_id: string
    name: string
    role: string
    specialty?: string
    avatar: string
    hospital_name: string
    hospital_id: string
    is_online: boolean
}

export interface AvailableCliniciansListResponse {
    clinicians: AvailableClinician[]
    total: number
}

export interface EditMessageResponse {
    success: boolean
    message: string
    updated_message?: MessageResponse
}

export interface DeleteMessageResponse {
    success: boolean
    message: string
}
