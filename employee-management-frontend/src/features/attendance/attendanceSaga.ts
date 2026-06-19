import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { 
  checkInRequest, checkInSuccess, checkInFailure,
  checkOutRequest, checkOutSuccess, checkOutFailure 
} from './attendanceSlice';
import type { AttendanceRecord } from '../../types';
import api from '../../api/client';

function* checkInWorker(action: ReturnType<typeof checkInRequest>) {
  try {
    const response: AxiosResponse<AttendanceRecord> = yield call(api.post, '/attendance/checkin', action.payload);
    toast.success('Successfully checked in!');
    yield put(checkInSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Check-in failed';
    toast.error(msg);
    yield put(checkInFailure(msg));
  }
}

function* checkOutWorker() {
  try {
    const response: AxiosResponse<AttendanceRecord> = yield call(api.put, '/attendance/checkout');
    toast.success('Checked out. Have a good evening!');
    yield put(checkOutSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Check-out failed';
    toast.error(msg);
    yield put(checkOutFailure(msg));
  }
}

export function* attendanceSaga() {
  yield takeLatest(checkInRequest.type, checkInWorker);
  yield takeLatest(checkOutRequest.type, checkOutWorker);
}