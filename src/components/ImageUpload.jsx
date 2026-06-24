import React, { useRef, useState, useEffect, useCallback } from 'react';

const ImageUpload = ({ imageFile, imagePreview, onUpload }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showViewfinder, setShowViewfinder] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Detect mobile: used to decide between native capture vs live viewfinder
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || ('ontouchstart' in window && window.innerWidth < 1024);

  // Cleanup camera stream on unmount or when stream changes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Attach stream to video element when viewfinder opens
  useEffect(() => {
    if (showViewfinder && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showViewfinder, cameraStream]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  const validateAndUpload = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Unsupported format. Please use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Image is too large. Please use a photo under 4MB.");
      return;
    }
    onUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    validateAndUpload(file);
  };

  /**
   * Opens the camera.
   * - Mobile: triggers the native camera app via a hidden <input capture="environment">.
   * - Desktop: opens a live in-app viewfinder via getUserMedia().
   */
  const handleCameraClick = useCallback(async () => {
    if (isMobile) {
      // Mobile: use native camera capture
      cameraInputRef.current?.click();
      return;
    }

    // Desktop: open live viewfinder
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setShowViewfinder(true);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access was denied. Please allow camera permission in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. Please try uploading a photo instead.');
      }
    }
  }, [isMobile]);

  /**
   * Captures the current video frame from the live viewfinder.
   * Draws to a hidden canvas, converts to a File, and feeds into the existing upload pipeline.
   */
  const captureFromViewfinder = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `label-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          validateAndUpload(file);
        }
        closeViewfinder();
      },
      'image/jpeg',
      0.92
    );
  }, []);

  /**
   * Stops the camera stream and hides the viewfinder.
   */
  const closeViewfinder = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowViewfinder(false);
  }, [cameraStream]);

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
        Or upload a label photo
      </label>
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !imagePreview && fileInputRef.current?.click()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
          imagePreview 
            ? 'border-primary bg-green-50/60' 
            : isDragOver 
              ? 'border-primary bg-green-50 scale-[1.01] shadow-md' 
              : 'border-gray-300 hover:border-primary-lighter hover:bg-gray-50'
        }`}
      >
        <div className="space-y-1 text-center w-full">
          {imagePreview ? (
            <div className="flex flex-col items-center animate-fade-in">
              <img src={imagePreview} alt="Label preview" className="max-h-44 object-contain mb-3 rounded-lg shadow-card" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onUpload(null); }}
                className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-semibold px-4 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove photo
              </button>
            </div>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary-lighter" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex text-sm text-gray-600 justify-center mt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary-light focus-within:outline-none">
                  <span>Click to upload</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg, image/png, image/webp" ref={fileInputRef} onChange={handleFileChange} />
                </label>
                <p className="pl-1.5 text-gray-500">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">PNG, JPG, WEBP up to 4MB</p>
            </>
          )}
        </div>
      </div>

      {/* Camera Capture Button — shown when no image is uploaded */}
      {!imagePreview && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleCameraClick(); }}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:border-primary hover:text-primary hover:bg-green-50/50 active:scale-[0.98] transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          📸 Take Photo with Camera
        </button>
      )}

      {/* Hidden native camera input for mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Take photo with camera"
      />

      {/* Camera error message */}
      {cameraError && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-slide-down">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-amber-700">{cameraError}</p>
        </div>
      )}

      {/* Live Viewfinder Overlay (Desktop) */}
      {showViewfinder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
              <span className="text-white text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Camera
              </span>
              <button
                type="button"
                onClick={closeViewfinder}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close camera"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Feed */}
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Viewfinder guide lines */}
              <div className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-md"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-md"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-md"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-md"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center py-4 bg-gray-800">
              <button
                type="button"
                onClick={captureFromViewfinder}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-400 hover:border-primary hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg"
                aria-label="Capture photo"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-300"></div>
              </button>
            </div>

            {/* Hint */}
            <p className="text-center text-gray-400 text-xs pb-3">
              Position the food label in frame and tap the button to capture
            </p>
          </div>
        </div>
      )}

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageUpload;
