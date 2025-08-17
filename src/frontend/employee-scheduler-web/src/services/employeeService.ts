import api from './api';

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

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  employeeCode: string;
  department: string;
  position: string;
  hireDate: string;
  phoneNumber: string;
  address: string;
  role: number; // 1 = Admin, 2 = Manager, 3 = Employee
}

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  create: async (employee: CreateEmployee): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', employee);
    return response.data;
  },

  update: async (id: string, employee: CreateEmployee): Promise<void> => {
    await api.put(`/employees/${id}`, employee);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  }
};

export default employeeService;