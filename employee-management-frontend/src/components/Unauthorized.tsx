import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const Unauthorized = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const dashboardPath = user?.role === 'Manager' ? '/manager/dashboard' : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-8">
          You do not have the required permissions to view this page.
        </p>
        <Link 
          to={dashboardPath} 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};