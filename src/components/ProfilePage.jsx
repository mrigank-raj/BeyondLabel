import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, isGuest, guestId, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="w-full animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant text-center md:text-left">
        <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-500 mb-8">Manage your BeyondLabel account and preferences.</p>

        {isGuest ? (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-bold text-xl text-gray-900 mb-2">Guest Mode Active</h2>
            <p className="text-sm text-gray-600 mb-6">
              You are currently using BeyondLabel anonymously. Your scan history is saved locally on this device. Sign in to sync your data across devices and unlock premium insights.
            </p>
            <p className="text-xs text-gray-400 mb-6 font-mono bg-white px-2 py-1 rounded">Guest ID: {guestId}</p>
            
            <button 
              onClick={signInWithGoogle}
              className="px-6 py-3 bg-gray-900 text-white rounded-pill font-bold shadow-sm hover:bg-gray-800 transition-colors w-full md:w-auto flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign In with Google
            </button>
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-4 mb-6 w-full justify-center md:justify-start">
              <div className="w-16 h-16 rounded-full bg-green-200 text-green-700 flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="text-left">
                <h2 className="font-bold text-xl text-gray-900">{user?.user_metadata?.full_name || 'Authenticated User'}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <button 
              onClick={signOut}
              className="px-6 py-2 bg-white text-red-600 border border-red-200 rounded-pill font-bold shadow-sm hover:bg-red-50 transition-colors w-full md:w-auto"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="font-bold text-gray-900">Default Goal</p>
              <p className="text-sm text-gray-500">Automatically applied to new scans</p>
            </div>
            <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">None</option>
              <option value="heart-health">Heart Health</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="blood-sugar">Blood Sugar</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
