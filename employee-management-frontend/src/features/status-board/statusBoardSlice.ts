import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MyStatus, EmployeeStatus } from '../../types';

interface StatusBoardState {
  myStatus: MyStatus | null;
  allStatuses: EmployeeStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: StatusBoardState = {
  myStatus: null,
  allStatuses: [],
  loading: false,
  error: null,
};

const statusBoardSlice = createSlice({
  name: 'statusBoard',
  initialState,
  reducers: {
    fetchStatusBoardRequest: (state) => { state.loading = true; state.error = null; },
    
    fetchStatusBoardSuccess: (state, action: PayloadAction<{ myStatus: MyStatus, allStatuses: EmployeeStatus[] }>) => {
      state.loading = false;
      state.myStatus = action.payload.myStatus;
      state.allStatuses = action.payload.allStatuses;
    },
    fetchStatusBoardFailure: (state, action: PayloadAction<string>) => {
      state.loading = false; state.error = action.payload;
    },
  },
});

export const { fetchStatusBoardRequest, fetchStatusBoardSuccess, fetchStatusBoardFailure } = statusBoardSlice.actions;
export default statusBoardSlice.reducer;