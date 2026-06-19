import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import { RequireAuth } from './components/RequireAuth';
import { Layout } from './components/Layout';
import { Unauthorized } from './components/Unauthorized';

import { Login } from './features/auth/components/Login';
import { Register } from './features/auth/components/Register';
import { EmployeeDashboard } from './features/attendance/components/EmployeeDashboard';
import { StatusBoard } from './features/status-board/components/StatusBoard';
import { LeaveManagement } from './features/leave/components/LeaveManagement';
import { ProfilePage } from './features/profile/components/ProfilePage';
import { ManagerDashboard } from './features/manager/components/ManagerDashboard';
import { ManagerApprovals } from './features/manager/components/ManagerApprovals';
import type { RootState } from './store';
import { useEffect } from 'react';
import { checkSessionRequest } from './features/auth/authSlice';


const DefaultRedirect = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (user?.role === 'Manager') {
    return <Navigate to="/manager/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkSessionRequest());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>

            <Route element={<RequireAuth allowedRoles={['Employee']} />}>
              <Route path="/dashboard" element={<EmployeeDashboard />} />
              <Route path="/status-board" element={<StatusBoard />} />
              <Route path="/leaves" element={<LeaveManagement />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={['Manager']} />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/approvals" element={<ManagerApprovals />} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<DefaultRedirect />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}

export default App;