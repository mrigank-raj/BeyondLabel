import React, { useState, useRef, useEffect } from 'react';

const VerdictCard = ({ verdictData }) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Scroll into view when verdict appears
  useEffect(() => {
    if (verdictData && cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [verdictData]);

  if (!verdictData) return null;

  const { verdict, why, alternative, goalNote, suggestion } = verdictData;

  const styleConfig = {
    'Trustworthy': {
      color: 'text-verdict-trust',
      bg: 'bg-verdict-trust-bg',
      border: 'border-verdict-trust',
      icon: '✅',
      label: 'Trustworthy',
      accentGradient: 'from-green-400 to-emerald-600',
    },
    'Question It': {
      color: 'text-verdict-question',
      bg: 'bg-verdict-question-bg',
      border: 'border-verdict-question',
      icon: '⚠️',
      label: 'Question It',
      accentGradient: 'from-amber-400 to-orange-500',
    },
    'Avoid': {
      color: 'text-verdict-avoid',
      bg: 'bg-verdict-avoid-bg',
      border: 'border-verdict-avoid',
      icon: '❌',
      label: 'Avoid',
      accentGradient: 'from-red-400 to-rose-600',
    },
    'Insufficient Data': {
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      icon: '❓',
      label: 'Insufficient Data',
      accentGradient: 'from-gray-400 to-gray-500',
    }
  };

  const config = styleConfig[verdict] || styleConfig['Insufficient Data'];

  const buildShareText = () => {
    let text = `🏷️ BeyondLabel Verdict: ${config.icon} ${verdict}\n\n`;
    text += `Why: ${why}\n`;
    if (alternative) text += `\nBetter Alternative: ${alternative}\n`;
    if (goalNote) text += `\nGoal Note: ${goalNote}\n`;
    if (suggestion) text += `\nSuggestion: ${suggestion}\n`;
    text += `\n— Analyzed by BeyondLabel`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = buildShareText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BeyondLabel: ${verdict}`,
          text: buildShareText(),
        });
      } catch {
        // User cancelled share dialog — no-op
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      ref={cardRef}
      className="w-full max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow-verdict border-l-[6px] overflow-hidden animate-slide-up"
      style={{ borderLeftColor: config.border === 'border-verdict-trust' ? '#16A34A' : config.border === 'border-verdict-question' ? '#D97706' : config.border === 'border-verdict-avoid' ? '#DC2626' : '#9CA3AF' }}
    >
      {/* Header */}
      <div className={`${config.bg} px-6 py-4 flex items-center justify-between border-b border-gray-100`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.icon}</span>
          <h2 className={`text-xl md:text-2xl font-extrabold uppercase tracking-wide ${config.color}`}>
            {config.label}
          </h2>
        </div>
        {/* Share / Copy actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/60 hover:bg-white text-gray-500 hover:text-gray-700 transition-colors"
            title="Copy verdict"
          >
            {copied ? (
              <svg className="w-4.5 h-4.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white/60 hover:bg-white text-gray-500 hover:text-gray-700 transition-colors"
            title="Share verdict"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6 space-y-5 text-left">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Why</h3>
          <p className="text-gray-800 leading-relaxed font-medium text-[15px]">
            {why}
          </p>
        </div>

        {alternative && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Better Alternative</h3>
            <div className="flex items-start gap-3 bg-green-50/60 p-4 rounded-xl border border-green-100">
              <span className="text-lg mt-0.5">💡</span>
              <p className="text-gray-800 text-[15px] leading-relaxed">
                {alternative}
              </p>
            </div>
          </div>
        )}

        {goalNote && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">For Your Goal</h3>
            <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-xl border border-green-100">
              <span className="text-lg mt-0.5">🎯</span>
              <p className="text-primary text-[15px] leading-relaxed font-medium">
                {goalNote}
              </p>
            </div>
          </div>
        )}

        {suggestion && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Suggestion</h3>
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-lg mt-0.5">📋</span>
              <p className="text-gray-700 text-[15px] leading-relaxed">
                {suggestion}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="px-6 pb-4 animate-slide-up">
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold py-2 px-3 rounded-lg text-center">
            ✅ Verdict copied to clipboard!
          </div>
        </div>
      )}
    </div>
  );
};

export default VerdictCard;
