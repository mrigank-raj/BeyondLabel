import React, { useState } from 'react';
import { analyzeProduct } from '../services/geminiService';

const DesktopLandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setError(null);
    setVerdict(null);
    setIsLoading(true);
    setLoadingStatus('Analyzing...');

    try {
      const result = await analyzeProduct(searchQuery, 'General Health', (msg) => setLoadingStatus(msg));
      setVerdict(result);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const getVerdictConfig = (v) => {
    switch (v) {
      case 'Excellent': return { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', icon: '🌟', label: 'Great Choice!' };
      case 'Good': return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-600', icon: '✅', label: 'Good Choice' };
      case 'Moderate': return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', icon: '⚠️', label: 'Eat in Moderation' };
      case 'Poor': return { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700', icon: '👎', label: 'Think Twice' };
      case 'Avoid': return { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', icon: '❌', label: 'Avoid' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-600', icon: 'ℹ️', label: v || 'Unknown' };
    }
  };

  const features = [
    { icon: '🔬', title: 'Hidden Nasties Detection', desc: 'AI identifies controversial additives, preservatives, and misleading "natural" claims that hide behind complex names.' },
    { icon: '🎯', title: 'Personalized Health Goals', desc: 'Set your lens — Weight Loss, Heart Health, Vegan, or Gluten-Free — and get tailored alignment scores.' },
    { icon: '🏆', title: 'Gamification & Badges', desc: 'Build streaks, earn tiered badges, and track your healthy-choice journey with visual progress.' },
    { icon: '📤', title: 'Share with Image Cards', desc: 'Generate beautiful verdict cards and share them directly to WhatsApp, Instagram, or any app.' },
  ];

  const steps = [
    { num: '01', icon: '📸', title: 'Scan the Label', desc: 'Point your camera at any product\'s ingredient list or nutrition panel.' },
    { num: '02', icon: '🧠', title: 'AI Analyzes', desc: 'Gemini Vision reads every ingredient and cross-references health databases in seconds.' },
    { num: '03', icon: '✅', title: 'Get Your Verdict', desc: 'Receive a clear verdict, health score, hidden nasties alert, and better alternatives.' },
  ];

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">

      {/* ─── Sticky Nav ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-variant/50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-primary tracking-tight">BeyondLabel</span>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">Features</a>
            <a href="#try-it" className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors">Try It</a>
            <a href="https://beyondlabel.vercel.app" className="bg-primary text-white px-5 py-2.5 rounded-pill text-sm font-bold hover:bg-primary-light transition-colors shadow-sm">
              Open App →
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="pt-32 pb-20 px-8 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-green-200/30 via-teal-100/20 to-emerald-100/30 rounded-full blur-3xl animate-gradient pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-20 text-5xl animate-float opacity-30 pointer-events-none">🥑</div>
        <div className="absolute bottom-20 left-40 text-4xl animate-float-reverse opacity-20 pointer-events-none">🔍</div>

        <div className="max-w-7xl mx-auto flex items-center gap-16 lg:gap-24">
          {/* Left Content */}
          <div className="flex-1 space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-surface-variant shadow-sm text-xs font-bold text-[#006c49] uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Powered by Gemini Vision AI
            </div>

            <h1 className="font-display text-6xl xl:text-7xl font-black tracking-tight leading-[1.1]">
              <span className="gradient-text">Know what</span>
              <br />
              <span className="text-gray-900">you eat.</span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Scan any product label with your phone camera to <strong className="text-gray-700">instantly reveal hidden nasties</strong>, get a health verdict, and discover better alternatives — in seconds.
            </p>

            {/* Desktop Search */}
            <div id="try-it" className="pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Try it now — search any product</p>
              <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
                <div className="relative flex-1">
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Maggi Noodles, Coca Cola, Bournvita..."
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-light active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {loadingStatus || 'Analyzing...'}
                    </>
                  ) : 'Analyze'}
                </button>
              </form>
            </div>
          </div>

          {/* Right — Phone Mockup Placeholder */}
          <div className="hidden xl:flex flex-shrink-0 items-center justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[300px] h-[620px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/20 border-[3px] border-gray-700">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10"></div>
                {/* Screen */}
                <div className="w-full h-full bg-background rounded-[2.4rem] overflow-hidden flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl mb-4">📱</div>
                  <p className="font-display font-bold text-gray-900 text-lg mb-2">App Demo</p>
                  <p className="text-sm text-gray-400">Video coming soon</p>
                  <div className="mt-6 w-16 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              {/* Floating badges around phone */}
              <div className="absolute -top-4 -left-12 bg-white shadow-lg rounded-2xl px-4 py-2 border border-surface-variant animate-float">
                <span className="text-sm font-bold text-green-600">✅ Safe</span>
              </div>
              <div className="absolute top-1/3 -right-16 bg-white shadow-lg rounded-2xl px-4 py-2 border border-surface-variant animate-float-reverse">
                <span className="text-sm font-bold text-red-600">⚠️ 3 Nasties</span>
              </div>
              <div className="absolute -bottom-4 -left-8 bg-white shadow-lg rounded-2xl px-4 py-2 border border-surface-variant animate-float-fast">
                <span className="text-sm font-bold text-amber-600">Score: 72</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Verdict Result */}
        {(verdict || error) && (
          <div className="max-w-7xl mx-auto mt-12">
            {error && (
              <div className="max-w-lg bg-red-50 border border-red-200 rounded-2xl p-5 animate-slide-up">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}
            {verdict && (() => {
              const vc = getVerdictConfig(verdict.verdict);
              return (
                <div className={`max-w-3xl ${vc.bg} border-2 ${vc.border} rounded-3xl p-8 animate-slide-up shadow-card`}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{vc.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verdict</p>
                      <h3 className={`font-display text-3xl font-black ${vc.text}`}>{vc.label}</h3>
                    </div>
                    {verdict.healthScore != null && (
                      <div className="ml-auto flex items-center justify-center w-16 h-16 rounded-full border-4 border-current opacity-80">
                        <span className={`font-display font-black text-xl ${vc.text}`}>{verdict.healthScore}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">{verdict.why}</p>

                  {verdict.hiddenNasties && verdict.hiddenNasties.length > 0 && (
                    <div className="bg-red-100/60 rounded-2xl p-4 mb-6">
                      <p className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Hidden Nasties
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {verdict.hiddenNasties.map((n, i) => (
                          <span key={i} className="bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm font-semibold">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {verdict.suggestion && (
                    <div className="bg-white/60 rounded-2xl p-4 border border-gray-200">
                      <p className="text-sm font-bold text-gray-500 mb-1">💡 The Bottom Line</p>
                      <p className="text-gray-700 text-sm">{verdict.suggestion}</p>
                    </div>
                  )}

                  {verdict.alternatives && verdict.alternatives.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-bold text-gray-500 mb-3">Better Alternatives</p>
                      <div className="flex gap-3 flex-wrap">
                        {verdict.alternatives.map((alt, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex-1 min-w-[180px]">
                            <p className="font-bold text-gray-900 text-sm">{alt.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{alt.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center gap-2 text-sm text-gray-400">
                    <span>📱</span>
                    <span>Want the full experience? Scan labels with your camera on the <a href="https://beyondlabel.vercel.app" className="text-primary font-bold hover:underline">mobile app</a>.</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 px-8 bg-white border-t border-surface-variant/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-display text-4xl font-black text-gray-900">Three steps. Zero guesswork.</h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent hidden lg:block"></div>
                )}
                <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{step.num}</span>
                <h3 className="font-display font-bold text-xl text-gray-900 mt-2 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="py-24 px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-display text-4xl font-black text-gray-900">Built for health-conscious people.</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-surface-variant shadow-sm hover:shadow-card transition-shadow group">
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Footer ─── */}
      <section className="py-24 px-8 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#003d2e] to-primary opacity-80 animate-gradient"></div>
        <div className="absolute top-10 right-20 text-6xl opacity-10 animate-float">🥑</div>
        <div className="absolute bottom-10 left-20 text-5xl opacity-10 animate-float-reverse">🔍</div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-5xl font-black mb-6 leading-tight">Ready to know what's really in your food?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">Open BeyondLabel on your phone to unlock camera scanning, personalized insights, and the full experience.</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://beyondlabel.vercel.app"
              className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Open on Phone →
            </a>
          </div>
          <p className="text-white/40 text-sm mt-6">Works on any mobile browser. No app store needed.</p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-display font-bold text-white/80">BeyondLabel</span>
          <p className="text-sm">© {new Date().getFullYear()} BeyondLabel. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default DesktopLandingPage;
