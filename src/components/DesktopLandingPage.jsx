import React, { useState, useEffect } from 'react';
import { analyzeProduct } from '../services/geminiService';

const DEMO_PRODUCTS = [
  {
    name: 'Maggi 2-Minute Noodles',
    verdict: 'Moderate',
    score: 42,
    badgeText: 'Eat in Moderation',
    color: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-700',
      badgeBg: 'bg-amber-500',
      ring: 'ring-amber-400/30',
      glow: 'from-amber-400/20 to-orange-400/5'
    },
    nasties: ['Palm Oil', 'E635 Flavour Enhancer', 'High Refined Sodium'],
    suggestion: 'High in refined wheat flour and sodium. Best as an occasional treat.',
    alt: 'Millet Noodles'
  },
  {
    name: 'Greek Yogurt (Unsweetened)',
    verdict: 'Excellent',
    score: 94,
    badgeText: 'Great Choice!',
    color: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-600',
      ring: 'ring-emerald-400/30',
      glow: 'from-emerald-400/20 to-teal-400/5'
    },
    nasties: [],
    suggestion: '15g pure protein and live probiotics. Zero added sugar or gums.',
    alt: 'Top Recommendation'
  },
  {
    name: 'Bournvita Chocolate Drink',
    verdict: 'Avoid',
    score: 35,
    badgeText: 'Avoid',
    color: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-700',
      badgeBg: 'bg-red-600',
      ring: 'ring-red-400/30',
      glow: 'from-red-400/20 to-rose-400/5'
    },
    nasties: ['50% Added Sugar', 'Caramel Color E150c', 'Liquid Glucose'],
    suggestion: 'More sugar and artificial colorants than cocoa. High glycemic spike.',
    alt: '100% Raw Cacao Powder'
  }
];

const QUICK_SUGGESTIONS = [
  { label: '🍜 Maggi Noodles', query: 'Maggi 2-Minute Noodles' },
  { label: '🥤 Coca-Cola', query: 'Coca Cola Regular Soda' },
  { label: '🍫 Nutella', query: 'Nutella Hazelnut Spread' },
  { label: '🥣 Quaker Oats', query: 'Quaker Whole Grain Rolled Oats' }
];

const DesktopLandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);

  // Interactive phone demo state
  const [demoIndex, setDemoIndex] = useState(0);
  const [isDemoPaused, setIsDemoPaused] = useState(false);

  // Auto-cycle demo screen every 4 seconds unless hovered/clicked
  useEffect(() => {
    if (isDemoPaused) return;
    const interval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % DEMO_PRODUCTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isDemoPaused]);

  const handleSearch = async (e, customQuery = null) => {
    if (e) e.preventDefault();
    const query = customQuery || searchQuery;
    if (!query.trim()) return;

    if (customQuery) setSearchQuery(customQuery);

    setError(null);
    setVerdict(null);
    setIsLoading(true);
    setLoadingStatus('Analyzing...');

    try {
      const result = await analyzeProduct(query, 'General Health', (msg) => setLoadingStatus(msg));
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
      case 'Excellent': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: '🌟', label: 'Great Choice!' };
      case 'Good': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅', label: 'Good Choice' };
      case 'Moderate': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⚠️', label: 'Eat in Moderation' };
      case 'Poor': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: '👎', label: 'Think Twice' };
      case 'Avoid': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '❌', label: 'Avoid' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: 'ℹ️', label: v || 'Unknown' };
    }
  };

  const currentDemo = DEMO_PRODUCTS[demoIndex];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans overflow-x-hidden text-gray-900 selection:bg-emerald-500 selection:text-white">

      {/* ─── Nav ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1400px] mx-auto px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <span className="text-white text-sm font-black">B</span>
            </div>
            <span className="font-display text-[18px] font-bold text-gray-900 tracking-tight">BeyondLabel</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
              AI 2.0
            </span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#how-it-works" className="text-[14px] font-medium text-gray-600 hover:text-emerald-700 transition-colors">How it works</a>
            <a href="#features" className="text-[14px] font-medium text-gray-600 hover:text-emerald-700 transition-colors">Features</a>
            <div className="h-4 w-px bg-gray-200"></div>
            <a 
              href="https://beyondlabel.vercel.app" 
              className="text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 px-5 py-2.5 rounded-full shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Open App
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-16">
        {/* Animated Background Glowing Spheres */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none animate-blob animation-delay-4000"></div>

        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-10 w-full grid grid-cols-[1fr_auto] gap-12 items-center py-12">
          
          {/* Left — Copy & Interactive Search */}
          <div className="space-y-6 max-w-xl z-10">
            {/* Glowing AI Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-emerald-500/20 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-900 tracking-wider uppercase">Live AI Label Intelligence • Powered by Gemini</span>
            </div>

            <h1 className="font-display text-[clamp(2.4rem,3.8vw,4.2rem)] font-black leading-[1.08] tracking-[-0.03em] text-gray-900">
              Know what's{' '}
              <span className="relative inline-block bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                really
                {/* Underline flourish */}
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-emerald-400/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" strokeLinecap="round" />
                </svg>
              </span>{' '}
              in your food.
            </h1>

            <p className="text-[17px] text-gray-600 leading-[1.65] max-w-md font-normal">
              Point your camera at any ingredient list. Our AI decodes complex chemical additives, flags hidden sugars & nasties, and delivers instant health verdicts.
            </p>

            {/* Interactive Search Bar */}
            <div className="space-y-3 pt-1">
              <form onSubmit={(e) => handleSearch(e)} className="flex gap-2.5 max-w-md">
                <div className="relative flex-1 group">
                  <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type any food: Maggi, Nutella, Coke..."
                    className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-6 py-3.5 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {loadingStatus}
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Click Suggestion Pills */}
              <div className="flex items-center flex-wrap gap-1.5 pt-1">
                <span className="text-[12px] font-semibold text-gray-400 mr-1">Popular:</span>
                {QUICK_SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSearch(null, s.query)}
                    className="text-[12px] font-medium px-3 py-1 rounded-full bg-white/70 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200/80 hover:border-emerald-300 transition-all duration-200 shadow-2xs hover:scale-105"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-3 border-t border-gray-200/60">
              <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
                <span>100% free to use</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
                <span>No sign-up needed</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</span>
                <span>Works on any mobile</span>
              </div>
            </div>
          </div>

          {/* Right — Interactive Animated Phone Mockup */}
          <div 
            className="flex items-center justify-center relative pr-12 pt-4"
            onMouseEnter={() => setIsDemoPaused(true)}
            onMouseLeave={() => setIsDemoPaused(false)}
          >
            {/* Ambient Backlight Behind Phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent rounded-full blur-2xl transform scale-75 -z-10"></div>

            {/* Phone Body */}
            <div className="relative z-10">
              <div className="w-[230px] h-[460px] bg-[#0f172a] rounded-[2.4rem] p-2.5 shadow-[0_25px_80px_-15px_rgba(15,23,42,0.3)] ring-1 ring-white/20">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-[18px] bg-[#0f172a] rounded-full z-20 flex items-center justify-end px-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
                </div>

                {/* Interactive Screen */}
                <div className="w-full h-full bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] rounded-[2rem] overflow-hidden flex flex-col pt-7 pb-4 px-3 text-left relative transition-all duration-300">
                  
                  {/* Top Demo Bar */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live AI Scan</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Demo</span>
                  </div>

                  {/* Product Header */}
                  <div className="bg-white rounded-xl p-2.5 shadow-sm border border-gray-100 mb-2.5">
                    <p className="text-[11px] font-bold text-gray-900 truncate">{currentDemo.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${currentDemo.color.badgeBg}`}>
                        {currentDemo.badgeText}
                      </span>
                      <span className="text-[11px] font-black text-gray-700">Score: {currentDemo.score}/100</span>
                    </div>
                  </div>

                  {/* Hidden Nasties Box */}
                  {currentDemo.nasties.length > 0 ? (
                    <div className="bg-red-50/90 rounded-xl p-2 border border-red-100 mb-2">
                      <p className="text-[10px] font-bold text-red-800 flex items-center gap-1 mb-1">
                        <span>⚠️</span> Red Flags Detected:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {currentDemo.nasties.map((n, i) => (
                          <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/90 rounded-xl p-2 border border-emerald-100 mb-2">
                      <p className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                        <span>🌟</span> 100% Clean Label (No Nasties)
                      </p>
                    </div>
                  )}

                  {/* AI Suggestion */}
                  <div className="bg-white/80 rounded-xl p-2 border border-gray-100 text-[10px] text-gray-600 mb-2 leading-snug">
                    <span className="font-bold text-gray-800">AI Verdict: </span>
                    {currentDemo.suggestion}
                  </div>

                  {/* Better Alternative */}
                  <div className="mt-auto pt-2 border-t border-gray-200/50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Better Alternative</p>
                      <p className="text-[10px] font-bold text-emerald-700">{currentDemo.alt}</p>
                    </div>
                    <span className="text-xs">👉</span>
                  </div>

                  {/* Interactive Dot Selector */}
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    {DEMO_PRODUCTS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setDemoIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          demoIndex === idx ? 'w-5 bg-emerald-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                        }`}
                      ></button>
                    ))}
                  </div>

                </div>
              </div>

              {/* Floating Accent Cards (Animated & Alive) */}
              <div className="absolute -top-3 -left-16 bg-white/90 backdrop-blur-md shadow-lg shadow-emerald-900/5 rounded-2xl px-3 py-2 border border-emerald-500/20 animate-float z-20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-sm">🌟</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Health Score</p>
                    <p className="text-[12px] font-extrabold text-emerald-700">94 / 100 Clean</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 -right-14 bg-white/90 backdrop-blur-md shadow-lg shadow-red-900/5 rounded-2xl px-3 py-2 border border-red-500/20 animate-float-reverse z-20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-sm">⚠️</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Detected Flag</p>
                    <p className="text-[12px] font-extrabold text-red-700">Palm Oil Alert</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 -left-12 bg-white/90 backdrop-blur-md shadow-lg shadow-amber-900/5 rounded-2xl px-3 py-2 border border-amber-500/20 animate-float-fast z-20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-sm">🔥</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Healthy Streak</p>
                    <p className="text-[12px] font-extrabold text-gray-900">7 Days Clean</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Animated Marquee Feature Strip ─── */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 py-3.5 overflow-hidden border-y border-emerald-500/20 shadow-inner">
        <div className="animate-marquee flex items-center gap-8 text-white/80 font-medium text-[13px] whitespace-nowrap">
          <span className="flex items-center gap-2"><span className="text-emerald-400">⚡</span> 50,000+ Ingredients Analyzed</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-amber-400">⚠️</span> Hidden Palm Oil & Trans-Fat Alert</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-teal-400">🧬</span> Complex Chemical Additive Decoder</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">🍬</span> Hidden Added Sugar Calculator</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-lime-400">🥗</span> Keto, Vegan & Diabetic Goal Alignment</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">⚡</span> 50,000+ Ingredients Analyzed</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-amber-400">⚠️</span> Hidden Palm Oil & Trans-Fat Alert</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-teal-400">🧬</span> Complex Chemical Additive Decoder</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">🍬</span> Hidden Added Sugar Calculator</span>
          <span>•</span>
          <span className="flex items-center gap-2"><span className="text-lime-400">🥗</span> Keto, Vegan & Diabetic Goal Alignment</span>
        </div>
      </div>

      {/* ─── Search Verdict Result (Appears below hero when searched) ─── */}
      {(verdict || error) && (
        <section className="px-10 py-16 bg-white border-b border-gray-200/60">
          <div className="max-w-[1100px] mx-auto">
            {error && (
              <div className="max-w-xl bg-red-50 border border-red-200 rounded-2xl p-5 animate-slide-up">
                <p className="text-red-700 font-semibold text-[15px]">{error}</p>
              </div>
            )}
            {verdict && (() => {
              const vc = getVerdictConfig(verdict.verdict);
              return (
                <div className={`max-w-3xl ${vc.bg} border ${vc.border} rounded-3xl p-8 animate-slide-up shadow-lg`}>
                  <div className="flex items-start gap-5 mb-6">
                    <span className="text-4xl mt-1">{vc.icon}</span>
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">AI Verdict</p>
                      <h3 className={`font-display text-2xl font-black ${vc.text}`}>{vc.label}</h3>
                    </div>
                    {verdict.healthScore != null && (
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl border-2 ${vc.border} flex items-center justify-center bg-white shadow-xs`}>
                          <span className={`font-display font-black text-lg ${vc.text}`}>{verdict.healthScore}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 mt-1">Score</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[15px] text-gray-700 leading-relaxed mb-6">{verdict.why}</p>

                  {verdict.hiddenNasties && verdict.hiddenNasties.length > 0 && (
                    <div className="bg-red-100/70 rounded-2xl p-4 mb-5 border border-red-200">
                      <p className="text-[13px] font-bold text-red-900 mb-2 flex items-center gap-1.5">
                        <span>⚠️</span> Flagged Hidden Nasties
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {verdict.hiddenNasties.map((n, i) => (
                          <span key={i} className="bg-red-200/80 text-red-900 px-3 py-1 rounded-xl text-[13px] font-bold shadow-2xs">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {verdict.suggestion && (
                    <div className="bg-white/80 rounded-2xl p-4 border border-gray-200/80 shadow-2xs">
                      <p className="text-[13px] font-bold text-gray-600 mb-1">The Bottom Line</p>
                      <p className="text-[14px] text-gray-800">{verdict.suggestion}</p>
                    </div>
                  )}

                  {verdict.alternatives && verdict.alternatives.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-gray-200/60">
                      <p className="text-[13px] font-bold text-gray-600 mb-3">Better Healthier Alternatives</p>
                      <div className="grid grid-cols-3 gap-3">
                        {verdict.alternatives.map((alt, i) => (
                          <div key={i} className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-2xs">
                            <p className="font-bold text-gray-900 text-[14px] mb-0.5">{alt.name}</p>
                            <p className="text-[12px] text-gray-500 leading-snug">{alt.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ─── How It Works (Upgraded Glassmorphic Cards) ─── */}
      <section id="how-it-works" className="py-24 px-10 bg-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
              ⚡ Effortless 3-Step Flow
            </div>
            <h2 className="font-display text-[2.6rem] font-black text-gray-900 tracking-tight">
              From label scan to instant verdict.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { 
                num: '01', 
                badge: 'Instant Capture', 
                color: 'from-emerald-500 to-teal-600', 
                iconBg: 'bg-emerald-100 text-emerald-700', 
                icon: '📷',
                title: 'Scan any ingredient list', 
                desc: 'Point your phone camera at a nutrition label or type any brand name. No manual typing needed.' 
              },
              { 
                num: '02', 
                badge: 'AI Label Decoding', 
                color: 'from-teal-500 to-cyan-600', 
                iconBg: 'bg-teal-100 text-teal-700', 
                icon: '🧬',
                title: 'Gemini AI reads the truth', 
                desc: 'Cross-references 50,000+ chemical names, preservative codes, and misleading sugar claims in seconds.' 
              },
              { 
                num: '03', 
                badge: 'Clear Health Score', 
                color: 'from-green-500 to-emerald-600', 
                iconBg: 'bg-green-100 text-green-700', 
                icon: '🛡️',
                title: 'Get actionable alternatives', 
                desc: 'Receive a transparent 0-100 score, clear nasties alert, and healthier alternative recommendations.' 
              },
            ].map((step, i) => (
              <div 
                key={i} 
                className="bg-[#f8faf9] rounded-3xl p-8 border border-gray-200/80 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/5 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Top Gradient Accent Bar */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${step.color}`}></div>

                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center text-xl font-black shadow-2xs group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <span className="font-display text-2xl font-black text-gray-200 group-hover:text-emerald-500/30 transition-colors">
                    {step.num}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-3 inline-block border border-emerald-200/50">
                  {step.badge}
                </span>

                <h3 className="font-display font-bold text-xl text-gray-900 mb-2.5">{step.title}</h3>
                <p className="text-[14.5px] text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Features (Colorful & Interactive-Looking) ─── */}
      <section id="features" className="py-24 px-10 bg-[#f4f7f6]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
              🎯 Full Health Toolkit
            </div>
            <h2 className="font-display text-[2.6rem] font-black text-gray-900 tracking-tight">
              Designed to wow. Built to protect your health.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            
            {/* Bento 1: Hidden Nasties (Red/Amber Theme) */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 hover:border-red-400/40 hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🔬
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200/60">
                  Additive Decoder
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Hidden Nasties Detection</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                Flags controversial additives, emulsifiers, and artificial sweeteners that brands disguise behind obscure chemical numbers.
              </p>
              {/* Interactive Tag Preview */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {['E635 Enhancer', 'Palm Oil', 'HFCS-55', 'TBHQ Preservative', 'Aspartame'].map((item, idx) => (
                  <span key={idx} className="bg-red-50 text-red-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200/60 group-hover:bg-red-100 transition-colors">
                    ⚠️ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bento 2: Health Goals (Emerald/Green Theme) */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                  Custom AI Lens
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Personalized Health Goals</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                Whether you follow Keto, Vegan, Diabetic-Friendly, or Heart Health diets — get custom verdicts aligned with your nutritional lens.
              </p>
              {/* Interactive Tag Preview */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                {['💚 Heart Health', '🥑 Keto Friendly', '🌱 100% Vegan', '🩺 Diabetic Safe', '💪 High Protein'].map((item, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200/60 group-hover:bg-emerald-100 transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bento 3: Gamification (Gold/Amber Theme) */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                  Streak & Rewards
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Gamification & Healthy Streaks</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                Earn tiered badges, build consecutive clean-eating streaks, and watch your nutrition score grow on a personal dashboard.
              </p>
              {/* Interactive Badge Strip */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="text-sm">🔥</span>
                  <span className="text-xs font-bold text-amber-900">7 Day Clean Streak</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span className="text-sm">🛡️</span>
                  <span className="text-xs font-bold text-emerald-900">Health Advocate Badge</span>
                </div>
              </div>
            </div>

            {/* Bento 4: Social Sharing (Indigo/Purple Theme) */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-950/5 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📤
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
                  Viral Cards
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">One-Click Social Sharing</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                Generate gorgeous summary cards of your food scans to warn friends on WhatsApp, Instagram, or Twitter in a single tap.
              </p>
              {/* Mock Share Strip */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500">Share verdict to:</span>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/50">WhatsApp</span>
                  <span className="px-3 py-1 rounded-lg bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200/50">Instagram</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/50">Share Link</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CTA Footer (QR Code Layout) ─── */}
      <section className="py-20 px-10 bg-gradient-to-br from-emerald-900 via-emerald-950 to-gray-950 relative overflow-hidden text-white">
        {/* Floating background lighting */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-16 relative z-10">
          {/* Left — Text */}
          <div className="flex-1 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              📱 Try It On Your Mobile
            </span>
            <h2 className="font-display text-[2.6rem] font-black text-white mb-4 leading-tight tracking-tight">
              Ready to know what's<br />really in your food?
            </h2>
            <p className="text-white/70 text-[16px] leading-relaxed mb-6 font-normal">
              Scan the QR code with your phone camera to open BeyondLabel instantly. Get AI-powered label analysis, hidden nasties alerts, and healthier alternatives — no download required.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-white/60 text-[13px] font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">✓</span>
                Works instantly
              </div>
              <div className="flex items-center gap-2 text-white/60 text-[13px] font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">✓</span>
                Any mobile browser
              </div>
              <div className="flex items-center gap-2 text-white/60 text-[13px] font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">✓</span>
                No app store needed
              </div>
            </div>
          </div>

          {/* Right — QR Code */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="bg-white rounded-3xl p-5 shadow-[0_12px_50px_-10px_rgba(0,0,0,0.5)] border-4 border-white/10">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fbeyondlabel.vercel.app&color=00261b&bgcolor=ffffff&margin=0" 
                alt="Scan to open BeyondLabel"
                width="180"
                height="180"
                className="rounded-xl"
              />
            </div>
            <p className="text-emerald-300/80 text-[12px] font-bold mt-3.5 text-center flex items-center gap-1.5">
              <span>📷</span> Scan with your camera to start
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#090d0c] text-gray-400 py-8 px-10 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-black">
              B
            </div>
            <span className="text-[14px] font-bold text-white/70">BeyondLabel</span>
            <span className="text-[12px] text-gray-600">• AI Label Scanner</span>
          </div>
          <p className="text-[12px] text-gray-500">© {new Date().getFullYear()} BeyondLabel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DesktopLandingPage;
