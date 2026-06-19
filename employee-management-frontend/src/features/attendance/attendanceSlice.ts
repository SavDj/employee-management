import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AttendanceRecord, WorkMode } from '../../types';

interface AttendanceState {
  currentRecord: AttendanceRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  currentRecord: null,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    checkInRequest: (state, _action: PayloadAction<{ workMode: WorkMode }>) => {
      state.loading = true; state.error = null;
    },
    checkOutRequest: (state) => {
      state.loading = true; state.error = null;
    },
    
    checkInSuccess: (state, action: PayloadAction<AttendanceRecord>) => {
      state.loading = false;
      state.currentRecord = action.payload;
    },
    checkInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },
    checkOutSuccess: (state, action: PayloadAction<AttendanceRecord>) => {
      state.loading = false;
      state.currentRecord = action.payload;
    },
    checkOutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },
  },
});

export const {
  checkInRequest, checkOutRequest,
  checkInSuccess, checkInFailure,
  checkOutSuccess, checkOutFailure
} = attendanceSlice.actions;

export default attendanceSlice.reducer;