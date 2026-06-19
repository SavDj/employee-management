import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import statusBoardReducer from '../features/status-board/statusBoardSlice';
import leaveReducer from '../features/leave/leaveSlice';
import managerReducer from '../features/manager/managerSlice';

import rootSaga from './rootSaga'; 

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    attendance: attendanceReducer,
    statusBoard: statusBoardReducer,
    leave: leaveReducer,
    manager: managerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;