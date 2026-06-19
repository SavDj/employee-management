import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { checkInRequest, checkOutRequest } from '../attendanceSlice';
import { fetchStatusBoardRequest } from '../../status-board/statusBoardSlice';
import type { WorkMode } from '../../../types';
import { fetchProfileRequest } from '../../profile/profileSlice';

export const EmployeeDashboard = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);
  const myStatus = useSelector((state: RootState) => state.statusBoard.myStatus);
  const statusBoardLoading = useSelector((state: RootState) => state.statusBoard.loading);
  const statusBoardError = useSelector((state: RootState) => state.statusBoard.error);
  const attendanceLoading = useSelector((state: RootState) => state.attendance.loading);

  const prevAttendanceLoading = useRef(attendanceLoading);

  useEffect(() => {
    dispatch(fetchProfileRequest());
    dispatch(fetchStatusBoardRequest());
  }, [dispatch]);

  useEffect(() => {
    if (prevAttendanceLoading.current && !attendanceLoading) {
      dispatch(fetchStatusBoardRequest());
    }
    prevAttendanceLoading.current = attendanceLoading;
  }, [attendanceLoading, dispatch]);

  const isCheckedIn = !!myStatus?.checkInTime && !myStatus?.checkOutTime;
  const isCheckedOut = !!myStatus?.checkInTime && !!myStatus?.checkOutTime;
  
  const isOnLeave = myStatus?.status === 'Vacation' || myStatus?.status === 'Sick';

  const handleCheckIn = (mode: WorkMode) => dispatch(checkInRequest({ workMode: mode }));
  const handleCheckOut = () => dispatch(checkOutRequest());

  if (!profile || (statusBoardLoading && !myStatus)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (statusBoardError && !myStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <p className="text-red-600 font-medium mb-2">Unable to load attendance status.</p>
        <p className="text-gray-500 text-sm mb-4">{statusBoardError || 'You may not have permission to view this.'}</p>
        <button onClick={() => dispatch(fetchStatusBoardRequest())} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Retry</button>
      </div>
    );
  }

  if (!myStatus) {
    return <div className="flex flex-col items-center justify-center h-64 text-center"><p className="text-gray-500">No attendance data available.</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's attendance</h2>
        
        {isOnLeave ? (
          <div className="flex items-start text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-md">
            <svg className="w-6 h-6 mr-3 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">You are currently on {myStatus.status} leave.</p>
              <p className="text-sm text-amber-700 mt-1">You cannot check in while on approved leave.</p>
            </div>
          </div>
        ) : !isCheckedIn && !isCheckedOut ? (
          <div className="space-y-4">
            <p className="text-gray-600">You have not checked in yet today. Please select your work mode:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => handleCheckIn('Office')} disabled={attendanceLoading} className="flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Check In (Office)
              </button>
              <button onClick={() => handleCheckIn('Remote')} disabled={attendanceLoading} className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Check In (Remote)
              </button>
            </div>
          </div>
        ) : isCheckedIn ? (
          <div className="space-y-4">
            <div className="flex items-center text-green-700 bg-green-50 p-4 rounded-md">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="font-medium">You are currently checked in ({myStatus.status})</p>
                <p className="text-sm text-green-600">Since {new Date(myStatus.checkInTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <button onClick={handleCheckOut} disabled={attendanceLoading} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Check Out
            </button>
          </div>
        ) : (
          <div className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-md">
            <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <p className="font-medium">You have checked out for the day.</p>
              <p className="text-sm text-gray-500">
                Checked in at {new Date(myStatus.checkInTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                Checked out at {new Date(myStatus.checkOutTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sick Days Used</p>
                <p className="text-2xl font-bold text-gray-900">{profile.sickDaysUsed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vacation Days Used</p>
                <p className="text-2xl font-bold text-gray-900">{profile.vacationDaysUsed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Remote Days</p>
                <p className="text-2xl font-bold text-gray-900">{profile.remoteDays}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Office Days</p>
                <p className="text-2xl font-bold text-gray-900">{profile.officeDays}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};