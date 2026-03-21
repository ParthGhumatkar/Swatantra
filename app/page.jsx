import Link from 'next/link';
import { UserPlus, UserCircle, Share2, X, Check, ShieldCheck, Eye, MapPin, Phone, MessageCircle, Clock, CheckSquare } from 'lucide-react';

const professions = [
  { emoji: '⚡', name: 'Electrician', desc: 'Home wiring, repairs' },
  { emoji: '🔧', name: 'Plumber', desc: 'Pipe work, installations' },
  { emoji: '✂️', name: 'Hair Dresser', desc: 'Cuts, styling, colour' },
  { emoji: '📚', name: 'Tutor', desc: 'School, college, skills' },
  { emoji: '🏠', name: 'Home Services', desc: 'Cleaning, painting' },
  { emoji: '🚗', name: 'Driver', desc: 'Local, outstation trips' },
  { emoji: '💊', name: 'Doctor', desc: 'Consultations, checkups' },
  { emoji: '💼', name: 'Consultant', desc: 'Business, legal, finance' },
];

const features = [
  'Your own profile page',
  'Unique booking link',
  'Unlimited booking requests',
  'WhatsApp & call buttons',
  'Set your availability',
  'Share image & QR code',
];

const pains = [
  'Platform takes 20-30% commission',
  'They control your visibility',
  'Customers belong to the platform',
  'Account can be blocked anytime',
  'You have no digital identity',
];

const wins = [
  'Zero commission, ever',
  'Your link, your visibility',
  'Your customers stay with you',
  'You own your page always',
  'Professional digital identity',
];

