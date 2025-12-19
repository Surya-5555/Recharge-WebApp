import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  CreditCard,
  Crown,
  Download
} from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactorAuth: false,
    emailUpdates: true
  });
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
    phone: authUser?.phone || '',
    location: authUser?.location || '',
    bio: authUser?.bio || ''
  });

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions/history');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put('/users/profile', formData);
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingToggle = async (setting) => {
    try {
      const newSettings = { ...settings, [setting]: !settings[setting] };
      setSettings(newSettings);
      // await axiosInstance.put('/users/settings', newSettings);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      toast.success('Premium upgrade feature coming soon!');
    } catch (error) {
      toast.error('Failed to upgrade to premium');
    }
  };

  const handleDownloadData = async () => {
    try {
      const response = await axiosInstance.get('/users/export-data');
      toast.success('Data export started. You will receive an email shortly.');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axiosInstance.delete('/users/account');
        toast.success('Account deletion initiated');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: authUser?.fullName || '',
      email: authUser?.email || '',
      phone: authUser?.phone || '',
      location: authUser?.location || '',
      bio: authUser?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="avatar">
              <div className="w-24 rounded-full ring-4 ring-primary/20">
                <img src={authUser?.profilePic} alt="Profile" />
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 btn btn-circle btn-sm btn-primary">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-base-content mb-2">{authUser?.fullName}</h1>
            <p className="text-base-content/70 mb-4">{authUser?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <div className="badge badge-outline">Free User</div>
              <div className="badge badge-secondary">Verified</div>
              <button 
                className="badge badge-warning hover:badge-warning/80 cursor-pointer gap-1"
                onClick={handleUpgradeToPremium}
              >
                <Crown className="w-3 h-3" />
                Upgrade to Premium
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <button 
                className="btn btn-primary gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  className="btn btn-success gap-2"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-ghost gap-2"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content">Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input input-bordered bg-base-100 text-base-content"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg">
                      <User className="w-4 h-4 text-base-content/50" />
                      <span className="text-base-content">{formData.fullName}</span>
                    </div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content">Email</span>
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg">
                    <Mail className="w-4 h-4 text-base-content/50" />
                    <span className="text-base-content">{formData.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content">Phone Number</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input input-bordered bg-base-100 text-base-content"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg">
                      <Phone className="w-4 h-4 text-base-content/50" />
                      <span className="text-base-content">{formData.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content">Location</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input input-bordered bg-base-100 text-base-content"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-base-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-base-content/50" />
                      <span className="text-base-content">{formData.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">Bio</span>
                </label>
                {isEditing ? (
                  <textarea
                    className="textarea textarea-bordered bg-base-100 text-base-content"
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                ) : (
                  <div className="p-3 bg-base-100 rounded-lg">
                    <span className="text-base-content">{formData.bio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Account Statistics</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{transactions.length}</div>
                <div className="text-base-content/70 text-sm">Total Recharges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  ₹{transactions.reduce((sum, t) => sum + t.amount, 0)}
                </div>
                <div className="text-base-content/70 text-sm">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-base-content/70 text-sm">Saved Cards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-info">
                  {authUser?.createdAt ? 
                    Math.ceil((new Date() - new Date(authUser.createdAt)) / (1000 * 60 * 60 * 24 * 30)) : 0
                  }
                </div>
                <div className="text-base-content/70 text-sm">Months Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Quick Settings */}
          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Quick Settings</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-base-content/70" />
                  <span className="text-base-content">Notifications</span>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={settings.notifications}
                  onChange={() => handleSettingToggle('notifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-base-content/70" />
                  <span className="text-base-content">Two-Factor Auth</span>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={settings.twoFactorAuth}
                  onChange={() => handleSettingToggle('twoFactorAuth')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-base-content/70" />
                  <span className="text-base-content">Email Updates</span>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={settings.emailUpdates}
                  onChange={() => handleSettingToggle('emailUpdates')}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Account Actions</h2>
            
            <div className="space-y-2">
              <button 
                className="btn btn-outline w-full justify-start gap-3"
                onClick={() => toast.info('Payment methods feature coming soon!')}
              >
                <CreditCard className="w-4 h-4" />
                Manage Payment Methods
              </button>
              
              <button 
                className="btn btn-outline w-full justify-start gap-3"
                onClick={() => toast.info('Security settings feature coming soon!')}
              >
                <Shield className="w-4 h-4" />
                Security Settings
              </button>
              
              <button 
                className="btn btn-outline w-full justify-start gap-3"
                onClick={handleDownloadData}
              >
                <Download className="w-4 h-4" />
                Download Data
              </button>
              
              <button 
                className="btn btn-error btn-outline w-full justify-start gap-3"
                onClick={handleDeleteAccount}
              >
                <X className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;