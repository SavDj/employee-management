import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import { fetchStatusBoardRequest, fetchStatusBoardSuccess, fetchStatusBoardFailure } from './statusBoardSlice';
import type { MyStatus, EmployeeStatus } from '../../types';
import api from '../../api/client';

function* fetchStatusBoardWorker() {
  try {
    const response: AxiosResponse<{ myStatus: MyStatus; allStatuses: EmployeeStatus[] }> = yield call(api.get, '/statusboard');
    yield put(fetchStatusBoardSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to fetch status board';
    yield put(fetchStatusBoardFailure(msg));
  }
}

export function* statusBoardSaga() {
  yield takeLatest(fetchStatusBoardRequest.type, fetchStatusBoardWorker);
}