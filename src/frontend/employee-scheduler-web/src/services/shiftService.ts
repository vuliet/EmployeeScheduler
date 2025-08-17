import api from './api';
import { Shift, ShiftStatus, ShiftType } from './scheduleService';

export interface CreateShift {
  scheduleId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  notes: string;
  isOvertime: boolean;
}

export interface CreateShiftPayload {
  scheduleId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  notes: string;
  isOvertime: boolean;
}

export const shiftService = {
  getAll: async (scheduleId?: string): Promise<Shift[]> => {
    const url = scheduleId ? `/shifts?scheduleId=${scheduleId}` : '/shifts';
    const response = await api.get<Shift[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Shift> => {
    const response = await api.get<Shift>(`/shifts/${id}`);
    return response.data;
  },

  create: async (shift: CreateShift | CreateShiftPayload): Promise<Shift> => {
    console.log('ShiftService: Sending create request with data:', shift);
    const response = await api.post<Shift>('/shifts', shift);
    console.log('ShiftService: Create response:', response.data);
    return response.data;
  },

  update: async (id: string, shift: CreateShift): Promise<void> => {
    await api.put(`/shifts/${id}`, shift);
  },

  updateStatus: async (id: string, status: ShiftStatus): Promise<void> => {
    await api.put(`/shifts/${id}/status`, status);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/shifts/${id}`);
  }
};

export default shiftService;