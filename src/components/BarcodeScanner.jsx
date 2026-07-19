import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScanSuccess, onScanError, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode('barcode-reader');

    const startScanner = async () => {
      try {
        // Stop any existing streams just in case
        if (html5Qrcode.isScanning) {
          await html5Qrcode.stop();
        }

        setIsScanning(true);
        await html5Qrcode.start(
          { facingMode: 'environment' }, // Prefer back camera
          {
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
          },
          (decodedText) => {
            // Success callback
            html5Qrcode.stop().catch(console.error);
            setIsScanning(false);
            if (onScanSuccess) onScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Continuous scanning errors (usually just means no barcode in frame)
            if (onScanError) onScanError(errorMessage);
          }
        );
      } catch (err) {
        console.error('Failed to start scanner', err);
        setInitError('Could not access the camera. Please check your permissions.');
        setIsScanning(false);
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (html5Qrcode.isScanning) {
        html5Qrcode.stop().catch(console.error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="flex flex-col items-center justify-center p-8 h-[300px] text-center bg-surfaceVariant text-on-surfaceVariant">
          <svg className="w-12 h-12 mb-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{initError}</p>
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
