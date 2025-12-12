// lib/onboarding-api.ts

import { apiClient } from './api-client';

export type LanguageOption = 'english' | 'hausa' | 'igbo' | 'yoruba';

export interface OnboardingStatusResponse {
  onboarding_completed: boolean;
  preferred_language: string | null;
  has_profile_info: boolean;
}

export interface SetLanguageRequest {
  language: LanguageOption;
}

export interface LanguageResponse {
  success: boolean;
  language: string;
}

export interface UpdateProfileRequest {
  phone?: string;
  date_of_birth?: string; // ISO date format (YYYY-MM-DD)
  gender?: string;
  city?: string;
  state?: string;
  address?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
}

export interface OnboardingCompleteResponse {
  success: boolean;
  message: string;
}

// Helper to get token from localStorage
const getToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('kliniq_token') || undefined;
};

/**
 * Onboarding API client for patient onboarding flow
 */
export const onboardingApi = {
  /**
   * Get the current onboarding status for the authenticated patient
   */
  getStatus: async (): Promise<OnboardingStatusResponse> => {
    return apiClient.get<OnboardingStatusResponse>('/onboarding/status', getToken());
  },

  /**
   * Set the patient's preferred language
   */
  setLanguage: async (language: LanguageOption): Promise<LanguageResponse> => {
    return apiClient.put<LanguageResponse>('/onboarding/language', { language }, getToken());
  },

  /**
   * Update patient profile information
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    return apiClient.put<ProfileResponse>('/onboarding/profile', data, getToken());
  },

  /**
   * Mark onboarding as complete
   */
  complete: async (): Promise<OnboardingCompleteResponse> => {
    return apiClient.post<OnboardingCompleteResponse>('/onboarding/complete', {}, getToken());
  },
};

