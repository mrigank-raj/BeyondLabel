import React, { useState } from 'react';
import GoalSelector from './GoalSelector';
import ImageUpload from './ImageUpload';

const AnalysisForm = ({ 
  productName, 
  setProductName, 
  imageFile, 
  imagePreview, 
  setImageFile, 
  goal, 
  setGoal, 
  onSubmit, 
  isLoading,
  loadingStatus
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [shouldShake, setShouldShake] = useState(false);

  const validate = () => {
    const errors = {};
    if (!goal) errors.goal = "Please select a health goal.";
    if (!productName && !imageFile) errors.input = "Enter a product name or upload a photo.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Trigger shake animation
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 600);
      return;
    }

    onSubmit();
  };

  // Clear relevant validation error when user interacts
  const handleProductNameChange = (value) => {
    setProductName(value);
    if (validationErrors.input) {
      setValidationErrors((prev) => ({ ...prev, input: null }));
    }
  };

  const handleGoalSelect = (goalId) => {
    setGoal(goalId);
    if (validationErrors.goal) {
      setValidationErrors((prev) => ({ ...prev, goal: null }));
    }
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    if (validationErrors.input) {
      setValidationErrors((prev) => ({ ...prev, input: null }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-card border border-gray-100 animate-slide-up ${
        shouldShake ? 'animate-shake' : ''
      }`}
    >
      {/* Product Name Input */}
      <div className="mb-6">
        <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2 text-left">
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          placeholder="e.g. Pintola Protein Oats"
          value={productName}
          onChange={(e) => handleProductNameChange(e.target.value)}
          disabled={isLoading || !!imageFile}
          className={`w-full px-4 py-3.5 rounded-xl border-2 focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200 text-gray-800 placeholder-gray-400 ${
            validationErrors.input && !imageFile
              ? 'border-red-300 bg-red-50/50'
              : 'border-gray-200'
          }`}
        />
        {!!imageFile && (
          <p className="text-xs text-gray-400 mt-2 text-left flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Text input disabled while an image is uploaded.
          </p>
        )}
        {validationErrors.input && !imageFile && (
          <p className="text-xs text-red-500 mt-2 text-left font-medium animate-slide-down">
            {validationErrors.input}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Image Upload */}
      <ImageUpload 
        imageFile={imageFile} 
        imagePreview={imagePreview} 
        onUpload={handleImageUpload} 
      />

      {/* Goal Selector */}
      <GoalSelector 
        selectedGoal={goal} 
        onSelect={handleGoalSelect} 
      />
      {validationErrors.goal && (
        <p className="text-xs text-red-500 -mt-4 mb-4 text-left font-medium animate-slide-down">
          {validationErrors.goal}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 mt-2 ${
          isLoading
            ? 'bg-primary/80 text-white/90 cursor-wait'
            : (!productName && !imageFile) || !goal
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white shadow-md hover:shadow-card-hover hover:bg-primary-light active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {loadingStatus || "Analyzing Label..."}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Analyze Product
          </span>
        )}
      </button>
    </form>
  );
};

export default AnalysisForm;
