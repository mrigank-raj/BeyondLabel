import React, { useState, useEffect } from 'react';

const Icon = ({ name, className = '', fill = false }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: fill ? "'FILL' 1" : "'FILL' 0" }}
  >
    {name}
  </span>
);

const DesktopVerdictCard = ({ verdict }) => {
  const {
    verdict: vStr,
    healthScore,
    why,
    suggestion,
    hiddenNasties,
    ingredients,
    macros,
    alternatives
  } = verdict;

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (healthScore == null) return;
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= healthScore) {
        current = healthScore;
        clearInterval(timer);
      }
      setAnimatedScore(current);
    }, 20);
    return () => clearInterval(timer);
  }, [healthScore]);

  const getScoreColor = (s) => {
    if (s >= 71)
      return {
        stroke: 'text-secondary',
        label: 'text-secondary',
        border: 'border-secondary',
        bg: 'bg-secondary-fixed/30',
        accent: 'border-l-secondary'
      };
    if (s >= 51)
      return {
        stroke: 'text-primary-fixed-dim',
        label: 'text-primary-fixed-dim',
        border: 'border-primary-fixed-dim',
        bg: 'bg-primary-fixed/30',
        accent: 'border-l-primary-fixed-dim'
      };
    if (s >= 31)
      return {
        stroke: 'text-tertiary-fixed-dim',
        label: 'text-tertiary-fixed-dim',
        border: 'border-tertiary-fixed-dim',
        bg: 'bg-tertiary-fixed/30',
        accent: 'border-l-tertiary-fixed-dim'
      };
    return {
      stroke: 'text-error',
      label: 'text-error',
      border: 'border-error',
      bg: 'bg-error-container/40',
      accent: 'border-l-error'
    };
  };

  const sc = getScoreColor(healthScore || 0);

  const getVerdictLabel = (v) => {
    switch (v) {
      case 'Excellent':
        return 'Great Choice!';
      case 'Good':
        return 'Good Choice';
      case 'Moderate':
        return 'Eat in Moderation';
      case 'Poor':
        return 'Think Twice';
      case 'Avoid':
        return 'Avoid';
      default:
        return v || 'Unknown';
    }
  };

  // Helper to find function/severity of a flagged nasty from ingredients array
  const getNastyInfo = (nastyName) => {
    if (!ingredients || !Array.isArray(ingredients)) return null;
    return ingredients.find(
      (item) =>
        item.name?.toLowerCase().includes(nastyName.toLowerCase()) ||
        nastyName.toLowerCase().includes(item.name?.toLowerCase())
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_260px] gap-8 items-start animate-slide-up bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/30 shadow-xl">
      {/* Left Column: Animated Score Arc */}
      {healthScore != null && (
        <div className="flex flex-col items-center justify-center p-4 bg-surface rounded-2xl border border-outline-variant/20 w-full lg:w-44">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-variant/40"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="100, 100"
                strokeWidth="3.2"
              />
              <path
                className={`${sc.stroke} transition-all duration-[1500ms] ease-out`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${animatedScore}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold text-primary">{animatedScore}</span>
              <span className={`text-[10px] text-label-caps font-bold ${sc.label} uppercase tracking-widest mt-0.5`}>
                {healthScore >= 71
                  ? 'Excellent'
                  : healthScore >= 51
                  ? 'Good'
                  : healthScore >= 31
                  ? 'Moderate'
                  : 'Poor'}
              </span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs text-on-surface-variant font-medium">Health Rating</span>
          </div>
        </div>
      )}

      {/* Center Column: Verdict Details, Nasties, Macros, Alternatives */}
      <div className="flex flex-col gap-6 min-w-0">
        {/* Verdict Header & Why */}
        <div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${sc.border} border text-sm font-bold ${sc.label} mb-3 shadow-sm`}
          >
            <Icon name={healthScore >= 51 ? 'verified' : 'warning'} className="text-base" />
            {getVerdictLabel(vStr)}
          </div>
          <p className="text-body-lg text-on-surface leading-relaxed">{why}</p>
        </div>

        {/* Hidden Nasties Strip with Severity Cards */}
        {hiddenNasties && hiddenNasties.length > 0 && (
          <div className="bg-error-container/20 border border-error-container/60 rounded-2xl p-5">
            <p className="text-label-caps font-bold text-on-error-container uppercase tracking-wider mb-3 flex items-center gap-2">
              <Icon name="warning" className="text-error text-lg" />
              Hidden Nasties Flagged ({hiddenNasties.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hiddenNasties.map((n, i) => {
                const info = getNastyInfo(n);
                const isAvoid = info?.status === 'Avoid' || i === 0;
                return (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border-l-4 ${
                      isAvoid
                        ? 'bg-error-container/50 border-l-error border border-error/20'
                        : 'bg-surface-variant/40 border-l-amber-500 border border-outline-variant/30'
                    } flex flex-col justify-between`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-on-surface">{n}</span>
                      <span
                        className={`text-[10px] text-label-caps uppercase px-2 py-0.5 rounded-md font-semibold ${
                          isAvoid
                            ? 'bg-error text-white'
                            : 'bg-amber-500/20 text-amber-900 font-bold'
                        }`}
                      >
                        {info?.status || (isAvoid ? 'Avoid' : 'Caution')}
                      </span>
                    </div>
                    {info?.function && (
                      <span className="text-xs text-on-surface-variant mt-1.5 font-medium">
                        Function: {info.function}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* The Bottom Line (Suggestion Callout) */}
        {suggestion && (
          <div className={`bg-surface-container-low border-l-4 ${sc.accent} border border-outline-variant/30 rounded-2xl p-5`}>
            <p className="text-label-caps font-bold text-outline uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Icon name="tips_and_updates" className="text-base text-secondary" />
              The Bottom Line
            </p>
            <p className="text-body-md text-on-surface font-medium">{suggestion}</p>
          </div>
        )}

        {/* Macro Breakdown Bar Chart */}
        {macros && (
          <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20">
            <p className="text-label-caps font-bold text-outline uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Icon name="bar_chart" className="text-base text-secondary" />
              Nutritional Balance & Macros
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {Object.entries(macros)
                .filter(([_, v]) => v)
                .map(([key, m]) => {
                  const barColor =
                    m.status === 'Optimal'
                      ? 'bg-secondary'
                      : m.status === 'Moderate'
                      ? 'bg-amber-500'
                      : 'bg-error';
                  const barWidth =
                    m.status === 'Optimal'
                      ? '45%'
                      : m.status === 'Moderate'
                      ? '70%'
                      : '92%';
                  return (
                    <div key={key} className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider capitalize">
                          {key}
                        </span>
                        <span className="text-xs font-bold text-on-surface">{m.value}</span>
                      </div>
                      <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: barWidth }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/70 mt-1 uppercase font-medium">
                        {m.status || 'Moderate'}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Healthier Alternatives Grid */}
        {alternatives && alternatives.length > 0 && (
          <div className="pt-2">
            <p className="text-label-caps font-bold text-outline uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Icon name="thumb_up" className="text-base text-secondary" />
              Better Alternatives
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {alternatives.slice(0, 3).map((alt, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between hover:border-secondary/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <p className="font-bold text-sm text-on-surface truncate">{alt.name}</p>
                      {alt.score && (
                        <span className="text-xs font-bold text-secondary bg-secondary-fixed/40 px-2 py-0.5 rounded-full flex-shrink-0">
                          {alt.score}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant leading-snug line-clamp-2">
                      {alt.reason}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-secondary font-semibold">
                    <span>Clean choice</span>
                    <Icon name="arrow_forward" className="text-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Mobile Conversion CTA Card */}
      <div className="w-full lg:w-64 flex-shrink-0 glass-card rounded-2xl p-6 border border-secondary/30 bg-gradient-to-b from-surface-container-lowest to-secondary-fixed/10 text-center shadow-lg relative group">
        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="phone_iphone" className="text-secondary text-2xl" />
        </div>
        <h4 className="font-display text-base font-bold text-primary mb-1">
          This is just a preview.
        </h4>
        <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
          On mobile, scan labels instantly with your phone camera, track your daily streak, and share verdicts with friends.
        </p>
        <div className="bg-white rounded-2xl p-3.5 mb-3 shadow-md border border-outline-variant/30 mx-auto w-fit">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https%3A%2F%2Fbeyondlabel.vercel.app%3Futm_source%3Ddesktop%26utm_medium%3Dqr&color=00261b&bgcolor=ffffff&margin=0"
            alt="Scan to open on phone"
            width="140"
            height="140"
            className="rounded-lg mx-auto"
          />
        </div>
        <p className="text-[10px] text-label-caps font-bold text-secondary uppercase tracking-widest">
          Scan to open on phone
        </p>
      </div>
    </div>
  );
};

export default DesktopVerdictCard;
