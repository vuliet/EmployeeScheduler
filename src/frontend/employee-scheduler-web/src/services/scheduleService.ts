import api from './api';

export interface Schedule {
  id: string;
  weekStart: string;
  weekEnd: string;
  createdBy: string;
  status: ScheduleStatus;
  notes: string;
  createdAt: string;
  shifts: Shift[];
}

export interface CreateSchedule {
  weekStart: string;
  weekEnd: string;
  notes: string;
}

export enum ScheduleStatus {
  Draft = 1,
  Published = 2,
  Archived = 3
}

export interface Shift {
  id: string;
  scheduleId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  status: ShiftStatus;
  notes: string;
  isOvertime: boolean;
  actualStartTime?: string;
  actualEndTime?: string;
}

export enum ShiftType {
  Morning = 1,
  Afternoon = 2,
  Evening = 3,
  Night = 4
}

export enum ShiftStatus {
  Scheduled = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  NoShow = 5
}

export const scheduleService = {
  getAll: async (): Promise<Schedule[]> => {
    const response = await api.get<Schedule[]>('/schedules');
    return response.data;
  },

  getById: async (id: string): Promise<Schedule> => {
    const response = await api.get<Schedule>(`/schedules/${id}`);
    return response.data;
  },

  create: async (schedule: CreateSchedule): Promise<Schedule> => {
    const response = await api.post<Schedule>('/schedules', schedule);
    return response.data;
  },

  update: async (id: string, schedule: CreateSchedule): Promise<void> => {
    await api.put(`/schedules/${id}`, schedule);
  },

  publish: async (id: string): Promise<void> => {
    await api.put(`/schedules/${id}/publish`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  }
};

export default scheduleService;