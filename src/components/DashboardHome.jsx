import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const DashboardHome = ({ 
  productName, handleProductNameChange, 
  imageFile, imagePreview, handleImageUpload,
  isLoading, handleSubmit, loadingStatus,
  validationErrors,
  onOpenScanner
}) => {
  const [showManual, setShowManual] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center px-4">
      
      {/* Hero Section */}
      <div className="max-w-xl w-full mx-auto space-y-8 flex flex-col items-center">
        
        <div className="space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Know what you eat.
          </h1>
          <p className="text-gray-500 text-lg md:text-xl">
            Scan any product label to see if it's actually healthy.
          </p>
        </div>

        {/* Massive Primary CTA */}
        <button 
          onClick={onOpenScanner}
          className="w-full max-w-sm aspect-square md:aspect-auto md:h-24 bg-primary text-white rounded-[40px] md:rounded-full shadow-floating hover:bg-primary-light active:scale-95 transition-all flex flex-col md:flex-row items-center justify-center gap-4 group"
        >
          <svg className="w-12 h-12 md:w-8 md:h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="font-display font-bold text-2xl">Tap to Scan</span>
        </button>

        {/* Secondary Options Toggle */}
        {!showManual ? (
          <button 
            onClick={() => setShowManual(true)}
            className="text-gray-400 font-semibold hover:text-gray-600 transition-colors text-sm pt-4"
          >
            Or search manually
          </button>
        ) : (
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-surface-variant/50 animate-slide-down space-y-4">
            
            <div className="relative w-full">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => handleProductNameChange(e.target.value)}
                placeholder="Type product name..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-pill py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="w-full text-left">
              <ImageUpload 
                imageFile={imageFile} 
                imagePreview={imagePreview} 
                onUpload={handleImageUpload} 
                variant="mobile-card"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || (!productName && !imageFile)}
              className={`w-full py-3.5 rounded-pill font-bold text-sm transition-all duration-300 shadow-sm mt-4 ${
                isLoading || (!productName && !imageFile)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-black active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingStatus || "Analyzing..."}
                </span>
              ) : (
                "Analyze Now"
              )}
            </button>
            {validationErrors?.input && (
              <p className="text-xs text-red-500 mt-2 text-center font-medium">
                {validationErrors.input}
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default DashboardHome;
