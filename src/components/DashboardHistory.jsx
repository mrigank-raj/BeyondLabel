import React, { useState, useEffect } from 'react';
import { getHistory, getWeeklyInsights } from '../services/storageService';

const DashboardHistory = ({ onAnalyzeNew }) => {
  const [history, setHistory] = useState([]);
  const [insights, setInsights] = useState({ safeRatio: 0, scanned: 0, goalAligned: 0, flagged: 0 });

  useEffect(() => {
    setHistory(getHistory());
    setInsights(getWeeklyInsights());
  }, []);
  return (
    <div className="w-full animate-fade-in space-y-6">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 px-1">
        <h1 className="font-display font-bold text-2xl text-gray-900">History</h1>
        <button className="text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-4xl p-6 md:p-8 flex items-center justify-between shadow-sm border border-surface-variant">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900">History & Goals</h1>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mt-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Premium Member
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex bg-green-50/50 rounded-2xl py-3 px-5 border border-green-100 items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">CURRENT FOCUS</p>
            <p className="font-semibold text-sm text-green-800">Muscle Gain & Recovery</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (takes 2/3 space on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Health Goals */}
          <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display font-bold text-xl text-gray-900">Active Health Goals</h2>
              <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:text-primary-light transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Goals
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Goal 1 (Active) */}
              <div className="border-2 border-gray-900 rounded-3xl p-5 relative bg-gray-50/50">
                <div className="absolute top-4 right-4 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">Muscle Gain</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Prioritizes high protein, complete amino acid profiles, and clean carbs.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-pill tracking-wider">High Protein</span>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-pill tracking-wider">Low Sugar</span>
                </div>
              </div>

              {/* Goal 2 (Inactive) */}
              <div className="border-2 border-surface-variant rounded-3xl p-5 relative opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-500">Heart Health</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  Strictly flags high sodium, trans fats, and added sugars.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-pill tracking-wider">Low Sodium</span>
                </div>
              </div>
            </div>
          </section>

          {/* Saved Analysis */}
          <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display font-bold text-xl text-gray-900">Saved Analysis</h2>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-pill">
                <button className="px-4 py-1.5 rounded-pill text-xs font-bold text-gray-500">All</button>
                <button className="px-4 py-1.5 rounded-pill text-xs font-bold bg-green-100 text-green-700 shadow-sm">Safe</button>
                <button className="px-4 py-1.5 rounded-pill text-xs font-bold text-red-500">Flagged</button>
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
              ) : (
                history.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shadow-sm flex items-center justify-center text-2xl">
                          {item.imageUrl ? (
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
                            item.verdictData?.verdict === 'Trustworthy' ? 'bg-green-100 text-green-700' :
                            item.verdictData?.verdict === 'Avoid' ? 'bg-red-100 text-red-700' :
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
                    </div>
                    {index < history.length - 1 && <div className="h-px bg-gray-100 w-full" />}
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
            
            <h2 className="font-display font-bold text-2xl mb-2 relative z-10">Weekly Insights</h2>
            <p className="text-green-100/80 text-sm mb-8 relative z-10">Your scanning habits are improving.</p>
            
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
              Instantly cross-check against your Muscle Gain goals.
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
