import React, { useState, useEffect } from 'react';

const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const HEALTH_GOALS = [
  { name: 'General Health', desc: 'Balanced nutrition and ingredient transparency', icon: 'favorite' },
  { name: 'Heart Health', desc: 'Low sodium, heart-healthy fats, and cholesterol tracking', icon: 'monitor_heart' },
  { name: 'Vegan', desc: 'Strictly plant-based, cruelty-free ingredient checking', icon: 'spa' },
  { name: 'Keto / Low-Carb', desc: 'Minimal sugars and net-carb optimization', icon: 'bolt' },
  { name: 'Gluten-Free', desc: 'Detect hidden wheat, gluten, and cross-contamination risks', icon: 'grain' },
  { name: 'Clean Eating', desc: 'Avoid artificial dyes, preservatives, and emulsifiers', icon: 'eco' },
];

const OnboardingModal = ({ onComplete, onSelectGoal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('General Health');

  useEffect(() => {
    const onboarded = localStorage.getItem('beyondlabel_onboarded');
    if (onboarded === 'true') return;

    // If user arrived via Desktop QR referral, skip step 1 straight to Goal Picker
    const referral = localStorage.getItem('beyondlabel_referral');
    if (referral) {
      setStep(2);
    }
    setIsOpen(true);
  }, []);

  const handleFinish = () => {
    localStorage.setItem('beyondlabel_onboarded', 'true');
    localStorage.setItem('beyondlabel_default_goal', selectedGoal);
    if (onSelectGoal) onSelectGoal(selectedGoal);
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/30 shadow-2xl text-center">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-secondary' : 'w-2 bg-surface-variant/40'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-secondary-fixed/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Icon name="eco" className="text-secondary text-4xl" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">
              Welcome to BeyondLabel
            </h2>
            <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
              Your AI-powered food transparency guide. Scan labels, detect hidden additives, and make confident choices in seconds.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-secondary hover:bg-secondary-fixed text-white hover:text-primary font-bold py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <Icon name="arrow_forward" />
            </button>
          </div>
        )}

        {/* Step 2: Goal Picker */}
        {step === 2 && (
          <div className="animate-fade-in text-left">
            <h2 className="font-display text-xl font-bold text-primary mb-1 text-center">
              Choose Your Primary Goal
            </h2>
            <p className="text-xs text-on-surface-variant mb-5 text-center">
              We tailor your health scores and ingredient warnings based on your goal.
            </p>

            <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1 mb-6">
              {HEALTH_GOALS.map((g) => {
                const isActive = selectedGoal === g.name;
                return (
                  <button
                    key={g.name}
                    onClick={() => setSelectedGoal(g.name)}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                      isActive
                        ? 'bg-secondary/15 border-secondary shadow-sm'
                        : 'bg-surface border-outline-variant/30 hover:border-outline'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-secondary text-white' : 'bg-surface-variant/30 text-secondary'
                      }`}
                    >
                      <Icon name={g.icon} className="text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-on-surface">{g.name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{g.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-secondary hover:bg-secondary-fixed text-white hover:text-primary font-bold py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <Icon name="arrow_forward" />
            </button>
          </div>
        )}

        {/* Step 3: Permission Primer */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-primary-fixed/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Icon name="photo_camera" className="text-primary text-4xl" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">
              Scan with Your Camera
            </h2>
            <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
              BeyondLabel works best when scanning ingredient lists directly at the grocery store. Allow camera access when prompted.
            </p>
            <button
              onClick={handleFinish}
              className="w-full bg-secondary hover:bg-secondary-fixed text-white hover:text-primary font-bold py-3.5 rounded-2xl transition-all shadow-lg mb-3"
            >
              Start Scanning
            </button>
            <button
              onClick={handleFinish}
              className="w-full text-xs text-on-surface-variant hover:text-on-surface py-2 font-medium"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
