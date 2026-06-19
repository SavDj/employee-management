import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { fetchProfileRequest, updateProfileRequest } from '../profileSlice';
import { Avatar } from '../../../components/Avatar';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state: RootState) => state.profile);

  const [formData, setFormData] = useState({ address: '', phone: '', profilePictureUrl: '' });

  useEffect(() => { dispatch(fetchProfileRequest()); }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        address: profile.address || '',
        phone: profile.phone || '',
        profilePictureUrl: profile.profilePictureUrl || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateProfileRequest(formData));
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your personal information and view your work summary.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3"><svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
              <div className="ml-4"><p className="text-sm font-medium text-gray-500">Sick Leave Days</p><p className="text-2xl font-bold text-gray-900">{profile.sickDaysUsed}</p></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3"><svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <div className="ml-4"><p className="text-sm font-medium text-gray-500">Vacation Days</p><p className="text-2xl font-bold text-gray-900">{profile.vacationDaysUsed}</p></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3"><svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <div className="ml-4"><p className="text-sm font-medium text-gray-500">Remote Work Days</p><p className="text-2xl font-bold text-gray-900">{profile.remoteDays}</p></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3"><svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
              <div className="ml-4"><p className="text-sm font-medium text-gray-500">Office Work Days</p><p className="text-2xl font-bold text-gray-900">{profile.officeDays}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</p><p className="mt-1 text-sm text-gray-900">{profile.fullName}</p></div>
              <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</p><p className="mt-1 text-sm text-gray-900">{profile.email}</p></div>
              <div><p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</p><p className="mt-1 text-sm text-gray-900">{profile.department}</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile Details</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Avatar src={formData.profilePictureUrl || profile.profilePictureUrl} name={profile.fullName} size="lg" />
                <p className="mt-3 text-sm font-medium text-gray-900">{profile.fullName}</p>
              </div>
              <div>
                <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <input type="url" id="profilePictureUrl" name="profilePictureUrl" value={formData.profilePictureUrl} onChange={handleChange} placeholder="https://example.com/avatar.jpg" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                <p className="mt-1 text-xs text-gray-500">Enter a direct link to an image.</p>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea id="address" name="address" rows={3} value={formData.address} onChange={handleChange} placeholder="123 Main St, City, State, ZIP" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {loading ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : ('Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};