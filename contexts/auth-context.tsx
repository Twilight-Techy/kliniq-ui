"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, User, LoginRequest, SignupRequest, SignupRole } from '@/lib/auth-api';
import { ApiError } from '@/lib/api-client';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    signup: (data: SignupRequest) => Promise<void>;
    logout: () => void;
    setAuthData: (token: string, user: User) => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'kliniq_token';
const USER_KEY = 'kliniq_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const loadAuthState = () => {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_KEY);

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } catch {
                    // Invalid stored data, clear it
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                }
            }
            setIsLoading(false);
        };

        loadAuthState();

        // Listen for storage changes (for cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === TOKEN_KEY || e.key === USER_KEY) {
                loadAuthState();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Function to manually set auth data (used after verification)
    const setAuthData = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login(data);

            // Store auth data
            setToken(response.access_token);
            setUser(response.user);
            localStorage.setItem(TOKEN_KEY, response.access_token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (data: SignupRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            await authApi.signup(data);
            // Note: User needs to verify email before they can login
            // We don't set token/user here as they need to verify first
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }, []);

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
        setAuthData,
        error,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Helper to get redirect path based on user role
export function getRedirectPath(user: User): string {
    switch (user.role) {
        case 'patient':
            return '/dashboard';
        case 'clinician':
            return '/clinician';
        case 'admin':
            return '/admin';
        default:
            return '/dashboard';
    }
}

