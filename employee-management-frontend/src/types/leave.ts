export type LeaveType = 'Sick' | 'Vacation';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  managerId: string | null;
  managerDecisionDate: string | null;
  rejectionReason: string | null;
  employeeName: string; 
  employeeProfilePictureUrl: string; 
}

export interface SubmitLeavePayload {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface RejectLeavePayload {
  leaveId: string;
  rejectionReason: string;
}