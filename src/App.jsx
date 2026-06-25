import React, { useState, useEffect } from 'react';
import DashboardHome from './components/DashboardHome';
import DashboardHistory from './components/DashboardHistory';
import VerdictCard from './components/VerdictCard';
import TopNavBar from './components/layout/TopNavBar';
import SideNavBar from './components/layout/SideNavBar';
import BottomNavBar from './components/layout/BottomNavBar';
import { analyzeProduct, analyzeImage } from './services/geminiService';

function App() {
  const [productName, setProductName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [goal, setGoal] = useState('');
  
  // App routing state
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'history', 'goals', 'profile'
  
  const [verdict, setVerdict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!goal) errors.goal = "Please select a health goal.";
    if (!productName && !imageFile) errors.input = "Enter a product name or upload a photo.";
    return errors;
  };

  // Generate preview URL when image changes
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // Clear verdict when user changes inputs to avoid showing stale data
  useEffect(() => {
    if (verdict) {
      setVerdict(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal, productName, imageFile]);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    
    const errors = validate();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStatus('Analyzing label...');

    const handleRetryMessage = (message) => {
      setLoadingStatus(message);
    };

    try {
      let result;
      if (imageFile) {
        result = await analyzeImage(imageFile, goal, handleRetryMessage);
      } else {
        result = await analyzeProduct(productName, goal, handleRetryMessage);
      }
      setVerdict(result);
    } catch (err) {
      console.error(err);
      
      let friendlyMessage = 'We ran into an issue analyzing the product. Please try again.';
      
      if (import.meta.env.DEV) {
        // Show detailed technical errors during local development
        friendlyMessage = err.message || 'An unexpected error occurred.';
      } else {
        // Mask technical jargon in production
        const msg = (err.message || '').toLowerCase();
        if (msg.includes('api key') || msg.includes('missing') || msg.includes('.env')) {
          friendlyMessage = 'Our AI service is currently undergoing maintenance. Please try again shortly.';
        } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('connect')) {
          friendlyMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (msg.includes('rate limit') || msg.includes('429') || msg.includes('busy')) {
          friendlyMessage = 'The AI service is currently busy. Please wait a moment and try again.';
        }
      }
      
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-on-background bg-background lg:pt-[72px]">
      <TopNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <SideNavBar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        onNewAnalysis={() => {
          setVerdict(null);
          setCurrentTab('home');
        }} 
      />
      
      <main className="flex-grow w-full lg:ml-64 p-5 md:p-8 pb-24 lg:pb-10 max-w-[1200px] mx-auto overflow-y-auto">
        {!verdict && currentTab === 'home' && (
          <DashboardHome 
            productName={productName}
            handleProductNameChange={(val) => {
              setProductName(val);
              if (validationErrors.input) setValidationErrors(prev => ({ ...prev, input: null }));
            }}
            imageFile={imageFile}
            imagePreview={imagePreview}
            handleImageUpload={(file) => {
              setImageFile(file);
              if (validationErrors.input) setValidationErrors(prev => ({ ...prev, input: null }));
            }}
            goal={goal}
            handleGoalSelect={(g) => {
              setGoal(g);
              if (validationErrors.goal) setValidationErrors(prev => ({ ...prev, goal: null }));
            }}
            isLoading={isLoading}
            loadingStatus={loadingStatus}
            handleSubmit={handleAnalyze}
            validationErrors={validationErrors}
          />
        )}

        {!verdict && currentTab === 'history' && (
          <DashboardHistory 
            onAnalyzeNew={() => {
              setCurrentTab('home');
              setVerdict(null);
            }} 
          />
        )}
        
        {/* Dismissable Error Banner */}
        {error && (
          <div className="max-w-xl mx-auto mb-6 bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-red-800 text-sm font-semibold">Analysis Error</p>
                <p className="text-red-600 text-sm mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {/* Main Application Logic */}
        {/* Removed old AnalysisForm */}

        {verdict && <VerdictCard verdictData={verdict} />}
      </main>

      <BottomNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default App;
