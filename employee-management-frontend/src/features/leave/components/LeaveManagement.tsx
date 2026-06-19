import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { fetchMyLeavesRequest, submitLeaveRequest } from '../leaveSlice';
import type { LeaveType, LeaveRequest } from '../../../types';
import { toast } from 'react-toastify';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const LeaveManagement = () => {
    const dispatch = useDispatch();
    const { myLeaves, loading, error } = useSelector((state: RootState) => state.leave);

    const [leaveType, setLeaveType] = useState<LeaveType>('Vacation');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { dispatch(fetchMyLeavesRequest()); }, [dispatch]);

    useEffect(() => {
        if (isSubmitting && !loading) {
            setIsSubmitting(false);
            if (!error) { setStartDate(''); setEndDate(''); setReason(''); }
        }
    }, [loading, isSubmitting, error]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (startDate > endDate) { toast.error('End date cannot be before start date.'); return; }
        setIsSubmitting(true);
        dispatch(submitLeaveRequest({ leaveType, startDate, endDate, reason: reason.trim() || undefined }));
    };

    const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                <p className="mt-1 text-sm text-gray-500">Request time off and view your leave history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Request New Leave</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value as LeaveType)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
                                    <option value="Vacation">Vacation</option>
                                    <option value="Sick">Sick Leave</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">{leaveType === 'Sick' ? 'Sick leave is automatically approved.' : 'Vacation requests require manager approval.'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input type="date" id="startDate" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input type="date" id="endDate" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason / Comment <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Family vacation, Doctor's appointment..." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none" />
                            </div>
                            <button type="submit" disabled={loading || isSubmitting} className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {loading || isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</>) : ('Submit Request')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Your Leave History</h2>
                        </div>
                        {loading && myLeaves.length === 0 ? (
                            <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                        ) : myLeaves.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests yet</h3>
                                <p className="mt-1 text-sm text-gray-500">Use the form to submit your first request.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {myLeaves.map((leave: LeaveRequest) => (
                                            <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {leave.leaveType === 'Sick' ? (<svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>) : (<svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)}
                                                        <span className="text-sm font-medium text-gray-900">{leave.leaveType} Leave</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatDate(leave.startDate)}</div>
                                                    <div className="text-xs text-gray-500">to {formatDate(leave.endDate)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate" title={leave.reason || 'No reason provided'}>{leave.reason || <span className="text-gray-400 italic">None</span>}</div>
                                                    {leave.status === 'Rejected' && leave.rejectionReason && (<div className="text-xs text-red-600 mt-1"><span className="font-medium">Manager note:</span> {leave.rejectionReason}</div>)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(leave.status)}`}>{leave.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};