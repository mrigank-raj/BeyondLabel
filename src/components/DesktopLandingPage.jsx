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
      case 'Excellent': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: '🌟', label: 'Great Choice!' };
      case 'Good': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅', label: 'Good Choice' };
      case 'Moderate': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⚠️', label: 'Eat in Moderation' };
      case 'Poor': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: '👎', label: 'Think Twice' };
      case 'Avoid': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '❌', label: 'Avoid' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: 'ℹ️', label: v || 'Unknown' };
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] font-sans overflow-x-hidden">

      {/* ─── Nav ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-black/[0.04]">
        <div className="max-w-[1400px] mx-auto px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-black">B</span>
            </div>
            <span className="font-display text-[17px] font-bold text-gray-900 tracking-tight">BeyondLabel</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#how-it-works" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <div className="h-4 w-px bg-gray-200"></div>
            <a href="https://beyondlabel.vercel.app" className="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
              Open App
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="h-screen flex items-center relative overflow-hidden">
        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'}}></div>
        
        {/* Soft ambient light */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-bl from-emerald-50/80 via-teal-50/30 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-100/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-10 w-full grid grid-cols-[1fr_auto] gap-12 items-center">
          
          {/* Left — Copy */}
          <div className="space-y-5 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary/40"></div>
              <span className="text-[11px] font-semibold text-primary/70 uppercase tracking-[0.2em]">AI-Powered Label Intelligence</span>
            </div>

            <h1 className="font-display text-[clamp(2.2rem,3.5vw,3.8rem)] font-black leading-[1.08] tracking-[-0.03em] text-gray-900">
              Know what's
              <br />
              <span className="text-primary">really</span> in
              <br />
              your food.
            </h1>

            <p className="text-[15px] text-gray-500 leading-[1.65] max-w-md">
              Point your phone camera at any product label. Our AI reads every ingredient, flags hidden nasties, and tells you if it's actually worth eating.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2.5 max-w-md">
              <div className="relative flex-1">
                <svg className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try &quot;Maggi Noodles&quot; or &quot;Coca Cola&quot;"
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/[0.06] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-primary text-white px-5 py-3 rounded-xl font-semibold text-[14px] hover:bg-primary-light active:scale-[0.98] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {loadingStatus}
                  </>
                ) : 'Analyze'}
              </button>
            </form>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-[13px] text-gray-400">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span>100% free</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-400">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span>No sign-up needed</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-400">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                <span>Works on any phone</span>
              </div>
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="flex items-center justify-center relative pr-16 pt-6">
            {/* Phone */}
            <div className="relative z-10">
              <div className="w-[220px] h-[440px] bg-[#1a1a1a] rounded-[2.2rem] p-2 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.25)] ring-1 ring-white/10">
                {/* Dynamic Island */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-[18px] bg-[#1a1a1a] rounded-full z-20"></div>
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-b from-[#f7f9fb] to-[#eef1ee] rounded-[1.8rem] overflow-hidden flex flex-col items-center justify-center text-center relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="font-display font-bold text-gray-900 text-sm mb-1">App Preview</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">Video demo<br />coming soon</p>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-2 -left-16 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] rounded-2xl px-3 py-2.5 border border-black/[0.04] animate-float">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Verdict</p>
                    <p className="text-[12px] font-bold text-emerald-700">Great Choice</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 -right-14 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] rounded-2xl px-3 py-2.5 border border-black/[0.04] animate-float-reverse">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Hidden</p>
                    <p className="text-[12px] font-bold text-red-700">3 Nasties</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 -left-12 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] rounded-2xl px-3 py-2.5 border border-black/[0.04] animate-float-fast">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-sm">🏆</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Health Score</p>
                    <p className="text-[12px] font-bold text-gray-900">82 / 100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Verdict Result (appears below hero when searched) ─── */}
      {(verdict || error) && (
        <section className="px-10 pb-20 -mt-20">
          <div className="max-w-[1400px] mx-auto">
            {error && (
              <div className="max-w-xl bg-red-50 border border-red-200 rounded-2xl p-5 animate-slide-up">
                <p className="text-red-700 font-semibold text-[15px]">{error}</p>
              </div>
            )}
            {verdict && (() => {
              const vc = getVerdictConfig(verdict.verdict);
              return (
                <div className={`max-w-3xl ${vc.bg} border ${vc.border} rounded-3xl p-8 animate-slide-up shadow-sm`}>
                  <div className="flex items-start gap-5 mb-6">
                    <span className="text-4xl mt-1">{vc.icon}</span>
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">Verdict</p>
                      <h3 className={`font-display text-2xl font-black ${vc.text}`}>{vc.label}</h3>
                    </div>
                    {verdict.healthScore != null && (
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl border-2 ${vc.border} flex items-center justify-center`}>
                          <span className={`font-display font-black text-lg ${vc.text}`}>{verdict.healthScore}</span>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 mt-1">Score</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[15px] text-gray-600 leading-relaxed mb-6">{verdict.why}</p>

                  {verdict.hiddenNasties && verdict.hiddenNasties.length > 0 && (
                    <div className="bg-red-100/50 rounded-xl p-4 mb-5">
                      <p className="text-[13px] font-bold text-red-800 mb-2">⚠️ Hidden Nasties</p>
                      <div className="flex flex-wrap gap-1.5">
                        {verdict.hiddenNasties.map((n, i) => (
                          <span key={i} className="bg-red-200/60 text-red-800 px-2.5 py-1 rounded-lg text-[13px] font-medium">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {verdict.suggestion && (
                    <div className="bg-white/50 rounded-xl p-4 border border-black/[0.04]">
                      <p className="text-[13px] font-semibold text-gray-500 mb-1">The Bottom Line</p>
                      <p className="text-[14px] text-gray-700">{verdict.suggestion}</p>
                    </div>
                  )}

                  {verdict.alternatives && verdict.alternatives.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-black/[0.06]">
                      <p className="text-[13px] font-semibold text-gray-500 mb-3">Better Alternatives</p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {verdict.alternatives.map((alt, i) => (
                          <div key={i} className="bg-white/60 rounded-xl p-3 border border-black/[0.04]">
                            <p className="font-semibold text-gray-900 text-[14px] mb-0.5">{alt.name}</p>
                            <p className="text-[12px] text-gray-500 leading-snug">{alt.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="mt-5 pt-4 border-t border-black/[0.06] text-[13px] text-gray-400 flex items-center gap-2">
                    📱 Want the full experience? <a href="https://beyondlabel.vercel.app" className="text-primary font-semibold hover:underline">Open on your phone</a> to scan labels with your camera.
                  </p>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-28 px-10 bg-white border-t border-black/[0.04]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-primary/30"></div>
              <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.2em]">How It Works</span>
              <div className="h-px w-8 bg-primary/30"></div>
            </div>
            <h2 className="font-display text-[2.5rem] font-black text-gray-900 tracking-tight">Three steps. Zero guesswork.</h2>
          </div>

          <div className="grid grid-cols-3 gap-0">
            {[
              { num: '01', icon: (<svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>), title: 'Scan the label', desc: 'Point your camera at any ingredient list or nutrition panel.' },
              { num: '02', icon: (<svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>), title: 'AI analyzes', desc: 'Gemini Vision reads every ingredient and cross-references health data.' },
              { num: '03', icon: (<svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>), title: 'Get your verdict', desc: 'Clear health score, hidden nasties alert, and better alternatives.' },
            ].map((step, i) => (
              <div key={i} className="text-center px-10 relative">
                {i < 2 && (
                  <div className="absolute top-10 right-0 w-px h-16 bg-gray-200"></div>
                )}
                <div className="w-20 h-20 rounded-3xl bg-primary/[0.04] flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <p className="text-[11px] font-bold text-primary/30 uppercase tracking-widest mb-3">{step.num}</p>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-28 px-10 bg-[#fafbfa]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-primary/30"></div>
              <span className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.2em]">Features</span>
              <div className="h-px w-8 bg-primary/30"></div>
            </div>
            <h2 className="font-display text-[2.5rem] font-black text-gray-900 tracking-tight">Everything you need to eat smarter.</h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: '🔬', title: 'Hidden Nasties Detection', desc: 'Flags controversial additives, preservatives, and misleading "natural" claims that hide behind chemical names.' },
              { icon: '🎯', title: 'Personalized Health Goals', desc: 'Set your lens — Weight Loss, Heart Health, Keto, Vegan — and get alignment scores tailored to you.' },
              { icon: '🏆', title: 'Gamification & Streaks', desc: 'Earn tiered badges, build healthy-choice streaks, and track your progress with visual dashboards.' },
              { icon: '📤', title: 'Social Sharing', desc: 'Generate stunning verdict cards and share directly to WhatsApp, Instagram, or any app on your phone.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-black/[0.04] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] transition-shadow duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/[0.04] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <span className="text-xl">{f.icon}</span>
                </div>
                <h3 className="font-display font-bold text-[17px] text-gray-900 mb-2">{f.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-10 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] pointer-events-none"></div>
        
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-16 relative z-10">
          {/* Left — Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="font-display text-[2.5rem] font-black text-white mb-4 leading-tight tracking-tight">
              Ready to know what's<br />really in your food?
            </h2>
            <p className="text-white/50 text-[16px] leading-relaxed mb-6">
              Scan the QR code with your phone camera to open BeyondLabel instantly. Get AI-powered label analysis, hidden nasties alerts, and healthier alternatives — no download required.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/30 text-[13px]">
                <svg className="w-4 h-4 text-emerald-400/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Works instantly
              </div>
              <div className="flex items-center gap-2 text-white/30 text-[13px]">
                <svg className="w-4 h-4 text-emerald-400/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Any mobile browser
              </div>
              <div className="flex items-center gap-2 text-white/30 text-[13px]">
                <svg className="w-4 h-4 text-emerald-400/60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                No app store
              </div>
            </div>
          </div>

          {/* Right — QR Code */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="bg-white rounded-3xl p-5 shadow-[0_8px_40px_-10px_rgba(0,0,0,0.3)]">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fbeyondlabel.vercel.app&color=00261b&bgcolor=ffffff&margin=0" 
                alt="Scan to open BeyondLabel"
                width="180"
                height="180"
                className="rounded-xl"
              />
            </div>
            <p className="text-white/25 text-[11px] font-medium mt-3 text-center">Scan with your phone camera</p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#0a0a0a] text-gray-500 py-6 px-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
              <span className="text-white/60 text-[9px] font-black">B</span>
            </div>
            <span className="text-[13px] font-medium text-white/40">BeyondLabel</span>
          </div>
          <p className="text-[12px] text-gray-600">© {new Date().getFullYear()} BeyondLabel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DesktopLandingPage;
