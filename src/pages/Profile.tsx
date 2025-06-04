import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiBriefcase, FiCreditCard, FiMail, FiAward } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [licenseNumber, setLicenseNumber] = useState(user?.license_number || '');
  const [requiredPoints, setRequiredPoints] = useState(user?.required_annual_points || 50);
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    
    try {
      await updateProfile({
        full_name: fullName,
        profession,
        license_number: licenseNumber,
        required_annual_points: requiredPoints,
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="full-name" className="label">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full-name"
                    type="text"
                    className="pl-10 input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="label">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="pl-10 input bg-gray-50"
                    value={user.email}
                    disabled
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed
                </p>
              </div>
              
              <div>
                <label htmlFor="profession" className="label">
                  Profession
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="profession"
                    type="text"
                    className="pl-10 input"
                    placeholder="e.g., Doctor, Nurse, Pharmacist"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="license-number" className="label">
                  Professional License Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="license-number"
                    type="text"
                    className="pl-10 input"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="required-points" className="label">
                  Required Annual CPD Points
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiAward className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="required-points"
                    type="number"
                    min="1"
                    className="pl-10 input"
                    value={requiredPoints}
                    onChange={(e) => setRequiredPoints(parseInt(e.target.value))}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Set this according to your professional body's requirements
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        
        {/* CPD Summary */}
        <div className="md:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">CPD Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total CPD Points</h3>
                <p className="text-3xl font-bold text-primary-600">{user.total_cpd_points}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Annual Requirement</h3>
                <p className="text-xl font-semibold">{user.required_annual_points} points</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(Math.round((user.total_cpd_points / user.required_annual_points) * 100), 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.min(Math.round((user.total_cpd_points / user.required_annual_points) * 100), 100)}% complete
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Account Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full btn btn-outline">
                  Change Password
                </button>
                
                <button className="w-full btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
