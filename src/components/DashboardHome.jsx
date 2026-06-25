import React from 'react';
import GoalSelector from './GoalSelector';
import ImageUpload from './ImageUpload';

const DashboardHome = ({ 
  productName, handleProductNameChange, 
  imageFile, imagePreview, handleImageUpload,
  goal, handleGoalSelect,
  isLoading, handleSubmit, loadingStatus,
  validationErrors
}) => {
  return (
    <div className="w-full">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="lg:hidden flex items-center gap-2 mb-6 px-1">
        <img src="/logo.png" alt="BeyondLabel" className="h-8 object-contain" />
      </div>

      {/* Desktop Welcome (Hidden on Mobile) */}
      <section className="hidden lg:block space-y-2 mb-10">
        <h1 className="font-display text-4xl text-primary font-bold">Welcome to BeyondLabel.</h1>
        <p className="text-lg text-gray-500 max-w-2xl">What are we eating today? Let's decode the labels and ensure they align with your health journey.</p>
      </section>

      {/* Mobile Search Bar (Hidden on Desktop because it's in TopNav) */}
      <div className="lg:hidden relative w-full mb-6">
        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          value={productName}
          onChange={(e) => handleProductNameChange(e.target.value)}
          placeholder="Search product or barcode..." 
          className="w-full bg-surface-variant/20 border border-surface-variant/50 rounded-pill py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
        />
        <button 
          onClick={handleSubmit}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-variant/50 flex items-center justify-center text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Bento Grid layout for core actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-10">
        
        {/* Analyze Product Card (Mobile uses this as primary CTA, Desktop uses ImageUpload) */}
        <div className="lg:hidden w-full">
          <ImageUpload 
            imageFile={imageFile} 
            imagePreview={imagePreview} 
            onUpload={handleImageUpload} 
            variant="mobile-card"
          />
        </div>

        {/* Desktop Upload Card */}
        <div className="hidden lg:flex bg-primary rounded-4xl p-8 flex-col items-center justify-center text-center shadow-floating min-h-[220px]">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="font-display text-white text-xl font-bold mb-1">Analyze a Product</h2>
          <p className="text-primary-lighter text-sm mb-4">Take a photo of any nutrition label</p>
          
          <div className="w-full bg-white/10 rounded-2xl p-2">
            <ImageUpload 
              imageFile={imageFile} 
              imagePreview={imagePreview} 
              onUpload={handleImageUpload} 
              variant="desktop-card"
            />
          </div>
        </div>

        {/* Quick Search Card (Desktop only - mobile search is at top) */}
        <div className="hidden lg:flex bg-surface rounded-4xl p-8 flex-col justify-center shadow-card border border-surface-variant min-h-[220px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-surface-variant/50 text-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="font-display text-primary text-xl font-bold">Quick Search</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6">Type a product name or scan a barcode directly.</p>
          
          <div className="relative w-full">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={productName}
              onChange={(e) => handleProductNameChange(e.target.value)}
              placeholder="Enter product or barcode..." 
              className="w-full bg-white border-2 border-surface-variant rounded-pill py-4 pl-12 pr-12 text-base focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
            <button 
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-2 hover:bg-primary-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          {validationErrors?.input && (
            <p className="text-xs text-red-500 mt-2 text-left font-medium">
              {validationErrors.input}
            </p>
          )}
        </div>
      </div>

      {/* Goals Section */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold text-gray-900">My Goals</h3>
          <button className="text-primary text-sm font-semibold hover:underline lg:hidden">Edit</button>
        </div>
        <GoalSelector 
          selectedGoal={goal} 
          onSelect={handleGoalSelect} 
        />
        {validationErrors?.goal && (
          <p className="text-xs text-red-500 mt-2 text-left font-medium">
            {validationErrors.goal}
          </p>
        )}
      </div>

      {/* Recent Scans Placeholder */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold text-gray-900">Recent Scans</h3>
          <button className="text-sm font-semibold hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-surface-variant/50 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1622484211148-7076a084dd88?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Oat Milk Bar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Oat Milk Bar</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-xs text-gray-500 font-medium">High Sugar</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-surface-variant/50 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1559839914-11aae62e1531?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Bread" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Whole Wheat Bread</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-500 font-medium">Perfect Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile Submission Buttons (Hidden on desktop since they are in cards) */}
      <div className="lg:hidden w-full mb-8">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-pill font-bold text-lg transition-all duration-300 shadow-md ${
            isLoading
              ? 'bg-primary/80 text-white/90 cursor-wait'
              : 'bg-primary text-on-primary hover:shadow-floating active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {loadingStatus || "Analyzing..."}
            </span>
          ) : (
            "Analyze Product"
          )}
        </button>
      </div>

    </div>
  );
};

export default DashboardHome;
