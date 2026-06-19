import { call, put, takeLatest } from 'redux-saga/effects';
import type { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { 
  fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure,
  updateProfileRequest, updateProfileSuccess, updateProfileFailure
} from './profileSlice';
import type { Profile } from '../../types';
import api from '../../api/client';

function* fetchProfileWorker() {
  try {
    const response: AxiosResponse<Profile> = yield call(api.get, '/profile');
    yield put(fetchProfileSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to fetch profile';
    yield put(fetchProfileFailure(msg));
  }
}

function* updateProfileWorker(action: ReturnType<typeof updateProfileRequest>) {
  try {
    const response: AxiosResponse<Profile> = yield call(api.put, '/profile', action.payload);
    toast.success('Profile updated successfully!');
    yield put(updateProfileSuccess(response.data));
  } catch (error: any) {
    const msg = error.response?.data?.detail || 'Failed to update profile';
    toast.error(msg);
    yield put(updateProfileFailure(msg));
  }
}

export function* profileSaga() {
  yield takeLatest(fetchProfileRequest.type, fetchProfileWorker);
  yield takeLatest(updateProfileRequest.type, updateProfileWorker);
}