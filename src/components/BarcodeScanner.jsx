import React, { useState } from 'react';

const BarcodeScanner = ({ onScanSuccess, onScanError, onClose }) => {
  const [initError, setInitError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setInitError(null);
    
    // Since we no longer use html5-qrcode for client-side barcode decoding,
    // this now passes the captured image back as a file for label analysis.
    // The parent component can decide to look up the barcode via server API
    // or simply treat it as a label photo.
    if (onScanSuccess) {
      onScanSuccess(file);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="text-white font-medium">Scan Label</h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-8 h-[300px] text-center bg-[#1a1a1a] text-white">
        <svg className="w-16 h-16 mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
        
        <h4 className="text-xl font-bold mb-2">Snap a Label</h4>
        <p className="text-sm text-gray-400 mb-6 max-w-[250px]">
          {initError || "Take a clear photo of the product's ingredient label to analyze it."}
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-[250px]">
          <label className="px-6 py-3.5 bg-primary text-white rounded-pill font-bold hover:bg-primary-light transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-floating active:scale-95">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Open Camera
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileUpload}
              className="hidden" 
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
