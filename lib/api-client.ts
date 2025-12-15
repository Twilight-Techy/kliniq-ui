// API Client for Kliniq Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response, hadToken: boolean = false): Promise<T> {
    if (!response.ok) {
        // Handle token expiry - 401 Unauthorized (only for authenticated requests)
        if (response.status === 401 && hadToken) {
            // Clear auth data from localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('kliniq_token');
                localStorage.removeItem('kliniq_user');

                // Redirect to login page
                window.location.href = '/auth?expired=true';
            }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            response.status,
            errorData.detail || errorData.message || 'An error occurred'
        );
    }
    return response.json();
}

export const apiClient = {
    async get<T>(endpoint: string, token?: string): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });
        return handleResponse<T>(response, !!token);
    },

    async post<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(response, !!token);
    },

    async put<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });
        return handleResponse<T>(response, !!token);
    },

    async delete<T>(endpoint: string, token?: string): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers,
        });
        return handleResponse<T>(response, !!token);
    },
};

export default apiClient;
