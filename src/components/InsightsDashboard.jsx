import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';

const InsightsDashboard = () => {
  const [history, setHistory] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    // In a full implementation, this would fetch from Supabase.
    // For now, we use the local cache which stays in sync with Supabase.
    setHistory(getHistory());
  }, []);

  const calculateStreak = () => {
    if (history.length === 0) return 0;
    
    // Sort descending by date
    const sortedDates = history.map(item => new Date(item.timestamp).setHours(0,0,0,0))
                              .sort((a, b) => b - a);
    
    // Remove duplicates
    const uniqueDates = [...new Set(sortedDates)];
    
    let streak = 0;
    const today = new Date().setHours(0,0,0,0);
    const msInDay = 24 * 60 * 60 * 1000;
    
    // Check if streak is active today or yesterday
    if (uniqueDates[0] === today || uniqueDates[0] === today - msInDay) {
      streak = 1;
      let currentDate = uniqueDates[0];
      
      for (let i = 1; i < uniqueDates.length; i++) {
        if (uniqueDates[i] === currentDate - msInDay) {
          streak++;
          currentDate = uniqueDates[i];
        } else {
          break;
        }
      }
    }
    
    return streak;
  };

  const getStats = () => {
    let excellent = 0, good = 0, moderate = 0, poor = 0, avoid = 0;
    let categories = {};

    history.forEach(item => {
      const v = item.verdictData?.verdict;
      if (v === 'Excellent') excellent++;
      else if (v === 'Good') good++;
      else if (v === 'Moderate') moderate++;
      else if (v === 'Poor') poor++;
      else if (v === 'Avoid') avoid++;

      // Mocking category since we don't always have it structured perfectly
      const cat = item.verdictData?.category || 'Snacks';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const safeCount = excellent + good;
    const flaggedCount = poor + avoid;
    const total = history.length;
    
    return {
      total,
      safeRatio: total ? Math.round((safeCount / total) * 100) : 0,
      flaggedCount,
      topCategory: Object.entries(categories).sort((a,b) => b[1]-a[1])[0]?.[0] || 'None'
    };
  };

  const streak = calculateStreak();
  const stats = getStats();

  return (
    <div className="w-full animate-fade-in space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">Your Insights</h1>
          <p className="text-gray-500 mt-1">Track your progress toward healthier choices.</p>
        </div>
      </div>

      {/* Gamification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          <div>
            <p className="text-orange-100 font-semibold mb-1">Current Streak</p>
            <h2 className="text-4xl font-black font-display">{streak} <span className="text-2xl font-bold opacity-80">Days</span></h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-surface-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Safe Choices</p>
            <h2 className="text-4xl font-black font-display text-gray-900">{stats.safeRatio}%</h2>
            <p className="text-xs text-gray-400 mt-1">Of your scanned products</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-surface-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center text-xl">
              🏆
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Products Scanned</p>
            <h2 className="text-4xl font-black font-display text-gray-900">{stats.total}</h2>
            <p className="text-xs text-gray-400 mt-1">Top Category: {stats.topCategory}</p>
          </div>
        </div>
      </div>

      {/* Badges / Achievements */}
      <section className="bg-white rounded-4xl p-6 md:p-8 shadow-sm border border-surface-variant">
        <h2 className="font-display font-bold text-xl text-gray-900 mb-6">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className={`p-4 rounded-2xl border-2 text-center transition-colors ${stats.total >= 1 ? 'border-amber-400 bg-amber-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            <div className="text-3xl mb-2">{stats.total >= 1 ? '🥚' : '🔒'}</div>
            <h3 className="font-bold text-gray-900 text-sm">First Scan</h3>
            <p className="text-xs text-gray-500 mt-1">Scan a product</p>
          </div>

          <div className={`p-4 rounded-2xl border-2 text-center transition-colors ${stats.flaggedCount >= 5 ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            <div className="text-3xl mb-2">{stats.flaggedCount >= 5 ? '🛡️' : '🔒'}</div>
            <h3 className="font-bold text-gray-900 text-sm">Dodged a Bullet</h3>
            <p className="text-xs text-gray-500 mt-1">Identify 5 poor products</p>
          </div>

          <div className={`p-4 rounded-2xl border-2 text-center transition-colors ${streak >= 7 ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            <div className="text-3xl mb-2">{streak >= 7 ? '📅' : '🔒'}</div>
            <h3 className="font-bold text-gray-900 text-sm">7-Day Streak</h3>
            <p className="text-xs text-gray-500 mt-1">Scan 7 days in a row</p>
          </div>

          <div className={`p-4 rounded-2xl border-2 text-center transition-colors ${stats.total >= 50 ? 'border-purple-400 bg-purple-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            <div className="text-3xl mb-2">{stats.total >= 50 ? '👑' : '🔒'}</div>
            <h3 className="font-bold text-gray-900 text-sm">Label Master</h3>
            <p className="text-xs text-gray-500 mt-1">Scan 50 products</p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default InsightsDashboard;
