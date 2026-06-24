import React, { useRef, useState } from 'react';

const ImageUpload = ({ imageFile, imagePreview, onUpload }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
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
    </div>
  );
};

export default ImageUpload;
