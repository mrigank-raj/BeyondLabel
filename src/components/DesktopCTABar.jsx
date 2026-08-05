import React, { useState, useEffect } from 'react';
import QRModal from './QRModal';

const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const DesktopCTABar = ({ hasVerdict }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('beyondlabel_cta_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 350 || hasVerdict) {
        setIsVisible(true);
      } else if (window.scrollY <= 350 && !hasVerdict) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasVerdict]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('beyondlabel_cta_dismissed', 'true');
  };

  if (isDismissed || (!isVisible && !hasVerdict)) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md border-t border-white/10 text-white px-6 py-3 shadow-2xl animate-slide-up">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="phone_iphone" className="text-secondary text-lg" />
            </div>
            <p className="text-xs sm:text-sm text-surface-variant font-medium truncate">
              BeyondLabel is best on mobile — scan labels instantly with your phone camera.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-secondary hover:bg-secondary-fixed text-white hover:text-primary font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-md"
            >
              <span>Open on phone</span>
              <Icon name="arrow_forward" className="text-sm" />
            </button>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-surface-variant hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <Icon name="close" className="text-base" />
            </button>
          </div>
        </div>
      </div>

      <QRModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default DesktopCTABar;
