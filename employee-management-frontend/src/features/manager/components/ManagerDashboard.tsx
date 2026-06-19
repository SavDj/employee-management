import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { fetchEmployeesRequest, fetchEmployeeDashboardRequest } from '../managerSlice';
import { Avatar } from '../../../components/Avatar';

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const textColor = {
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
  }[color] || 'text-gray-600';

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

export const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { employees, selectedEmployeeDashboard, loading: managerLoading } = useSelector(
    (state: RootState) => state.manager
  );

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEmployeesRequest());
  }, [dispatch]);

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    dispatch(fetchEmployeeDashboardRequest(id)); 
  };

  const filteredEmployees = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(lowerTerm) ||
        emp.department.toLowerCase().includes(lowerTerm)
    );
  }, [employees, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Office': return 'bg-green-100 text-green-800 border-green-200';
      case 'Remote': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vacation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Sick': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">View employee statuses and detailed attendance records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Employees</h2>
            <input
              type="text"
              placeholder="Search name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {managerLoading && employees.length === 0 ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No employees found.</div>
            ) : (
              filteredEmployees.map((emp) => (
                <button
                  key={emp.userId}
                  onClick={() => handleSelectEmployee(emp.userId)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    selectedEmployeeId === emp.userId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                <div className="flex items-center space-x-3">
                  <Avatar src={emp.profilePictureUrl} name={emp.fullName} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{emp.fullName}</p>
                    <p className="text-xs text-gray-500">{emp.department}</p>
                  </div>
                </div>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(emp.status)}`}>
                  {emp.status}
                </span>
              </button>
            )))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedEmployeeId ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employee selected</h3>
              <p className="mt-1 text-sm text-gray-500">Select an employee from the list to view their detailed dashboard.</p>
            </div>
          ) : managerLoading && !selectedEmployeeDashboard ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedEmployeeDashboard ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-4">
                <Avatar src={selectedEmployeeDashboard.profilePictureUrl} name={selectedEmployeeDashboard.fullName} size="lg" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedEmployeeDashboard.fullName}</h2>
                  <p className="text-sm text-gray-500">{selectedEmployeeDashboard.email} • {selectedEmployeeDashboard.department}</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance & Leave Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Sick Leave" value={selectedEmployeeDashboard.sickDaysUsed} color="red" />
                  <StatCard label="Vacation" value={selectedEmployeeDashboard.vacationDaysUsed} color="yellow" />
                  <StatCard label="Remote Days" value={selectedEmployeeDashboard.remoteDays} color="blue" />
                  <StatCard label="Office Days" value={selectedEmployeeDashboard.officeDays} color="green" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-red-500">
              Failed to load employee dashboard. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};