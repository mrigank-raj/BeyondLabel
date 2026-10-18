import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import OnboardingModal from './OnboardingModal';
import { getHistory } from '../services/storageService';

const TRENDING = ['Maggi Masala Noodles', 'Kurkure Masala Munch', 'Yoga Bar Protein Bar'];

const DashboardHome = ({
  productName, handleProductNameChange,
  imageFile, imagePreview, handleImageUpload,
  goal, handleGoalSelect,
  isLoading, handleSubmit, loadingStatus,
  validationErrors,
  onTrendingSelect
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

        {/* Main Analysis Section */}
        <div className="w-full text-left">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.08)] border border-surface-variant/50 space-y-5">
            
            {/* Search Input */}
            <form role="search" onSubmit={handleSubmit} className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[22px]">search</span>
              <input
                type="search"
                enterKeyHint="search"
                aria-label="Search for a food product"
                value={productName}
                onChange={(e) => handleProductNameChange(e.target.value)}
                placeholder="Search e.g. Maggi, Kurkure..."
                className="w-full bg-gray-50 border border-gray-200 rounded-pill py-3.5 pl-12 pr-14 text-[15px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
              />
              {productName.trim() && (
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-label="Search"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-60"
                >
                  <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>
                    {isLoading ? 'progress_activity' : 'arrow_forward'}
                  </span>
                </button>
              )}
            </form>

            {/* Trending Searches: real searches, so results follow the user's goal */}
            {!productName && !imageFile && (
              <div className="animate-fade-in pt-1">
                <div className="flex items-center gap-1.5 mb-3 px-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">trending_up</span>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Trending Right Now</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => onTrendingSelect(name)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/30 rounded-full text-sm font-medium text-gray-700 hover:text-primary transition-all active:scale-95 group"
                    >
                      <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-primary/70 transition-colors">search</span>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 py-1">
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">OR UPLOAD LABEL</span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>

            <ImageUpload 
              imageFile={imageFile} 
              imagePreview={imagePreview} 
              onUpload={handleImageUpload} 
              variant="desktop-card"
            />

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!productName && !imageFile)}
              className={`w-full py-4 rounded-pill font-bold text-[15px] transition-all duration-300 mt-2 flex items-center justify-center gap-2 ${
                isLoading || (!productName && !imageFile)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-light active:scale-95 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                  {loadingStatus || "Analyzing..."}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                  Analyze with AI
                </>
              )}
            </button>
            {validationErrors?.input && (
              <p className="text-xs text-error mt-2 text-center font-medium bg-error/10 py-2.5 rounded-lg">
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
