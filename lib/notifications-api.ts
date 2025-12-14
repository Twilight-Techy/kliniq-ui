// Notifications API client

import apiClient from './api-client';

export interface Notification {
    id: string;
    title: string;
    message: string;
    notification_type: string;
    is_read: boolean;
    related_entity_id?: string;
    related_entity_type?: string;
    created_at: string;
}

export interface NotificationsListResponse {
    notifications: Notification[];
    unread_count: number;
}

export interface MarkReadResponse {
    success: boolean;
    marked_count: number;
}

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') || undefined;
    }
    return undefined;
};

export const notificationsApi = {
    /**
     * Get user's notifications
     */
    getNotifications: async (limit: number = 20, unreadOnly: boolean = false): Promise<NotificationsListResponse> => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', String(limit));
        if (unreadOnly) params.append('unread_only', String(unreadOnly));

        return apiClient.get<NotificationsListResponse>(
            `/notifications?${params.toString()}`,
            getToken()
        );
    },

    /**
     * Mark specific notifications as read
     */
    markRead: async (notificationIds: string[]): Promise<MarkReadResponse> => {
        return apiClient.post<MarkReadResponse>(
            '/notifications/mark-read',
            { notification_ids: notificationIds },
            getToken()
        );
    },

    /**
     * Mark all notifications as read
     */
    markAllRead: async (): Promise<MarkReadResponse> => {
        return apiClient.post<MarkReadResponse>(
            '/notifications/mark-all-read',
            {},
            getToken()
        );
    },

    /**
     * Delete a notification
     */
    deleteNotification: async (notificationId: string): Promise<{ success: boolean }> => {
        return apiClient.delete<{ success: boolean }>(
            `/notifications/${notificationId}`,
            getToken()
        );
    }
};
