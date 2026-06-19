import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { RootState } from '../../../store';
import { 
  fetchPendingLeavesRequest, 
  approveLeaveRequest, 
  rejectLeaveRequest 
} from '../managerSlice';
import { Avatar } from '../../../components/Avatar';

export const ManagerApprovals = () => {
  const dispatch = useDispatch();
  const { pendingLeaves, loading: managerLoading } = useSelector(
    (state: RootState) => state.manager
  );

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingLeavesRequest());
  }, [dispatch]);

  const handleApprove = (id: string) => {
    dispatch(approveLeaveRequest(id));
  };

  const openRejectForm = (id: string) => {
    setRejectingId(id);
    setRejectionReason('');
  };

  const submitRejection = (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    dispatch(rejectLeaveRequest({ leaveId: id, rejectionReason: rejectionReason.trim() }));
    setRejectingId(null);
    setRejectionReason('');
  };

  const cancelReject = () => {
    setRejectingId(null);
    setRejectionReason('');
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="mt-1 text-sm text-gray-500">Review and manage pending vacation requests from your team.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {managerLoading && pendingLeaves.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : pendingLeaves.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">All caught up!</h3>
            <p className="mt-1 text-sm text-gray-500">There are no pending vacation requests at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingLeaves.map((leave) => (
              <div key={leave.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar 
                      src={leave.employeeProfilePictureUrl} 
                      name={leave.employeeName || `Employee ${leave.userId}`} 
                      size="md" 
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {leave.employeeName || `Employee ID: ${leave.userId}`}
                    </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">Dates:</span> {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Reason:</span> {leave.reason || <span className="text-gray-400 italic">No reason provided</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                    <button
                      onClick={() => handleApprove(leave.id)}
                      disabled={managerLoading}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectForm(leave.id)}
                      disabled={managerLoading}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>

                {rejectingId === leave.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label htmlFor={`reason-${leave.id}`} className="block text-sm font-medium text-red-700 mb-1">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id={`reason-${leave.id}`}
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a clear reason for rejecting this request..."
                      className="block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      autoFocus
                    />
                    <div className="mt-3 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={cancelReject}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => submitRejection(leave.id)}
                        disabled={!rejectionReason.trim() || managerLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {managerLoading ? 'Processing...' : 'Submit Rejection'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};