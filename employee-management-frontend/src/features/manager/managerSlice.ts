import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ManagerEmployee, EmployeeDashboard, LeaveRequest, RejectLeavePayload } from '../../types';

interface ManagerState {
  employees: ManagerEmployee[];
  selectedEmployeeDashboard: EmployeeDashboard | null;
  pendingLeaves: LeaveRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ManagerState = {
  employees: [],
  selectedEmployeeDashboard: null,
  pendingLeaves: [],
  loading: false,
  error: null,
};

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    fetchEmployeesRequest: (state) => { state.loading = true; state.error = null; },
    fetchEmployeeDashboardRequest: (state, _action: PayloadAction<string>) => { state.loading = true; state.error = null; },
    fetchPendingLeavesRequest: (state) => { state.loading = true; state.error = null; },
    approveLeaveRequest: (state, _action: PayloadAction<string>) => { state.loading = true; state.error = null; },
    rejectLeaveRequest: (state, _action: PayloadAction<RejectLeavePayload>) => { state.loading = true; state.error = null; },

    fetchEmployeesSuccess: (state, action: PayloadAction<ManagerEmployee[]>) => {
      state.loading = false; state.employees = action.payload;
    },
    fetchEmployeesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },

    fetchEmployeeDashboardSuccess: (state, action: PayloadAction<EmployeeDashboard>) => {
      state.loading = false; state.selectedEmployeeDashboard = action.payload;
    },
    fetchEmployeeDashboardFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },

    fetchPendingLeavesSuccess: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.loading = false; state.pendingLeaves = action.payload;
    },
    fetchPendingLeavesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },

    approveLeaveSuccess: (state, action: PayloadAction<LeaveRequest>) => {
      state.loading = false;
      state.pendingLeaves = state.pendingLeaves.filter(l => l.id !== action.payload.id);
    },
    approveLeaveFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },

    rejectLeaveSuccess: (state, action: PayloadAction<LeaveRequest>) => {
      state.loading = false;
      state.pendingLeaves = state.pendingLeaves.filter(l => l.id !== action.payload.id);
    },
    rejectLeaveFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },
  },
});

export const {
  fetchEmployeesRequest, fetchEmployeeDashboardRequest, fetchPendingLeavesRequest,
  approveLeaveRequest, rejectLeaveRequest,
  fetchEmployeesSuccess, fetchEmployeesFailure,
  fetchEmployeeDashboardSuccess, fetchEmployeeDashboardFailure,
  fetchPendingLeavesSuccess, fetchPendingLeavesFailure,
  approveLeaveSuccess, approveLeaveFailure,
  rejectLeaveSuccess, rejectLeaveFailure
} = managerSlice.actions;

export default managerSlice.reducer;