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
          History & Goals
        </button>
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-surface-variant/30 rounded-xl mx-2 my-1 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ingredient Glossary
        </button>
      </nav>

      <div className="px-3 mt-auto border-t border-surface-variant/50 pt-4">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-surface-variant/30 rounded-xl mx-2 my-1 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </a>
      </div>
    </aside>
  );
};

export default SideNavBar;
