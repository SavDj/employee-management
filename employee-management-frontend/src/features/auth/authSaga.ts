import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import type { AxiosResponse } from 'axios';

import { 
  checkSessionRequest, checkSessionSuccess, checkSessionFailure,
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  logoutRequest, logoutSuccess, logoutFailure
} from './authSlice';

import api from '../../api/client';
import type { User } from '../../types';

function* checkSessionWorker() {
  try {
    const response: AxiosResponse<User> = yield call(api.get, '/auth/me');
    yield put(checkSessionSuccess(response.data));
  } catch (error: any) {
    yield put(checkSessionFailure());
  }
}

function* loginWorker(action: ReturnType<typeof loginRequest>) {
  try {
    const response: AxiosResponse<User> = yield call(api.post, '/auth/login', action.payload);
    yield put(loginSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Invalid credentials';
    toast.error(msg);
    yield put(loginFailure(msg));
  }
}

function* registerWorker(action: ReturnType<typeof registerRequest>) {
  try {
    yield call(api.post, '/auth/register', action.payload);
    toast.success('Registration successful. Please log in.');
    yield put(registerSuccess());
  } catch (error: any) {
    const msg = error.response?.data?.detail ||  'Registration failed';
    toast.error(msg);
    yield put(registerFailure(msg));
  }
}

function* logoutWorker() {
  try {
    yield call(api.post, '/auth/logout');
    yield put(logoutSuccess());
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Logout failed';
    toast.error(msg);
    yield put(logoutFailure(msg));
  }
}

export function* authSaga() {
  yield takeLatest(checkSessionRequest.type, checkSessionWorker);
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(registerRequest.type, registerWorker);
  yield takeLatest(logoutRequest.type, logoutWorker);
}