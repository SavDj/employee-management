import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, RegisterPayload } from '../../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkSessionRequest: (state) => {
      state.loading = true;
    },
    checkSessionSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.isInitialized = true;
      state.error = null;
    },
    checkSessionFailure: (state) => {
      state.user = null;
      state.loading = false;
      state.isInitialized = true;
      state.error = null;
    },

    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.isInitialized = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isInitialized = true;
      state.error = action.payload;
    },

    registerRequest: (state, _action: PayloadAction<RegisterPayload>) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.isInitialized = true;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isInitialized = true;
      state.error = action.payload;
    },

    logoutRequest: (state) => { state.loading = true; },
    logoutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.isInitialized = true;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isInitialized = true;
      state.error = action.payload;
    },
  },
});

export const {
  checkSessionRequest, checkSessionSuccess, checkSessionFailure,
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  logoutRequest, logoutSuccess, logoutFailure
} = authSlice.actions;

export default authSlice.reducer;