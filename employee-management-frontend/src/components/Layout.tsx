import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logoutRequest } from '../features/auth/authSlice';
import { Avatar } from './Avatar';

export const Layout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.profile);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-blue-600">Check In/Out</span>

              {user.role === 'Employee' && (
                <div className="hidden sm:flex sm:space-x-6">
                  <Link to="/dashboard" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/status-board" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Status Board
                  </Link>
                  <Link to="/leaves" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    My Leaves
                  </Link>
                </div>
              )}
              {user.role === 'Manager' && (
                <div className="hidden sm:flex sm:space-x-6 border-l border-gray-200 pl-6">
                  <Link to="/manager/dashboard" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Manager Dashboard
                  </Link>
                  <Link to="/manager/approvals" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Approvals
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user.role === 'Employee' ? (
                <Link to="/profile" className="flex items-center space-x-3 group">
                  <Avatar src={profile?.profilePictureUrl} name={user.fullName} size="md" />
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};