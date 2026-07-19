import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScanSuccess, onScanError, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [initError, setInitError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode('barcode-reader');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    setInitError(null);
    try {
      const html5Qrcode = new Html5Qrcode('barcode-reader');
      const decodedText = await html5Qrcode.scanFile(file, true);
      if (onScanSuccess) onScanSuccess(decodedText);
    } catch (err) {
      console.error('Error scanning file:', err);
      setInitError('Could not find a clear barcode in that photo. Please try again.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="text-white font-medium">Scan Barcode</h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isProcessingFile ? (
        <div className="flex flex-col items-center justify-center p-8 h-[300px] text-center bg-[#1a1a1a] text-white">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-bold">Analyzing Barcode...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 h-[300px] text-center bg-[#1a1a1a] text-white">
          <svg className="w-16 h-16 mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          
          <h4 className="text-xl font-bold mb-2">Scan a Barcode</h4>
          <p className="text-sm text-gray-400 mb-6 max-w-[250px]">
            {initError || "Take a clear photo of the product's barcode to analyze it instantly."}
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
      )}
    </div>
  );
};

export default BarcodeScanner;
