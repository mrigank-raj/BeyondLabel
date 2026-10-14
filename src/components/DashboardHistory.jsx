import React, { useState, useEffect } from 'react';
import { getHistory, getWeeklyInsights, verdictCategory } from '../services/storageService';
import { HEALTH_GOALS, resolveGoalId } from '../constants/goals';

const FILTERS = [
  { id: 'all', label: 'All', active: 'bg-white text-gray-900 shadow-sm' },
  { id: 'safe', label: 'Safe', active: 'bg-green-100 text-green-700 shadow-sm' },
  { id: 'flagged', label: 'Flagged', active: 'bg-red-100 text-red-700 shadow-sm' },
];

const DashboardHistory = ({ onAnalyzeNew, goal, onEditGoal, onOpenItem }) => {
  const [history, setHistory] = useState([]);
  const [insights, setInsights] = useState({ safeRatio: 0, scanned: 0, goalAligned: 0, flagged: 0 });
  const [filter, setFilter] = useState('all');
  const currentGoal = HEALTH_GOALS.find((g) => g.id === resolveGoalId(goal));
  const shown = filter === 'all' ? history : history.filter((item) => verdictCategory(item.verdictData?.verdict) === filter);

  useEffect(() => {
    setHistory(getHistory());
    setInsights(getWeeklyInsights());
  }, []);
  return (
    <div className="w-full animate-fade-in space-y-6">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 px-1">
        <h1 className="font-display font-bold text-2xl text-gray-900">History</h1>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-4xl p-6 md:p-8 flex items-center justify-between shadow-sm border border-surface-variant">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-white shadow-sm flex-shrink-0 flex items-center justify-center text-3xl" aria-hidden="true">
            {currentGoal.emoji}
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">History & Goals</h1>
            <p className="text-sm font-semibold text-gray-500 mt-1">Saved on this device</p>
          </div>
        </div>
        
        <div className="hidden md:flex bg-green-50/50 rounded-2xl py-3 px-5 border border-green-100 items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">CURRENT FOCUS</p>
            <p className="font-semibold text-sm text-green-800">{currentGoal.label}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (takes 2/3 space on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Health Goals */}
          <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display font-bold text-xl text-gray-900">Your Health Goal</h2>
              <button onClick={onEditGoal} className="text-primary text-sm font-semibold flex items-center gap-1 hover:text-primary-light transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Change Goal
              </button>
            </div>

            <div className="border-2 border-gray-900 rounded-3xl p-5 relative bg-gray-50/50">
                <div className="absolute top-4 right-4 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl" aria-hidden="true">
                    {currentGoal.emoji}
                  </div>
                  <h3 className="font-bold text-gray-900">{currentGoal.label}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{currentGoal.desc}</p>
            </div>
          </section>

          {/* Saved Analysis */}
          <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display font-bold text-xl text-gray-900">Saved Analysis</h2>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-pill">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-1.5 rounded-pill text-xs font-bold transition-colors ${filter === f.id ? f.active : 'text-gray-600'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No analysis history yet.</p>
                  <button 
                    onClick={onAnalyzeNew}
                    className="px-6 py-2 bg-primary-lighter/20 text-primary font-bold rounded-pill text-sm hover:bg-primary-lighter/30 transition-colors"
                  >
                    Scan your first product
                  </button>
                </div>
              ) : shown.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No {filter} products yet.</p>
              ) : (
                shown.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() => onOpenItem?.(item)}
                      className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shadow-sm flex items-center justify-center text-2xl">
                          {/* blob: preview URLs die on reload, so they'd render as broken images */}
                          {item.imageUrl && !item.imageUrl.startsWith('blob:') ? (
                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            '📦'
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.productName}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="hidden sm:block">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-widest block w-fit ml-auto mb-1 ${
                            (item.verdictData?.verdict === 'Excellent' || item.verdictData?.verdict === 'Good') ? 'bg-green-100 text-green-700' :
                            (item.verdictData?.verdict === 'Poor' || item.verdictData?.verdict === 'Avoid') ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {item.verdictData?.verdict}
                          </span>
                          <span className="text-xs text-gray-500 font-medium line-clamp-1 max-w-[150px]">
                            {item.verdictData?.goalNote || item.verdictData?.suggestion || 'Analyzed'}
                          </span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                    {index < shown.length - 1 && <div className="h-px bg-gray-100 w-full" />}
                  </React.Fragment>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Right Column (takes 1/3 space on desktop) */}
        <div className="space-y-6">
          
          {/* Weekly Insights */}
          <section className="bg-[#003823] text-white rounded-4xl p-6 md:p-8 shadow-floating relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <h2 className="font-display font-bold text-2xl mb-2 relative z-10">Your Insights</h2>
            <p className="text-green-100/80 text-sm mb-8 relative z-10">Based on the scans saved on this device.</p>
            
            <div className="space-y-2 mb-8 relative z-10">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-green-100">Safe Ratio</span>
                <span className="text-green-400 font-bold">{insights.safeRatio}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
                <div className="bg-green-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${insights.safeRatio}%` }}></div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-sm text-green-100/80">Products Scanned</span>
                <span className="font-bold">{insights.scanned}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <span className="text-sm text-green-100/80">Goal Aligned</span>
                <span className="font-bold text-green-400">{insights.goalAligned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-100/80">Flagged Ingredients</span>
                <span className="font-bold text-red-400">{insights.flagged}</span>
              </div>
            </div>
          </section>

          {/* Analyze New Label Card */}
          <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Analyze New Label</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Instantly cross-check against your {currentGoal.label} goal.
            </p>
            <button 
              onClick={onAnalyzeNew}
              className="w-full bg-gray-900 text-white py-3.5 rounded-pill font-bold hover:bg-gray-800 transition-colors"
            >
              Open Camera
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DashboardHistory;
