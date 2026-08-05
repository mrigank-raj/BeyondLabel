import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import OnboardingModal from './OnboardingModal';
import { getHistory } from '../services/storageService';
import { DEMO_FOODS } from '../constants/mockData';

const DashboardHome = ({ 
  productName, handleProductNameChange, 
  imageFile, imagePreview, handleImageUpload,
  goal, handleGoalSelect,
  isLoading, handleSubmit, loadingStatus,
  validationErrors,
  onDemoSelect
}) => {
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    const history = getHistory();
    if (history.length > 0) {
      const lastTs = new Date(history[0].timestamp || 0).getTime();
      const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastTs > threeDaysMs) {
        setShowNudge(true);
      }
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-[70vh] animate-fade-in px-4 pb-12 pt-8 relative">
      <OnboardingModal onSelectGoal={handleGoalSelect} />
      
      {/* Re-engagement Nudge Card */}
      {showNudge && (
        <div className="max-w-xl w-full mx-auto mb-6 bg-gradient-to-r from-amber-500/10 to-secondary-fixed/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-600">bolt</span>
            <div>
              <p className="font-bold text-sm text-primary">Welcome back!</p>
              <p className="text-xs text-on-surface-variant">Ready to keep your healthy streak going?</p>
            </div>
          </div>
          <button onClick={() => setShowNudge(false)} className="text-on-surface-variant/60 hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="max-w-xl w-full mx-auto space-y-8 flex flex-col items-center text-center">
        
        <div className="space-y-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 shadow-sm text-xs font-bold text-primary animate-fade-in uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-lighter opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Vision AI Label Scanning
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight leading-tight text-gray-900">
            Know what <br /> you eat.
          </h1>
          
          <p className="text-gray-500 text-base max-w-sm">
            Scan any product label to instantly reveal hidden nasties and personalized health insights.
          </p>
        </div>

        {/* Demo Mode / Recruiter Section */}
        <div className="w-full text-left space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-gray-900">Recruiter Demo</h2>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Instant Verdicts</span>
          </div>
          <p className="text-sm text-gray-500">Tap a popular item below to instantly see how our verdict card works without needing an API key.</p>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {DEMO_FOODS.map((food) => (
              <button 
                key={food.id}
                onClick={() => onDemoSelect({
                  ...food.verdictData,
                  productName: food.name // Passing name for history if needed
                })}
                className="flex flex-col bg-white rounded-3xl p-3 border border-surface-variant shadow-sm hover:border-primary hover:shadow-md transition-all text-left group"
              >
                <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-3 overflow-hidden">
                  <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{food.category}</span>
                <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{food.name}</h3>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 my-4"></div>

        {/* Manual Search / Upload Section */}
        <div className="w-full text-left space-y-4">
          <h2 className="font-display font-bold text-xl text-gray-900">Live AI Analysis</h2>
          <p className="text-sm text-gray-500">Take a photo of a real nutrition label or search by name to use the live Gemini AI engine.</p>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-variant/50 space-y-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => handleProductNameChange(e.target.value)}
                placeholder="Type product name..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-pill py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <ImageUpload 
              imageFile={imageFile} 
              imagePreview={imagePreview} 
              onUpload={handleImageUpload} 
              variant="mobile-card"
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!productName && !imageFile)}
              className={`w-full py-3.5 rounded-pill font-bold text-sm transition-all duration-300 shadow-sm mt-4 ${
                isLoading || (!productName && !imageFile)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-light active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  {loadingStatus || "Analyzing..."}
                </span>
              ) : (
                "Analyze with AI"
              )}
            </button>
            {validationErrors?.input && (
              <p className="text-xs text-red-500 mt-2 text-center font-medium">
                {validationErrors.input}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
