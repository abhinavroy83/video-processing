import apiClient from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            permissions?: string[];
        };
        accessToken: string;
        refreshToken: string;
    };
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    permissions: string[];
    isEmailVerified: boolean;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    async getProfile(): Promise<UserProfile> {
        const response = await apiClient.get<{ success: boolean; data: { user: UserProfile } }>(
            '/auth/profile'
        );
        return response.data.data.user;
    },

    saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    saveUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    },
};
