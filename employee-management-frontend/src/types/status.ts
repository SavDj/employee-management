export type UserStatus = 'Office' | 'Remote' | 'Sick' | 'Vacation' | 'Absent';

export interface MyStatus {
  fullName: string;
  status: UserStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export interface EmployeeStatus {
  userId: string;
  fullName: string;
  department: string;
  status: UserStatus;
  profilePictureUrl: string | null;
}