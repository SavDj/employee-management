import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { 
  fetchMyLeavesRequest, fetchMyLeavesSuccess, fetchMyLeavesFailure,
  submitLeaveRequest, submitLeaveSuccess, submitLeaveFailure 
} from './leaveSlice';
import type { LeaveRequest } from '../../types';
import api from '../../api/client';

function* fetchMyLeavesWorker() {
  try {
    const response: AxiosResponse<LeaveRequest[]> = yield call(api.get, '/leaverequest/my');
    yield put(fetchMyLeavesSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to fetch leaves';
    yield put(fetchMyLeavesFailure(msg));
  }
}

function* submitLeaveWorker(action: ReturnType<typeof submitLeaveRequest>) {
  try {
    const response: AxiosResponse<LeaveRequest> = yield call(api.post, '/leaverequest', action.payload);
    toast.success('Leave request submitted successfully!');
    yield put(submitLeaveSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to submit leave request';
    toast.error(msg);
    yield put(submitLeaveFailure(msg));
  }
}

export function* leaveSaga() {
  yield takeLatest(fetchMyLeavesRequest.type, fetchMyLeavesWorker);
  yield takeLatest(submitLeaveRequest.type, submitLeaveWorker);
}