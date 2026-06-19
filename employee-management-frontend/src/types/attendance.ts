export type WorkMode = 'Office' | 'Remote';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  workMode: WorkMode;
}