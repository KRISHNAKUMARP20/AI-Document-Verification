export type UserRole = 'ADMIN' | 'VERIFIER' | 'AUDITOR' | 'USER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_ACTIVATION';
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
