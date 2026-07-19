import React from 'react';

const SideNavBar = ({ currentTab, setCurrentTab, onNewAnalysis }) => {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-variant/20 border-r border-surface-variant/50 pt-[80px] pb-6 z-40">
      <div className="px-6 py-6 border-b border-surface-variant/50 mb-4">
        <h3 className="font-display font-bold text-gray-900 text-sm uppercase tracking-widest mb-4 pl-2">Menu</h3>
        <button 
          onClick={onNewAnalysis}
          className="w-full bg-primary text-on-primary py-3 rounded-pill font-semibold hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Analysis
        </button>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto space-y-1 mt-4">
        <button 
          onClick={() => setCurrentTab('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 transition-colors ${
            currentTab === 'home' ? 'bg-primary-lighter/20 text-primary font-bold' : 'text-gray-500 hover:bg-surface-variant/30 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </button>
        <button 
          onClick={() => setCurrentTab('history')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 transition-colors ${
            currentTab === 'history' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-gray-500 hover:bg-surface-variant/30 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
        <button 
          onClick={() => setCurrentTab('insights')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 transition-colors ${
            currentTab === 'insights' ? 'bg-primary-lighter/20 text-primary font-bold shadow-sm' : 'text-gray-500 hover:bg-surface-variant/30 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Insights
        </button>


      </nav>

      <div className="px-3 mt-auto border-t border-surface-variant/50 pt-4">
        <button 
          onClick={() => setCurrentTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 transition-colors ${
            currentTab === 'profile' ? 'bg-primary-lighter/20 text-primary font-bold shadow-sm' : 'text-gray-500 hover:bg-surface-variant/30 font-medium'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;
