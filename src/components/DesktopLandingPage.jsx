import React, { useState, useEffect, useRef } from 'react';
import { analyzeProduct } from '../services/geminiService';

/* ─── Material Symbols helper ─── */
const Icon = ({ name, fill, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

/* ─── Quick suggestion chips ─── */
const TRENDING = ['Maltodextrin', 'E635', 'Palm Oil'];

const DesktopLandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);

  /* ─── Feature animation state ─── */
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [activeGoal, setActiveGoal] = useState(0);
  const [scoreCount, setScoreCount] = useState(0);
  const featuresRef = useRef(null);
  const scoreTarget = 82;

  /* ── Intersection Observer for feature reveals ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFeaturesVisible(true); },
      { threshold: 0.15 }
    );
    if (featuresRef.current) observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Animated score counter ── */
  useEffect(() => {
    if (!featuresVisible) return;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setScoreCount(current);
      if (current >= scoreTarget) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [featuresVisible]);

  /* ── Cycle goal chips ── */
  useEffect(() => {
    if (!featuresVisible) return;
    const timer = setInterval(() => setActiveGoal(p => (p + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, [featuresVisible]);

  /* ─── Search handler ─── */
  const handleSearch = async (e, customQuery = null) => {
    if (e) e.preventDefault();
    const query = customQuery || searchQuery;
    if (!query.trim()) return;
    if (customQuery) setSearchQuery(customQuery);

    setError(null); setVerdict(null); setIsLoading(true);
    setLoadingStatus('Analyzing...');

    try {
      const result = await analyzeProduct(query, 'General Health', (msg) => setLoadingStatus(msg));
      setVerdict(result);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false); setLoadingStatus('');
    }
  };

  const goals = ['General Health', 'Fat Loss', 'Diabetes', 'Muscle Gain'];

  return (
    <div className="min-h-screen bg-background text-on-background font-sans antialiased overflow-x-hidden selection:bg-secondary/20 selection:text-secondary">

      {/* ═══ 1. Navigation ═══ */}
      <nav className="fixed top-0 w-full z-50 glass-card h-20 px-5 md:px-10 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <Icon name="eco" fill className="text-secondary text-3xl" />
          <span className="font-display text-headline-md text-primary tracking-tighter hidden sm:block">BeyondLabel</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-label-caps uppercase tracking-widest">
          <a href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors">How it works</a>
          <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors">Features</a>
          <a href="#cta" className="text-on-surface-variant hover:text-primary transition-colors">Try it</a>
        </div>
        <a
          href="https://beyondlabel.vercel.app"
          className="bg-secondary text-white text-label-caps uppercase tracking-widest px-6 py-3 rounded-full hover:bg-on-secondary-fixed-variant transition-colors flex items-center gap-2 shadow-sm"
        >
          Open App <Icon name="arrow_forward" className="text-sm" />
        </a>
      </nav>

      {/* ═══ 2. Hero Section ═══ */}
      <section className="min-h-screen mesh-bg pt-32 pb-24 px-5 md:px-10 relative overflow-hidden flex items-center">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-3xl mix-blend-multiply"></div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          {/* Left — Copy */}
          <div className="flex flex-col gap-6 max-w-xl z-20">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/50 px-4 py-2 rounded-full self-start shadow-sm animate-pulse-ring">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-label-caps uppercase tracking-widest text-secondary">Live · AI-Powered Food Intelligence</span>
            </div>

            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary tracking-tight">
              Know what's <br />
              <span className="gradient-text">really</span> in your food
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-md">
              Instantly decode complex ingredient lists. Uncover hidden sugars, harmful additives, and discover cleaner alternatives with our AI-driven scanning engine.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={(e) => handleSearch(e)}
              className="glass-card rounded-2xl p-2 flex items-center shadow-lg w-full max-w-lg mt-2 group focus-within:ring-2 focus-within:ring-secondary/50 transition-all"
            >
              <Icon name="search" className="text-outline ml-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any food or ingredient..."
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-body-md text-on-surface placeholder:text-outline-variant px-4 py-3"
              />
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-primary text-white rounded-xl px-6 py-3 text-label-caps uppercase tracking-widest hover:bg-surface-tint transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>{loadingStatus}</>
                ) : 'Analyze'}
              </button>
            </form>

            {/* Trending Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="text-label-caps text-outline-variant mr-2 flex items-center">Trending:</span>
              {TRENDING.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(null, item)}
                  className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-medium text-on-surface-variant cursor-pointer hover:bg-secondary/10 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="relative w-full h-[550px] flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-primary-fixed/20 rounded-full blur-3xl opacity-50"></div>

            {/* Phone Frame */}
            <div className="relative z-10 w-[280px] h-[560px] bg-white rounded-[40px] shadow-2xl border-[8px] border-surface-container-highest overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
                <div className="w-32 h-6 bg-surface-container-highest rounded-b-2xl"></div>
              </div>
              {/* Screen Content */}
              <div className="flex-1 bg-surface flex flex-col relative">
                {/* Product Image */}
                <div
                  className="h-44 relative overflow-hidden bg-gradient-to-b from-surface-container-high to-surface"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHN_V9W8eWEkgEn8Zr8SkqKUebg3UcO0t7JJ3bWTegaE4kEgJZ10Dc7q7vC1IpCu0ZJrEIE9Z1wesq1xTNVI3savJGnYeNZJTB1enrcMbOCgeKjbctIQ_N87MOPdFAUksMcvAxCbqrSRfLxI5EGPYj4z6rAwzUg-sTzei7bgnzfB1TewxTWfmPiGMWcPp2WtVrxvaLqagbA6A-08aNqJwwo7iBSg-u-y47k2Vz6LKn2Qa7gg6kcSujSg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface"></div>
                </div>

                {/* Score Card */}
                <div className="absolute top-32 inset-x-4 glass-card rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-error flex items-center justify-center bg-white shadow-sm">
                    <span className="font-display text-lg text-error font-extrabold">42</span>
                  </div>
                  <div>
                    <h3 className="text-label-caps text-on-surface uppercase tracking-wider">Poor Nutritional Profile</h3>
                    <p className="text-xs text-on-surface-variant mt-1">High processing detected</p>
                  </div>
                </div>

                {/* Insight Cards */}
                <div className="mt-16 px-4 flex flex-col gap-3 pb-6">
                  <div className="bg-error-container/30 border border-error-container p-3 rounded-xl flex items-start gap-3">
                    <Icon name="warning" className="text-error text-lg mt-0.5" />
                    <div>
                      <span className="font-bold text-sm text-on-error-container">Red Flag: E635</span>
                      <p className="text-xs text-on-surface-variant mt-0.5">Flavor enhancer linked to mild reactions.</p>
                    </div>
                  </div>
                  <div className="bg-secondary-container/20 border border-secondary-container p-3 rounded-xl flex items-start gap-3">
                    <Icon name="verified" className="text-secondary text-lg mt-0.5" />
                    <div>
                      <span className="font-bold text-sm text-on-secondary-container">Green Alternative</span>
                      <p className="text-xs text-on-surface-variant mt-0.5">Try 'Nature's Path Bar' instead. Score: 88.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute top-16 right-0 glass-card rounded-xl p-3 shadow-lg flex items-center gap-3 float-anim z-20 w-44">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <Icon name="science" className="text-secondary text-sm" />
              </div>
              <div>
                <div className="text-[10px] text-label-caps text-outline uppercase">Additives</div>
                <div className="text-sm font-bold text-on-surface">3 Detected</div>
              </div>
            </div>

            <div className="absolute bottom-24 -left-8 glass-card rounded-xl p-3 shadow-lg flex items-center gap-3 float-anim z-20 w-44" style={{ animationDelay: '-3s' }}>
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center">
                <Icon name="monitor_heart" className="text-tertiary-container text-sm" />
              </div>
              <div>
                <div className="text-[10px] text-label-caps text-outline uppercase">Sugar Spike</div>
                <div className="text-sm font-bold text-on-surface">High Risk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Verdict Result (Appears after search) ═══ */}
      {(verdict || error) && (
        <section className="px-5 md:px-10 py-16 bg-surface-container-lowest border-b border-outline-variant/30">
          <div className="max-w-[1200px] mx-auto">
            {error && (
              <div className="max-w-xl bg-error-container/30 border border-error-container rounded-2xl p-5 animate-slide-up">
                <p className="text-on-error-container font-semibold text-body-md">{error}</p>
              </div>
            )}
            {verdict && <DesktopVerdictCard verdict={verdict} />}
          </div>
        </section>
      )}

      {/* ═══ 3. Trust Ticker Strip ═══ */}
      <div className="bg-primary py-4 border-y border-outline/20 overflow-hidden">
        <div className="ticker-wrap flex">
          <div className="ticker flex w-max items-center gap-12 px-6 flex-nowrap">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex items-center gap-12 text-label-caps text-surface-variant/80 whitespace-nowrap uppercase tracking-widest flex-nowrap flex-shrink-0">
                <span className="flex items-center gap-2"><Icon name="database" className="text-secondary" /> 50,000+ Ingredients Analyzed</span>
                <span>•</span>
                <span className="flex items-center gap-2"><Icon name="verified_user" className="text-secondary" /> 1M+ Scans This Month</span>
                <span>•</span>
                <span className="flex items-center gap-2"><Icon name="shield" className="text-secondary" /> Clinically Backed Data</span>
                <span>•</span>
                <span className="flex items-center gap-2"><Icon name="auto_awesome" className="text-secondary" /> AI-Driven Insights</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 4. How It Works ═══ */}
      <section id="how-it-works" className="py-section-py px-5 md:px-10 bg-surface relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-display-lg text-primary mb-4 tracking-tight">How it works</h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">From shelf to healthy choice in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { icon: 'barcode_scanner', title: 'Scan Label', desc: 'Simply scan any food label or ingredient list with your smartphone camera.', bg: 'bg-primary-fixed/30', hoverBg: 'group-hover:bg-primary-fixed' },
              { icon: 'troubleshoot', title: 'AI Analysis', desc: 'Our engine instantly cross-references ingredients against clinical databases.', bg: 'bg-secondary-fixed/30', hoverBg: 'group-hover:bg-secondary-fixed' },
              { icon: 'shopping_cart_checkout', title: 'Shop Smart', desc: 'Get a clear health score and immediate recommendations for better alternatives.', bg: 'bg-tertiary-fixed/30', hoverBg: 'group-hover:bg-tertiary-fixed' },
            ].map((step, i) => (
              <div key={i} className="glass-card rounded-[2rem] p-8 text-center relative group hover:scale-[1.02] transition-transform duration-300">
                <div className={`w-20 h-20 mx-auto ${step.bg} ${step.hoverBg} rounded-2xl flex items-center justify-center mb-6 transition-colors`}>
                  <Icon name={step.icon} className={`text-4xl ${i === 0 ? 'text-primary' : i === 1 ? 'text-secondary' : 'text-tertiary-container'}`} />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-surface text-secondary font-display text-headline-md rounded-full flex items-center justify-center shadow-sm border border-outline-variant/30">
                  {i + 1}
                </div>
                <h3 className="font-display text-headline-md text-primary mb-3">{step.title}</h3>
                <p className="text-body-md text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. Features Bento Grid ═══ */}
      <section
        id="features"
        ref={featuresRef}
        className="py-section-py px-5 md:px-10 bg-surface-container-low relative"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <h2 className="font-display text-display-lg text-primary mb-4 tracking-tight">Intelligence at your fingertips</h2>
            <p className="text-body-lg text-on-surface-variant max-w-xl">Everything you need to make informed choices, packed into one powerful interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridAutoRows: '400px' }}>
            {/* Card 1: Hidden Nasties */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/30 overflow-hidden relative group">
              <div className="z-10 relative">
                <h3 className="font-display text-headline-md text-primary mb-2">Hidden Additives Detected</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm">We highlight preservatives, artificial colors, and hidden sugars instantly.</p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 max-w-[340px] mx-auto glass-card rounded-2xl p-5 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-transparent shimmer-effect z-0 opacity-30"></div>
                <div className="flex flex-col gap-2.5 relative z-10">
                  {['Palm Oil', 'E635 (Flavor Enhancer)', 'Red 40'].map((nasty, i) => (
                    <div
                      key={i}
                      className={`${i < 2 ? 'bg-error-container/50' : 'bg-surface-variant'} px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-500`}
                      style={{
                        opacity: featuresVisible ? 1 : 0,
                        transform: featuresVisible ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: `${i * 200}ms`
                      }}
                    >
                      <span className={`font-semibold text-xs sm:text-sm ${i < 2 ? 'text-on-error-container' : 'text-on-surface-variant'}`}>{nasty}</span>
                      <Icon name={i < 2 ? 'warning' : 'info'} className={`text-sm ${i < 2 ? 'text-error' : 'text-outline'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Personalized Goals (Dark with Cursor Click & Ripple Animation) */}
            <div className="bg-primary rounded-[2rem] p-8 border border-primary overflow-hidden relative group text-on-primary">
              <div className="z-10 relative">
                <h3 className="font-display text-headline-md mb-2">Personalized Goals</h3>
                <p className="text-body-md text-on-primary/80 max-w-sm">Set dietary preferences like vegan, gluten-free, or low-FODMAP.</p>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-full px-8 flex flex-wrap gap-3 justify-center">
                {goals.map((goal, i) => {
                  const isActive = activeGoal === i;
                  return (
                    <div
                      key={i}
                      className={`relative px-4 py-2 rounded-full text-label-caps text-xs flex items-center gap-1.5 transition-all duration-500 ${
                        isActive
                          ? 'bg-secondary text-white shadow-lg goal-pulse'
                          : 'bg-surface-variant/20 text-on-primary'
                      }`}
                    >
                      <Icon name={isActive ? 'check' : 'add'} className="text-sm" />
                      {goal}
                      {/* Animated Cursor hitting active chip */}
                      {isActive && (
                        <>
                          <div className="absolute -right-2 top-0 z-30 text-white drop-shadow-xl cursor-animate pointer-events-none">
                            <Icon name="near_me" fill className="text-2xl text-white" />
                          </div>
                          <div className="ripple-effect" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Health Score & Streaks */}
            <div className="bg-secondary-fixed/20 rounded-[2rem] p-8 border border-secondary-fixed/50 overflow-hidden relative group">
              <div className="z-10 relative">
                <h3 className="font-display text-headline-md text-primary mb-2">BeyondLabel Score</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm">A simple 0-100 score based on processing levels and nutritional value.</p>
                <div className="mt-4 flex items-center gap-2">
                  <Icon name="local_fire_department" fill className="text-tertiary-container fire-pulse" />
                  <span className="text-sm font-bold text-on-surface-variant">12 Day Streak</span>
                </div>
              </div>
              <div className="absolute bottom-8 right-8 flex items-center justify-center">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-variant"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"
                    />
                    <path
                      className="text-secondary transition-all duration-[2000ms] ease-out"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor"
                      strokeDasharray={`${featuresVisible ? scoreTarget : 0}, 100`}
                      strokeLinecap="round" strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-4xl text-primary">{scoreCount}</span>
                    <span className="text-[10px] text-label-caps text-secondary uppercase tracking-widest">Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Share Insights (Fixed width & padding so text is never cut off) */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/30 overflow-hidden relative group">
              <div className="z-10 relative">
                <h3 className="font-display text-headline-md text-primary mb-2">Share Insights</h3>
                <p className="text-body-md text-on-surface-variant max-w-sm">Warn friends about harmful products or share great finds.</p>
              </div>
              <div className="absolute bottom-6 left-6 right-6 max-w-[280px] mx-auto bg-white rounded-xl p-4 shadow-xl border border-surface-variant float-anim transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-secondary-fixed/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="person" className="text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-on-surface truncate">Shared by Alex</div>
                    <div className="text-xs text-on-surface-variant truncate">"Check out this clean alternative!"</div>
                  </div>
                </div>
                <button className="w-full bg-surface-container-high py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-on-surface whitespace-nowrap overflow-hidden">
                  <Icon name="ios_share" className="text-sm flex-shrink-0" />
                  <span className="truncate">Share Discovery</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. CTA + QR Code ═══ */}
      <section id="cta" className="py-section-py px-5 md:px-10 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-10"></div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-display-lg text-white mb-6 tracking-tight">Ready to eat better?</h2>
            <p className="text-body-lg text-surface-variant max-w-md mx-auto md:mx-0 mb-8">
              Join over 1 million users making smarter, healthier choices every day. Scan the QR code to open the app instantly.
            </p>
            <a
              href="https://beyondlabel.vercel.app"
              className="inline-flex bg-secondary text-white text-label-caps uppercase tracking-widest px-8 py-4 rounded-full hover:bg-on-secondary-fixed-variant transition-colors shadow-lg items-center gap-2"
            >
              <Icon name="qr_code_scanner" /> Get Started Now
            </a>
          </div>
          <div className="flex-shrink-0">
            <div className="glass-card rounded-[2rem] p-8 border-white/20 bg-white/5 backdrop-blur-2xl">
              <div className="bg-white p-4 rounded-xl mb-4 w-48 h-48 mx-auto flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fbeyondlabel.vercel.app&color=00261b&bgcolor=ffffff&margin=0"
                  alt="Scan to open BeyondLabel"
                  width="160" height="160" className="rounded"
                />
              </div>
              <p className="text-center text-surface-variant text-label-caps text-xs tracking-widest uppercase">Scan to download</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. Footer ═══ */}
      <footer className="bg-on-background py-12 px-5 md:px-10 border-t border-surface-variant/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Icon name="eco" fill className="text-secondary text-2xl" />
            <span className="font-display text-xl text-white tracking-tighter">BeyondLabel</span>
          </div>
          <div className="flex gap-6 text-sm text-surface-variant/60">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-surface-variant/60">© {new Date().getFullYear()} BeyondLabel Inc.</div>
        </div>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════ */
/*  Desktop Verdict Card — Premium Conversion Piece   */
/* ═══════════════════════════════════════════════════ */
const DesktopVerdictCard = ({ verdict }) => {
  const { verdict: vStr, healthScore, why, suggestion, hiddenNasties, macros, alternatives, pros, cons } = verdict;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (healthScore == null) return;
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= healthScore) { current = healthScore; clearInterval(timer); }
      setAnimatedScore(current);
    }, 20);
    return () => clearInterval(timer);
  }, [healthScore]);

  const getScoreColor = (s) => {
    if (s >= 71) return { stroke: 'text-secondary', label: 'text-secondary', border: 'border-secondary' };
    if (s >= 51) return { stroke: 'text-primary-fixed-dim', label: 'text-primary-fixed-dim', border: 'border-primary-fixed-dim' };
    if (s >= 31) return { stroke: 'text-tertiary-fixed-dim', label: 'text-tertiary-fixed-dim', border: 'border-tertiary-fixed-dim' };
    return { stroke: 'text-error', label: 'text-error', border: 'border-error' };
  };

  const sc = getScoreColor(healthScore || 0);

  const getVerdictLabel = (v) => {
    switch (v) {
      case 'Excellent': return 'Great Choice!';
      case 'Good': return 'Good Choice';
      case 'Moderate': return 'Eat in Moderation';
      case 'Poor': return 'Think Twice';
      case 'Avoid': return 'Avoid';
      default: return v || 'Unknown';
    }
  };

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-start animate-slide-up">
      {/* Left: Animated Score Arc */}
      {healthScore != null && (
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-variant"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"
              />
              <path
                className={`${sc.stroke} transition-all duration-[1500ms] ease-out`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor"
                strokeDasharray={`${animatedScore}, 100`}
                strokeLinecap="round" strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl text-primary">{animatedScore}</span>
              <span className={`text-[9px] text-label-caps ${sc.label} uppercase tracking-widest`}>
                {healthScore >= 71 ? 'Excellent' : healthScore >= 51 ? 'Good' : healthScore >= 31 ? 'Moderate' : 'Poor'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Center: Verdict Details */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* Verdict Header */}
        <div>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${sc.border} border text-sm font-bold ${sc.label} mb-3`}>
            <Icon name={healthScore >= 51 ? 'verified' : 'warning'} className="text-base" />
            {getVerdictLabel(vStr)}
          </div>
          <p className="text-body-lg text-on-surface leading-relaxed">{why}</p>
        </div>

        {/* Hidden Nasties */}
        {hiddenNasties && hiddenNasties.length > 0 && (
          <div className="bg-error-container/30 border border-error-container rounded-2xl p-5">
            <p className="text-label-caps text-on-error-container uppercase tracking-wider mb-3 flex items-center gap-2">
              <Icon name="warning" className="text-error text-base" /> Hidden Nasties Flagged
            </p>
            <div className="flex flex-wrap gap-2">
              {hiddenNasties.map((n, i) => (
                <span key={i} className="bg-error-container/60 text-on-error-container px-3 py-1.5 rounded-lg text-sm font-semibold">{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Suggestion */}
        {suggestion && (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5">
            <p className="text-label-caps text-outline uppercase tracking-wider mb-1">The Bottom Line</p>
            <p className="text-body-md text-on-surface">{suggestion}</p>
          </div>
        )}

        {/* Macro Bars */}
        {macros && (
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(macros).filter(([_, v]) => v).map(([key, m]) => {
              const barColor = m.status === 'Optimal' ? 'bg-secondary' : m.status === 'Moderate' ? 'bg-tertiary-fixed-dim' : 'bg-error';
              const barWidth = m.status === 'Optimal' ? '40%' : m.status === 'Moderate' ? '65%' : '90%';
              return (
                <div key={key}>
                  <p className="text-[10px] text-label-caps text-outline uppercase tracking-wider mb-1 capitalize">{key}</p>
                  <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-1000`} style={{ width: barWidth }}></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 font-medium">{m.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Alternatives */}
        {alternatives && alternatives.length > 0 && (
          <div className="pt-4 border-t border-outline-variant/30">
            <p className="text-label-caps text-outline uppercase tracking-wider mb-3">Better Alternatives</p>
            <div className="grid grid-cols-3 gap-3">
              {alternatives.slice(0, 3).map((alt, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-on-surface truncate">{alt.name}</p>
                    {alt.score && (
                      <span className="text-xs font-bold text-secondary bg-secondary-fixed/30 px-2 py-0.5 rounded-full">{alt.score}</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-snug">{alt.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Mobile CTA */}
      <div className="w-56 flex-shrink-0 glass-card rounded-2xl p-5 border border-secondary/20 text-center">
        <Icon name="phone_iphone" className="text-secondary text-3xl mb-2" />
        <p className="font-display text-sm font-bold text-primary mb-1">This is just a preview.</p>
        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
          On mobile, scan labels with your camera, track streaks, and share verdicts.
        </p>
        <div className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-outline-variant/30 mx-auto w-fit">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fbeyondlabel.vercel.app&color=00261b&bgcolor=ffffff&margin=0"
            alt="Scan to open" width="100" height="100" className="rounded"
          />
        </div>
        <p className="text-[10px] text-label-caps text-outline uppercase tracking-wider">Scan to open</p>
      </div>
    </div>
  );
};

export default DesktopLandingPage;
