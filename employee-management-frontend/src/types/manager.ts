import type { UserStatus } from './status';

export interface ManagerEmployee {
  userId: string;
  fullName: string;
  department: string;
  status: UserStatus;
  profilePictureUrl: string;
}

export interface EmployeeDashboard {
  userId: string;
  fullName: string;
  email: string;
  department: string;
  sickDaysUsed: number;
  vacationDaysUsed: number;
  remoteDays: number;
  officeDays: number;
  profilePictureUrl: string;
}