import React from 'react';

const Hero = () => {
  return (
    <section className="text-center py-10 md:py-16 px-4 max-w-3xl mx-auto animate-fade-in">
      {/* Decorative badge */}
      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-primary-light text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-slide-down">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-lighter opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        AI-Powered Label Analysis
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 gradient-text leading-tight">
        What's really in your food?
      </h1>

      <p className="text-base md:text-lg text-gray-500 mb-2 max-w-xl mx-auto leading-relaxed">
        BeyondLabel catches misleading claims on Indian packaged foods and tells you
        if a product actually aligns with <span className="text-gray-700 font-semibold">your health goals</span>.
      </p>
    </section>
  );
};

export default Hero;