export default function LandingPage() {
  return (
    <div className="grain-overlay" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* ─── NAVBAR ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-5 md:px-10"
        style={{ background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #1E1E1E' }}
      >
        <Link href="/" className="font-display text-[20px] font-bold tracking-tight">
          <span style={{ color: 'var(--text-primary)' }}>Local</span>
          <span style={{ color: 'var(--accent)' }}>Link</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="font-body text-sm transition-colors duration-150 px-3 py-2"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={undefined}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="font-body text-sm font-semibold rounded-xl px-5 py-2 transition-all duration-150 hover:brightness-110 active:scale-95"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16"
        style={{ background: 'radial-gradient(ellipse 800px 600px at 50% 40%, rgba(245,166,35,0.06) 0%, transparent 70%)' }}
      >
        {/* Badge */}
        <div
          className="fade-in-1 flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
          style={{ border: '1px solid rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', animation: 'pulseDot 2s ease-in-out infinite' }} />
          <span className="font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>Now available across India</span>
        </div>

        {/* Headline */}
        <h1 className="fade-in-2 font-display font-bold text-[40px] md:text-[64px] leading-[1.05] tracking-tight">
          <span style={{ color: 'var(--text-primary)' }}>Your service.</span>
          <br />
          <span className="shimmer-text">Your link.</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Your customers.</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-in-3 font-body text-[16px] md:text-[18px] max-w-xl mt-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Stop depending on Urban Company and JustDial. Create your own professional booking page in 2 minutes and share it directly with customers.
        </p>

        {/* CTA Buttons */}
        <div className="fade-in-4 flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/signup"
            className="font-display text-lg font-bold rounded-2xl px-8 py-4 transition-all duration-150 hover:brightness-110 active:scale-95"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            Create Your Page Free
          </Link>
          <Link
            href="/p/demo"
            className="font-body text-lg rounded-2xl px-8 py-4 transition-all duration-200"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            See an example →
          </Link>
        </div>

        {/* Social proof */}
        <div className="fade-in-5 mt-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {['R', 'S', 'A', 'M', 'P'].map((initial, i) => (
              <div
                key={i}
                className="font-display font-bold"
                style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  background: 'var(--surface-2)',
                  border: '2px solid var(--accent)',
                  color: 'var(--accent)',
                  zIndex: 5 - i,
                  marginLeft: i > 0 ? '-8px' : '0'
                }}
              >
                {initial}
              </div>
            ))}
            <span className="font-body" style={{ fontSize: '13px', color: '#888884', whiteSpace: 'nowrap', marginLeft: '8px' }}>and 495 more</span>
          </div>
          <p className="font-body" style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Trusted by 500+ independent professionals across Maharashtra</p>
        </div>

        {/* Mockup card */}
        <div className="fade-in-5 mt-12 mb-8 mx-auto md:-rotate-1" style={{ width: '320px' }}>
          <div style={{ background: '#141414', borderRadius: '24px', border: '1px solid #2A2A2A', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.08)', overflow: 'hidden' }}>

            {/* Top gradient section */}
            <div style={{ background: 'linear-gradient(180deg, #1A1A0E 0%, #1E1C10 100%)', padding: '16px 20px 20px', position: 'relative' }}>
              {/* Bottom gradient line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.3), transparent)' }} />

              {/* Badge row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1" style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '20px', padding: '3px 8px' }}>
                  <Eye size={11} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--accent)', marginLeft: '4px' }}>47 views this week</span>
                </div>
                <div className="flex items-center gap-1" style={{ background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.25)', borderRadius: '20px', padding: '3px 8px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#4CAF7D', marginLeft: '4px' }}>Live</span>
                </div>
              </div>

              {/* Avatar with conic-gradient ring */}
              <div className="flex flex-col items-center">
                <div style={{ width: '95px', height: '95px', borderRadius: '50%', background: 'conic-gradient(#F5A623 0deg, #FFD580 90deg, #F5A623 180deg, #1A1A1A 180deg)', padding: '2.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)' }}>
                    R
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#F5F5F0', marginTop: '12px', marginBottom: 0 }}>Rahul Sharma</p>

                <div className="flex items-center gap-1 mt-1">
                  <span style={{ fontSize: '14px' }}>⚡</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--accent)' }}>Electrician</span>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)' }}>Pune, Maharashtra</span>
                </div>

                <div className="flex items-center gap-1 mt-2" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '20px', padding: '2px 8px' }}>
                  <CheckSquare size={11} style={{ color: '#60A5FA' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#60A5FA', marginLeft: '4px' }}>Verified Professional</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #2A2A2A', borderBottom: '1px solid #2A2A2A' }}>
              <div style={{ padding: '14px 8px', textAlign: 'center', borderRight: '1px solid #2A2A2A' }}>
                <div className="shimmer-text" style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700 }}>8</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Years exp.</div>
              </div>
              <div style={{ padding: '14px 8px', textAlign: 'center', borderRight: '1px solid #2A2A2A' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#F5F5F0' }}>124</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Bookings</div>
              </div>
              <div style={{ padding: '14px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#4CAF7D' }}>4.9</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Rating</div>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '16px 20px' }}>

              {/* Availability */}
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>TODAY'S AVAILABILITY</p>
              <div className="flex gap-2 mb-3">
                <span style={{ fontSize: '11px', fontWeight: 600, borderRadius: '20px', padding: '3px 10px', background: 'var(--accent)', color: '#000' }}>Morning</span>
                <span style={{ fontSize: '11px', fontWeight: 600, borderRadius: '20px', padding: '3px 10px', background: 'var(--accent)', color: '#000' }}>Afternoon</span>
                <span style={{ fontSize: '11px', fontWeight: 600, borderRadius: '20px', padding: '3px 10px', border: '1px solid #2A2A2A', color: 'var(--text-secondary)' }}>Evening</span>
              </div>

              {/* Rating row */}
              <div className="flex items-center justify-between mb-3" style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.12)', borderRadius: '12px', padding: '10px 12px' }}>
                <div className="flex items-center gap-1">
                  <span style={{ color: 'var(--accent)', fontSize: '13px' }}>★★★★★</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#F5F5F0', marginLeft: '4px' }}>4.9</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '2px' }}>(38 reviews)</span>
                </div>
                <div className="flex items-center gap-1" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '20px', padding: '2px 7px', flexShrink: 0 }}>
                  <Clock size={10} style={{ color: '#60A5FA' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#60A5FA', marginLeft: '3px' }}>8 yrs exp</span>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <button className="flex items-center justify-center gap-1" style={{ background: 'var(--accent)', borderRadius: '12px', padding: '10px 8px', border: 'none', cursor: 'default', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#000' }}>
                  <Phone size={13} style={{ color: '#000' }} />
                  Call Now
                </button>
                <button className="flex items-center justify-center gap-1" style={{ background: 'transparent', borderRadius: '12px', padding: '10px 8px', border: '1px solid #2A2A2A', cursor: 'default', fontFamily: 'var(--font-display)', fontSize: '13px', color: '#F5F5F0' }}>
                  <MessageCircle size={13} style={{ color: '#F5F5F0' }} />
                  WhatsApp
                </button>
              </div>

              {/* Request booking */}
              <button style={{ width: '100%', background: 'transparent', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '12px', padding: '9px', fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--accent)', cursor: 'default', marginBottom: '12px', display: 'block' }}>
                Request a Booking →
              </button>

              {/* URL bar */}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#444440', textAlign: 'center', margin: 0 }}>locallink.in/p/rahul-electrician-pune</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 md:py-24 px-6" style={{ background: '#0A0A0A', borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E' }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase text-center mb-4" style={{ color: 'var(--accent)' }}>HOW IT WORKS</p>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold text-center mb-12 md:mb-16" style={{ color: 'var(--text-primary)' }}>Up and running in 3 steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { num: '01', Icon: UserPlus, title: 'Create your account', desc: 'Sign up with your mobile number and set a PIN. Takes under a minute.' },
              { num: '02', Icon: UserCircle, title: 'Build your profile', desc: 'Add your photo, service, area, and availability. Your professional page is ready.' },
              { num: '03', Icon: Share2, title: 'Share your link', desc: 'Send your unique link to customers on WhatsApp. They book directly with you.' },
            ].map((step, i) => (
              <div key={i} className="relative text-center md:text-left" style={{ minHeight: '180px', overflow: 'visible' }}>
                <span className="font-display font-bold leading-none absolute select-none" style={{ fontSize: '64px', color: 'rgba(245,166,35,0.08)', top: '-16px', left: '-8px', zIndex: 0, userSelect: 'none', pointerEvents: 'none' }}>
                  {step.num}
                </span>
                <div className="relative pt-8" style={{ zIndex: 1 }}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto md:mx-0"
                    style={{ background: 'var(--accent-dim)', border: '1px solid rgba(245,166,35,0.2)' }}
                  >
                    <step.Icon size={22} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="font-display text-[20px] font-bold mt-4" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="font-body text-[15px] mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
                {i < 2 && (
                  <span className="hidden md:block absolute top-16 -right-6 text-2xl select-none" style={{ color: 'rgba(245,166,35,0.2)' }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOR WHO ─── */}
      <section className="py-16 md:py-24 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase text-center mb-4" style={{ color: 'var(--accent)' }}>BUILT FOR</p>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>For every independent professional</h2>
          <p className="font-body text-[16px] text-center mb-12 md:mb-16" style={{ color: 'var(--text-secondary)' }}>If you work for yourself, this is for you.</p>

          <div className="grid grid-cols-2 gap-4">
            {professions.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 transition-all duration-200 cursor-default"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <span className="text-[36px] leading-none">{p.emoji}</span>
                <p className="font-display text-[16px] font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                <p className="font-body text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY NOT PLATFORMS ─── */}
      <section className="py-16 md:py-24 px-6" style={{ background: 'linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 100%)' }}>
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="font-display text-[28px] md:text-[36px] font-bold" style={{ color: 'var(--text-primary)' }}>Stop working for platforms.</h2>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold shimmer-text">Start working for yourself.</h2>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platforms card */}
          <div className="rounded-2xl p-6" style={{ background: '#1A1210', border: '1px solid rgba(255,107,107,0.2)' }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF6B6B' }} />
              <span className="font-body text-[14px]" style={{ color: '#FF6B6B' }}>Urban Company / JustDial</span>
            </div>
            <div className="space-y-3">
              {pains.map((pain, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <X size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#FF6B6B' }} />
                  <span className="font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>{pain}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ServiceLink card */}
          <div className="rounded-2xl p-6" style={{ background: '#0F1A10', border: '1px solid rgba(76,175,125,0.2)' }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4CAF7D' }} />
              <span className="font-body text-[14px]" style={{ color: '#4CAF7D' }}>LocalLink</span>
            </div>
            <div className="space-y-3">
              {wins.map((win, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#4CAF7D' }} />
                  <span className="font-body text-[14px]" style={{ color: 'var(--text-primary)' }}>{win}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-16 md:py-24 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase text-center mb-4" style={{ color: 'var(--accent)' }}>PRICING</p>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>Simple, honest pricing</h2>
          <p className="font-body text-[16px] text-center mb-12 md:mb-16" style={{ color: 'var(--text-secondary)' }}>No commissions. No hidden fees. Just one small subscription.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="font-display text-[14px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Monthly</p>
              <div className="mt-2 flex items-baseline">
                <span className="font-display text-[52px] font-bold" style={{ color: 'var(--text-primary)' }}>₹199</span>
                <span className="font-body text-[16px] ml-1" style={{ color: 'var(--text-secondary)' }}>/month</span>
              </div>
              <div className="mt-6 space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check size={16} style={{ color: 'var(--mint)' }} />
                    <span className="font-body text-[14px]" style={{ color: 'var(--text-primary)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/signup"
                className="block text-center mt-6 rounded-xl py-3 text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
              >
                Get started
              </Link>
            </div>

            {/* Yearly */}
            <div
              className="rounded-2xl p-8 relative"
              style={{ background: 'linear-gradient(135deg, #1A1A0F 0%, #1E1A0A 100%)', border: '2px solid var(--accent)' }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 font-display text-[11px] font-bold px-4 py-1 rounded-full"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                BEST VALUE
              </div>
              <p className="font-display text-[14px] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Yearly</p>
              <div className="mt-2 flex items-baseline flex-wrap gap-2">
                <span className="font-display text-[52px] font-bold shimmer-text">₹1,999</span>
                <span className="font-body text-[16px]" style={{ color: 'var(--text-secondary)' }}>/year</span>
                <span className="text-[13px] font-semibold rounded-full px-3 py-1" style={{ background: 'rgba(76,175,125,0.2)', color: 'var(--mint)' }}>Save ₹389</span>
              </div>
              <div className="mt-6 space-y-3">
                {[...features, '2 months free'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check size={16} style={{ color: 'var(--mint)' }} />
                    <span className="font-body text-[14px]" style={{ color: 'var(--text-primary)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/signup"
                className="block text-center mt-6 rounded-xl py-3 text-sm font-bold transition-all duration-150 hover:brightness-110 active:scale-95"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                Get started
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <ShieldCheck size={16} style={{ color: 'var(--mint)' }} />
            <p className="font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>14-day free trial on all plans. No credit card required to start.</p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        className="py-20 md:py-32 px-6 text-center"
        style={{ background: 'radial-gradient(ellipse 1000px 600px at 50% 50%, rgba(245,166,35,0.08) 0%, transparent 70%)' }}
      >
        <h2 className="font-display text-[32px] md:text-[48px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Ready to own your customers?</h2>
        <h2 className="font-display text-[32px] md:text-[48px] font-bold shimmer-text leading-tight mt-1">Create your profile in 2 minutes.</h2>
        <p className="font-body text-[16px] md:text-[18px] mt-6 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Join 500+ independent professionals who already have their own booking page.
        </p>
        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-block font-display text-xl font-bold rounded-2xl px-10 py-5 transition-all duration-150 hover:brightness-110 active:scale-95"
            style={{ background: 'var(--accent)', color: '#000', boxShadow: '0 0 48px rgba(245,166,35,0.25)' }}
          >
            Create Your Free Page →
          </Link>
        </div>
        <p className="font-body text-[12px] mt-3" style={{ color: 'var(--text-secondary)' }}>Free for 14 days. Then ₹199/month. Cancel anytime.</p>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6" style={{ background: '#080808', borderTop: '1px solid #1E1E1E' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-display text-[20px] font-bold">
                <span style={{ color: 'var(--text-primary)' }}>Local</span>
                <span style={{ color: 'var(--accent)' }}>Link</span>
              </p>
              <p className="font-body text-[13px] mt-2" style={{ color: 'var(--text-secondary)' }}>Built for independent professionals in India.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'Login', href: '/login' },
                { label: 'Sign Up', href: '/signup' },
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="font-body text-[13px] transition-colors duration-150" style={{ color: 'var(--text-secondary)' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="font-body text-[12px]" style={{ color: 'var(--text-secondary)' }}>© {new Date().getFullYear()} LocalLink. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
