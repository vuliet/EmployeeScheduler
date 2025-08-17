import api from './api';
import { LoginRequest, RegisterTenantRequest, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterTenantRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register-tenant', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', refreshToken);
    return response.data;
  }
};

export default authService;