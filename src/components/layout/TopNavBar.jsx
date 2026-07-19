import React from 'react';

const TopNavBar = ({ currentTab, setCurrentTab }) => {
  return (
    <header className="hidden lg:flex fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-surface-variant/50 shadow-sm justify-between items-center px-10 py-3">
      <div className="flex items-center gap-3 w-64">
        <span className="font-display text-2xl font-bold text-primary tracking-tight">BeyondLabel</span>
      </div>
      
      <div className="flex items-center gap-8 text-[15px] font-semibold">
        <button 
          onClick={() => setCurrentTab('home')}
          className={`pb-1 border-b-2 transition-colors ${currentTab === 'home' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentTab('history')}
          className={`pb-1 border-b-2 transition-colors ${currentTab === 'history' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          History
        </button>
        <button 
          onClick={() => setCurrentTab('insights')}
          className={`pb-1 border-b-2 transition-colors ${currentTab === 'insights' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          Insights
        </button>
      </div>

      <div className="flex items-center gap-4 w-64 justify-end">
        <div className="relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-surface-variant/30 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
