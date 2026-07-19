import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScanSuccess, onScanError, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [initError, setInitError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode('barcode-reader');

    const startScanner = async () => {
      try {
        // Explicitly request camera permissions first. 
        // This forces the browser to show the permission dialog.
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          throw new Error('No cameras found.');
        }

        // Stop any existing streams just in case
        if (html5Qrcode.isScanning) {
          await html5Qrcode.stop();
        }

        const config = {
          fps: 10, 
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
          formatsToSupport: [
            Html5Qrcode.formats.EAN_13,
            Html5Qrcode.formats.EAN_8,
            Html5Qrcode.formats.UPC_A,
            Html5Qrcode.formats.UPC_E,
            Html5Qrcode.formats.QR_CODE
          ]
        };

        const onSuccess = (decodedText) => {
          html5Qrcode.stop().catch(console.error);
          setIsScanning(false);
          if (onScanSuccess) onScanSuccess(decodedText);
        };

        const onError = (errorMessage) => {
          if (onScanError) onScanError(errorMessage);
        };

        setIsScanning(true);

        try {
          // First attempt: use environment facing mode
          await html5Qrcode.start({ facingMode: 'environment' }, config, onSuccess, onError);
        } catch (e) {
          console.warn('facingMode: environment failed, falling back to cameraId', e);
          // Fallback: use the last camera in the list (usually the back camera on Android)
          const backCamera = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('environment')) || cameras[cameras.length - 1];
          await html5Qrcode.start(backCamera.id, config, onSuccess, onError);
        }

      } catch (err) {
        console.error('Failed to start scanner:', err);
        const errStr = String(err).toLowerCase();
        
        let msg = 'Could not access the live camera. Please check your permissions.';
        if (errStr.includes('notallowed') || errStr.includes('denied')) {
          msg = 'Camera access was denied by your browser or device.';
        } else if (errStr.includes('notfound')) {
          msg = 'No camera found on this device.';
        } else if (errStr.includes('secure context')) {
          msg = 'Live camera requires a secure HTTPS connection.';
        }
        
        setInitError(msg);
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (html5Qrcode.isScanning) {
        html5Qrcode.stop().catch(console.error);
      }
    };
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

      {initError ? (
        <div className="flex flex-col items-center justify-center p-8 h-[300px] text-center bg-[#1a1a1a] text-white">
          <svg className="w-12 h-12 mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm mb-6">{initError}</p>
          
          <div className="flex flex-col gap-3 w-full max-w-[250px]">
            <label className="px-6 py-3 bg-white text-black rounded-pill font-bold hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              Take Photo Instead
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleFileUpload}
                className="hidden" 
              />
            </label>
            
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-primary text-white rounded-pill font-bold hover:bg-primary-light transition-colors"
            >
              Type Product Name
            </button>
          </div>
        </div>
      ) : isProcessingFile ? (
        <div className="flex flex-col items-center justify-center p-8 h-[300px] text-center bg-[#1a1a1a] text-white">
          <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-bold">Analyzing Barcode...</p>
        </div>
      ) : (
        <div id="barcode-reader" className="w-full h-full min-h-[300px]"></div>
      )}
      
      {/* Footer hint */}
      {!initError && (
        <div className="absolute bottom-4 left-0 right-0 z-10 text-center">
          <p className="inline-block px-4 py-1.5 rounded-full bg-black/60 text-white/90 text-sm backdrop-blur-md font-medium">
            Align barcode within the frame
          </p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
