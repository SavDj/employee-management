import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '../../types';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileRequest: (state) => { state.loading = true; state.error = null; },
    updateProfileRequest: (state, _action: PayloadAction<Partial<Profile>>) => { state.loading = true; state.error = null; },
    
    fetchProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.loading = false;
      state.profile = action.payload;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileSuccess: (state, action: PayloadAction<Profile>) => {
      state.loading = false;
      state.profile = action.payload;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProfileRequest, updateProfileRequest,
  fetchProfileSuccess, fetchProfileFailure,
  updateProfileSuccess, updateProfileFailure
} = profileSlice.actions;

export default profileSlice.reducer;