import React, { useState, useRef, useEffect } from 'react';

const VerdictCard = ({ verdictData }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [verdictData]);

  if (!verdictData) return null;

  const { verdict, why, alternatives, goalNote, suggestion, claims, nutrition_facts, ingredients } = verdictData;

  const getVerdictConfig = () => {
    switch (verdict) {
      case 'Trustworthy':
        return {
          bg: 'bg-green-50/80',
          border: 'border-verdict-trust',
          color: 'text-verdict-trust',
          icon: '✅',
          label: 'Trustworthy',
          desktopBg: 'bg-[#006c49]',
          desktopText: 'text-white'
        };
      case 'Questionable':
        return {
          bg: 'bg-amber-50/80',
          border: 'border-verdict-question',
          color: 'text-verdict-question',
          icon: '⚠️',
          label: 'Questionable',
          desktopBg: 'bg-[#dd8d00]',
          desktopText: 'text-white'
        };
      case 'Avoid':
        return {
          bg: 'bg-red-50/80',
          border: 'border-verdict-avoid',
          color: 'text-verdict-avoid',
          icon: '❌',
          label: 'Avoid',
          desktopBg: 'bg-[#ba1a1a]',
          desktopText: 'text-white'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-400',
          color: 'text-gray-700',
          icon: 'ℹ️',
          label: verdict,
          desktopBg: 'bg-gray-700',
          desktopText: 'text-white'
        };
    }
  };

  const config = getVerdictConfig();

  const handleCopy = () => {
    navigator.clipboard.writeText(`BeyondLabel Verdict: ${verdict}\n\n${why}\n\nAlternative: ${alternative || 'N/A'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BeyondLabel Verdict',
          text: `Check out this product analysis: ${verdict}\n${why}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div ref={cardRef} className="w-full mt-4 md:mt-8 animate-fade-in space-y-6">
      
      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP LAYOUT (>= 1024px) */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:block">
        {/* Top Header Banner */}
        <div className={`${config.desktopBg} ${config.desktopText} rounded-full py-6 px-10 flex items-center justify-between shadow-floating mb-8`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Final Analysis</p>
            <h2 className="text-4xl font-display font-extrabold uppercase tracking-wide">
              {config.label}
            </h2>
          </div>
          <div className="flex gap-3">
            {claims && claims.map((claim, idx) => (
              <div key={idx} className={`flex items-center gap-2 border rounded-pill px-4 py-2 backdrop-blur-sm ${
                claim.isPositive 
                  ? 'border-white/30 bg-white/10' 
                  : 'border-red-500/30 bg-red-500/10'
              }`}>
                {claim.isPositive ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                <span className="text-sm font-bold leading-tight">
                  {claim.text.split(' ').map((word, i, arr) => (
                    <React.Fragment key={i}>
                      {word}
                      {i === 0 && arr.length > 1 ? <br/> : i < arr.length - 1 ? ' ' : ''}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Left Column (Main Analysis) */}
          <div className="col-span-2 space-y-8">
            
            {/* Why Card */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-surface-variant">
              <h3 className="font-display font-bold text-3xl text-gray-900 mb-4">Why it matches your goals</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {goalNote || why}
              </p>
              
              {/* Nutrition Blocks Grid */}
              {nutrition_facts && (
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(nutrition_facts).map(([key, data]) => {
                    if (!data || !data.value) return null;
                    const isOptimal = data.status === 'Optimal' || data.status === 'Low';
                    const isHigh = data.status === 'High';
                    return (
                      <div key={key} className="bg-gray-50 rounded-3xl p-5 border border-surface-variant/50">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{key}</p>
                        <p className="font-display font-bold text-2xl text-gray-900 mb-2">{data.value}</p>
                        <p className={`text-xs font-bold flex items-center gap-1 ${isOptimal ? 'text-green-600' : isHigh ? 'text-red-600' : 'text-gray-500'}`}>
                          {isOptimal ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : isHigh ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          ) : (
                            <span className="w-3 h-0.5 bg-gray-400 rounded-full"></span>
                          )}
                          {data.status}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ingredient Breakdown */}
            {ingredients && ingredients.length > 0 && (
              <div>
              <div className="flex justify-between items-end mb-4 px-2">
                <h3 className="font-display font-bold text-2xl text-gray-900">Ingredient Breakdown</h3>
                <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                  View Full Glossary
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
              
              <div className="bg-white rounded-[32px] border border-surface-variant overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-surface-variant">
                    <tr>
                      <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Ingredient</th>
                      <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">Function</th>
                      <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Safety Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant">
                    {ingredients.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-1">
                          {ing.name}
                          {ing.safety_status === 'Caution' || ing.safety_status === 'Avoid' ? (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          ) : null}
                        </td>
                        <td className="py-4 px-6 text-gray-500 text-sm">{ing.function}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md ${
                            ing.safety_status === 'Optimal' ? 'bg-green-50 text-green-700' :
                            ing.safety_status === 'Caution' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {ing.safety_status === 'Optimal' ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : ing.safety_status === 'Caution' ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {ing.safety_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
            
          </div>

          {/* Right Column (Actions & Alternatives) */}
          <div className="space-y-8">
            
            {/* Actions Card */}
            <div className="bg-[#f2f4f1] rounded-[40px] p-6 space-y-4">
              <button 
                onClick={() => window.print()}
                className="w-full bg-[#002a1b] text-white py-3.5 rounded-pill font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Report
              </button>
              <button 
                onClick={handleShare}
                className="w-full bg-white text-gray-900 border border-surface-variant py-3.5 rounded-pill font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share Analysis
              </button>
              <div className="h-px w-full bg-gray-200 my-2"></div>
              <button disabled className="w-full text-[#006c49] py-2 font-bold flex items-center justify-center gap-2 opacity-70">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                Saved to History
              </button>
            </div>

            {/* Alternatives List */}
            {alternatives && alternatives.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">Even Better Alternatives</h3>
                <div className="space-y-4">
                  {alternatives.map((alt, idx) => (
                    <div key={idx} className="bg-white rounded-4xl p-4 border border-surface-variant shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-20 h-20 rounded-3xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-primary font-bold">
                        Alt #{idx+1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{alt.name}</h4>
                        <p className="text-xs text-[#006c49] font-medium leading-tight flex items-start gap-1">
                          <svg className="w-3 h-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {alt.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE LAYOUT (< 1024px) */}
      {/* ------------------------------------------------------------------ */}
      <div className="lg:hidden w-full max-w-xl mx-auto space-y-4">
        {/* Top Verdict Header Card */}
        <div className="bg-white rounded-4xl p-8 flex flex-col items-center text-center shadow-sm border border-surface-variant">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${config.bg} ${config.color}`}>
            <span className="text-3xl">{config.icon}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Verdict</p>
          <h2 className={`text-3xl font-display font-extrabold mb-3 ${config.color}`}>
            {config.label}
          </h2>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-sm">
            {why}
          </p>
        </div>

        {/* Alignment Analysis Section */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-surface-variant text-left">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="font-display font-bold text-lg text-gray-900">Alignment Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 text-[15px]">General Finding</h4>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{suggestion || "This product meets general health guidelines based on its label."}</p>
              </div>
            </div>
            
            {goalNote && (
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 text-[15px]">Goal Alignment</h4>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{goalNote}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Better Alternatives */}
        {alternatives && alternatives.length > 0 && (
          <div className="text-left mb-20">
            <h3 className="font-display font-bold text-lg text-gray-900 mb-1 ml-2">Better Alternatives</h3>
            <p className="text-sm text-gray-500 mb-4 ml-2">Products with cleaner ingredients.</p>
            
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar pl-2 pr-4 snap-x">
              {alternatives.map((alt, idx) => (
                <div key={idx} className="snap-start flex-none w-64 bg-white rounded-3xl overflow-hidden border border-surface-variant shadow-sm p-4">
                  <div className="h-32 bg-primary/10 rounded-2xl mb-3 flex items-center justify-center text-primary font-bold">
                    Alternative #{idx+1}
                  </div>
                  <span className="text-[10px] font-bold text-green-600 tracking-wider">{alt.score ? `${alt.score}/100 SCORE` : 'RECOMMENDED'}</span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1 mb-2 leading-tight line-clamp-1">{alt.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{alt.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-surface-variant p-4 flex gap-3 z-40 mb-16">
          <button 
            onClick={handleShare}
            className="flex-1 py-3.5 px-4 rounded-pill border-2 border-surface-variant text-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Share
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex-[2] py-3.5 px-4 rounded-pill bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Scan Next
          </button>
        </div>

        {copied && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold py-2 px-4 rounded-pill text-center shadow-lg z-50 animate-slide-down">
            ✅ Verdict copied to clipboard!
          </div>
        )}
      </div>

    </div>
  );
};

export default VerdictCard;
