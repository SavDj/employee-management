import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LeaveRequest, SubmitLeavePayload } from '../../types';

interface LeaveState {
  myLeaves: LeaveRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  myLeaves: [],
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    fetchMyLeavesRequest: (state) => { state.loading = true; state.error = null; },
    submitLeaveRequest: (state, _action: PayloadAction<SubmitLeavePayload>) => { state.loading = true; state.error = null; },
    
    fetchMyLeavesSuccess: (state, action: PayloadAction<LeaveRequest[]>) => {
      state.loading = false;
      state.myLeaves = action.payload;
    },
    fetchMyLeavesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },
    submitLeaveSuccess: (state, action: PayloadAction<LeaveRequest>) => {
      state.loading = false;
      state.myLeaves.unshift(action.payload);
    },
    submitLeaveFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },
  },
});

export const {
  fetchMyLeavesRequest, submitLeaveRequest,
  fetchMyLeavesSuccess, fetchMyLeavesFailure,
  submitLeaveSuccess, submitLeaveFailure
} = leaveSlice.actions;

export default leaveSlice.reducer;