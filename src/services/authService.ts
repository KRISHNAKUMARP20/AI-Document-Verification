import { apiRequest } from './api';
import { User } from '../types/User';

export const authService = {
  async login(email: string, password: string, loginType: 'USER' | 'ADMIN' = 'USER'): Promise<{ user: User; token: string }> {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, loginType }),
    });
    localStorage.setItem('aidoc_auth_token', data.token);
    return data;
  },

  async register(userData: {
    fullName: string;
    email: string;
    password: string;
    organization?: string;
    role?: string;
  }): Promise<{ user: User; token: string }> {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    localStorage.setItem('aidoc_auth_token', data.token);
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; otpCode?: string }> {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await apiRequest('/auth/me');
      return data.user;
    } catch {
      localStorage.removeItem('aidoc_auth_token');
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('aidoc_auth_token');
  }
};
