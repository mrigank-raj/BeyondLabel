import React from 'react';

const BottomNavBar = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-surface-variant/50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50 px-6 py-2 pb-safe flex justify-between items-center">
      <button 
        onClick={() => setCurrentTab('home')}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${currentTab === 'home' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
      >
        <div className={`w-12 h-8 rounded-pill flex items-center justify-center ${currentTab === 'home' ? 'bg-primary-lighter/20' : ''}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold">Home</span>
      </button>

      <button 
        onClick={() => setCurrentTab('history')}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${currentTab === 'history' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
      >
        <div className={`w-12 h-8 rounded-pill flex items-center justify-center ${currentTab === 'history' ? 'bg-primary-lighter/20' : ''}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold">History</span>
      </button>

      <button className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-gray-400 hover:text-primary transition-colors">
        <div className="w-12 h-8 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold">Goals</span>
      </button>

      <button className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-gray-400 hover:text-primary transition-colors">
        <div className="w-12 h-8 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNavBar;
