export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  isActive: boolean;
  createdAt: string;
  employee?: Employee;
}

export interface Employee {
  id: string;
  userId: string;
  employeeCode: string;
  department: string;
  position: string;
  hireDate: string;
  phoneNumber: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
}

export enum UserRole {
  Admin = 1,
  Manager = 2,
  Employee = 3
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterTenantRequest {
  tenantName: string;
  domain: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  subscriptionType: number;
  timeZone: string;
  locale: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterTenantRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}