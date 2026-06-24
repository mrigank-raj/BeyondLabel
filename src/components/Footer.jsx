import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 pb-8 text-center px-4 max-w-2xl mx-auto animate-fade-in">
      <div className="border-t border-gray-200 pt-8 space-y-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-600">Disclaimer:</strong> BeyondLabel provides AI-generated analysis for informational purposes only.
          It is not a substitute for medical or dietary advice. Always consult a healthcare professional.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
          <span className="text-base">🍃</span>
          <span>BeyondLabel v1.0</span>
          <span className="text-gray-300">•</span>
          <span>AI Food Label Analyzer</span>
          <span className="text-gray-300">•</span>
          <span>Made for India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
