import { all, fork } from 'redux-saga/effects';
import { authSaga } from '../features/auth/authSaga.ts';
import { attendanceSaga } from '../features/attendance/attendanceSaga.ts';
import { statusBoardSaga } from '../features/status-board/statusBoardSaga.ts';
import { leaveSaga } from '../features/leave/leaveSaga';
import { managerSaga } from '../features/manager/managerSaga';
import { profileSaga } from '../features/profile/profileSaga.ts';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(attendanceSaga),
    fork(statusBoardSaga),
    fork(profileSaga), 
    fork(leaveSaga),
    fork(managerSaga),
  ]);
}