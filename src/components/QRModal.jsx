import React from 'react';

const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const QRModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const qrUrl = "https://beyondlabel.vercel.app?utm_source=desktop&utm_medium=qr";
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrUrl)}&color=00261b&bgcolor=ffffff&margin=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Frosted Glass Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-sm bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/30 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center transition-colors text-on-surface-variant"
          aria-label="Close modal"
        >
          <Icon name="close" className="text-xl" />
        </button>

        {/* Icon & Title */}
        <div className="w-14 h-14 bg-secondary-fixed/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="qr_code_scanner" className="text-secondary text-3xl" />
        </div>

        <h3 className="font-display text-headline-md text-primary mb-2">
          Open on your phone
        </h3>
        <p className="text-body-md text-on-surface-variant mb-6">
          Open your phone camera and point it at this code to get the mobile app with live label scanning and streak tracking.
        </p>

        {/* Large QR Code Container */}
        <div className="bg-white rounded-3xl p-5 mb-6 shadow-md border border-outline-variant/30 mx-auto w-fit">
          <img
            src={qrImageSrc}
            alt="BeyondLabel Mobile QR Code"
            width="240"
            height="240"
            className="rounded-xl mx-auto block"
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-label-caps font-bold uppercase tracking-wider px-4 py-2 rounded-full">
          <Icon name="verified" className="text-base" />
          Camera Scanning Included
        </div>
      </div>
    </div>
  );
};

export default QRModal;
