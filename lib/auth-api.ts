// Auth API Service

import { apiClient } from './api-client';

export type UserRole = 'patient' | 'clinician' | 'admin';
export type SignupRole = 'patient' | 'nurse' | 'doctor' | 'admin';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: UserRole;
    is_verified: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface SignupRequest {
    full_name: string;
    email: string;
    password: string;
    password_confirm: string;
    role: SignupRole;
}

export interface SignupResponse {
    message: string;
    user: User;
}

export interface VerifyRequest {
    email: string;
    verification_code: string;
}

export interface VerifyResponse {
    message: string;
    access_token: string;
    token_type: string;
    user: User;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    new_password: string;
    confirm_new_password: string;
}

export const authApi = {
    /**
     * Register a new user
     */
    async signup(data: SignupRequest): Promise<SignupResponse> {
        return apiClient.post<SignupResponse>('/auth/signup', data);
    },

    /**
     * Login with email and password
     */
    async login(data: LoginRequest): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/auth/login', data);
    },

    /**
     * Verify email with verification code
     */
    async verifyEmail(data: VerifyRequest): Promise<VerifyResponse> {
        return apiClient.post<VerifyResponse>('/auth/verify', data);
    },

    /**
     * Resend verification email
     */
    async resendVerification(email: string): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>('/auth/resend-verification', { email });
    },

    /**
     * Request password reset
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>('/auth/reset-password', data);
    },

    /**
     * Get current user info
     */
    async getCurrentUser(token: string): Promise<User> {
        return apiClient.get<User>('/auth/me', token);
    },

    /**
     * Change password (requires auth)
     */
    async changePassword(
        currentPassword: string,
        newPassword: string,
        confirmNewPassword: string,
        token: string
    ): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>(
            '/auth/change-password',
            {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword,
            },
            token
        );
    },
};

export default authApi;
