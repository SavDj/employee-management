import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { 
  fetchEmployeesRequest, fetchEmployeesSuccess, fetchEmployeesFailure,
  fetchEmployeeDashboardRequest, fetchEmployeeDashboardSuccess, fetchEmployeeDashboardFailure,
  fetchPendingLeavesRequest, fetchPendingLeavesSuccess, fetchPendingLeavesFailure,
  approveLeaveRequest, approveLeaveSuccess, approveLeaveFailure,
  rejectLeaveRequest, rejectLeaveSuccess, rejectLeaveFailure
} from './managerSlice';
import type { ManagerEmployee, EmployeeDashboard, LeaveRequest } from '../../types';
import api from '../../api/client';

function* fetchEmployeesWorker() {
  try {
    const response: AxiosResponse<ManagerEmployee[]> = yield call(api.get, '/manager/employees');
    yield put(fetchEmployeesSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to fetch employees';
    yield put(fetchEmployeesFailure(msg));
  }
}

function* fetchEmployeeDashboardWorker(action: ReturnType<typeof fetchEmployeeDashboardRequest>) {
  try {
    const response: AxiosResponse<EmployeeDashboard> = yield call(api.get, `/manager/employees/${action.payload}/dashboard`);
    yield put(fetchEmployeeDashboardSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to fetch dashboard';
    yield put(fetchEmployeeDashboardFailure(msg));
  }
}

function* fetchPendingLeavesWorker() {
  try {
    const response: AxiosResponse<LeaveRequest[]> = yield call(api.get, '/manager/leaverequests/pending');
    yield put(fetchPendingLeavesSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to fetch pending leaves';
    yield put(fetchPendingLeavesFailure(msg));
  }
}

function* approveLeaveWorker(action: ReturnType<typeof approveLeaveRequest>) {
  try {
    const response: AxiosResponse<LeaveRequest> = yield call(api.put, `/manager/leaverequests/${action.payload}/approve`);
    toast.success('Vacation request approved!');
    yield put(approveLeaveSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to approve leave';
    toast.error(msg);
    yield put(approveLeaveFailure(msg));
  }
}

function* rejectLeaveWorker(action: ReturnType<typeof rejectLeaveRequest>) {
  try {
    const response: AxiosResponse<LeaveRequest> = yield call(api.put, `/manager/leaverequests/${action.payload.leaveId}/reject`, {
      rejectionReason: action.payload.rejectionReason
    });
    toast.success('Vacation request rejected.');
    yield put(rejectLeaveSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to reject leave';
    toast.error(msg);
    yield put(rejectLeaveFailure(msg));
  }
}

export function* managerSaga() {
  yield takeLatest(fetchEmployeesRequest.type, fetchEmployeesWorker);
  yield takeLatest(fetchEmployeeDashboardRequest.type, fetchEmployeeDashboardWorker);
  yield takeLatest(fetchPendingLeavesRequest.type, fetchPendingLeavesWorker);
  yield takeLatest(approveLeaveRequest.type, approveLeaveWorker);
  yield takeLatest(rejectLeaveRequest.type, rejectLeaveWorker);
}