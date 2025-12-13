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
