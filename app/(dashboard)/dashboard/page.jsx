'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CalendarDays, UserCircle, Copy, CheckCheck, CheckCircle2, MessageCircle, Eye, QrCode, Clipboard, Moon } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function useCountUp(target, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 50)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 50);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase();
}

function timeAgo(dateString) {
  const s = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return `${d} days ago`;
}

function ProgressRing({ progress, size = 80, strokeWidth = 6 }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  const color = progress >= 100 ? 'var(--mint)' : 'var(--accent)';
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: 'rgba(245,166,35,0.12)', border: 'rgba(245,166,35,0.2)', color: '#F5A623', label: 'Pending' },
    done: { bg: 'rgba(76,175,125,0.12)', border: 'rgba(76,175,125,0.2)', color: '#4CAF7D', label: 'Done' },
    declined: { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.2)', color: '#FF6B6B', label: 'Declined' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: s.bg, border: `1px solid ${s.border}`, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function Toast({ message, visible }) {
  return (
    <div
      className="fixed z-50 flex items-center gap-2"
      style={{
        bottom: '24px',
        right: '24px',
        background: '#1A1A1A',
        border: '1px solid rgba(76,175,125,0.3)',
        borderRadius: '14px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        color: '#F5F5F0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
        transition: visible ? 'opacity 0.25s ease, transform 0.25s ease' : 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'none',
      }}
    >
      <CheckCircle2 size={16} style={{ color: '#4CAF7D', flexShrink: 0 }} />
      {message}
    </div>
  );
}

export default function DashboardHome() {
  const [provider, setProvider] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [availability, setAvailability] = useState([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const animatedPending = useCountUp(pendingCount);

  useEffect(() => {
    async function load() {
      try {
        const [provRes, bookRes, availRes] = await Promise.all([
          fetch('/api/provider'),
          fetch('/api/bookings?limit=3'),
          fetch('/api/availability'),
        ]);
        if (provRes.ok) {
          const d = await provRes.json();
          setProvider(d.provider);
          setSubscription(d.subscription);
        }
        if (bookRes.ok) {
          const d = await bookRes.json();
          setBookings(d.bookings || []);
          setPendingCount(d.pending ?? 0);
          setTotalCount(d.total ?? 0);
        }
        if (availRes.ok) {
          const d = await availRes.json();
          setAvailability(d.availability || []);
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'https://swatantra.vercel.app';

  const copyLink = () => {
    if (!provider) return;
    const url = `${getBaseUrl()}/p/${provider.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!provider) return;
    const url = `${getBaseUrl()}/p/${provider.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`Hi! Book my services at: ${url}`)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (!provider) {
    return <div className="text-center py-20 font-body" style={{ color: 'var(--text-secondary)' }}>Failed to load data.</div>;
  }

  const baseUrl = getBaseUrl();
  const profileLink = `${baseUrl}/p/${provider.slug}`;
  const displayDomain = baseUrl.replace(/^https?:\/\//, '');
  const today = new Date().getDay();
  const todayAvail = availability.find(a => a.day_of_week === today);
  const slots = todayAvail ? [
    { label: 'Morning', on: todayAvail.morning },
    { label: 'Afternoon', on: todayAvail.afternoon },
    { label: 'Evening', on: todayAvail.evening },
  ] : [];
  const allOff = slots.length === 0 || slots.every(s => !s.on);

  const fields = [provider.name, provider.service, provider.city, provider.description, provider.experience, provider.photo_url];
  const filledCount = fields.filter(Boolean).length;
  const profilePercent = Math.round((filledCount / 6) * 100);

  const recentBookings = bookings.slice(0, 3);

  const cardBase = {
    background: '#141414',
    border: '1px solid #2A2A2A',
    borderRadius: '20px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'block',
  };

  return (
    <div>

      {/* ── SECTION 1: GREETING HERO ── */}
      <div
        className="fade-in-1"
        style={{ background: 'linear-gradient(135deg, #1A1A0E 0%, #161610 50%, #1A1A0E 100%)', borderRadius: '20px', border: '1px solid rgba(245,166,35,0.15)', borderLeft: '3px solid #F5A623', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', overflow: 'hidden', marginBottom: '16px' }}
      >
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>
            {getGreeting()}, {provider.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888884', margin: '4px 0 0' }}>
            {[provider.service, provider.city].filter(Boolean).join(' · ') || 'Service Provider'}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.2)', borderRadius: '20px', padding: '4px 12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#4CAF7D' }}>Profile live</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '20px', padding: '4px 12px' }}>
              <Eye size={10} style={{ color: '#F5A623' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#F5A623' }}>0 views today</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-center gap-2" style={{ flexShrink: 0 }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'conic-gradient(#F5A623 0deg, #FFD580 180deg, #2A2A2A 180deg)', padding: '2.5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {provider.photo_url ? (
                <img src={provider.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#F5A623' }}>{getInitials(provider.name)}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#4CAF7D' }}>Live</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: BOOKING LINK ── */}
      <div
        className="fade-in-2"
        style={{ background: '#141414', borderRadius: '20px', border: '1px solid #2A2A2A', borderLeft: '3px solid #F5A623', padding: '20px 24px', marginBottom: '16px' }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>YOUR BOOKING LINK</p>
        <div style={{ background: '#0A0A0A', border: '1px solid #222', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ overflow: 'hidden', flex: 1, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#888884' }}>{displayDomain}</span>
            <span className="shimmer-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>/p/{provider.slug}</span>
          </div>
          <button
            onClick={copyLink}
            style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '10px', transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.1)'; }}
          >
            {copied ? <CheckCheck size={12} style={{ color: '#4CAF7D' }} /> : <Copy size={12} style={{ color: '#F5A623' }} />}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={copyLink}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copied ? '#4CAF7D' : '#F5A623', color: '#000', borderRadius: '10px', padding: '10px 20px', border: 'none', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {copied ? <CheckCheck size={14} /> : <Clipboard size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={shareWhatsApp}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', color: '#F5F5F0', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '10px 20px', fontFamily: 'var(--font-display)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'; e.currentTarget.style.background = 'rgba(245,166,35,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.background = 'transparent'; }}
          >
            <MessageCircle size={14} />
            Share on WhatsApp
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', color: '#888884', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '10px 16px', fontFamily: 'var(--font-display)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F5F5F0'; e.currentTarget.style.borderColor = '#2A2A2A'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888884'; e.currentTarget.style.borderColor = '#1E1E1E'; }}
          >
            <QrCode size={14} />
            QR Code
          </button>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#444440', margin: 0 }}>Share your link with customers. They can book you without any app.</p>
      </div>

      {/* ── SECTION 3: STATS GRID ── */}
      <div className="fade-in-3 grid grid-cols-1 md:grid-cols-3 gap-3" style={{ marginBottom: '16px' }}>

        {/* Card A — Pending Requests */}
        <Link
          href="/dashboard/requests"
          style={cardBase}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>Pending Requests</span>
            <Bell size={16} style={{ color: '#888884', flexShrink: 0 }} />
          </div>
          {pendingCount > 0 ? (
            <>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 700, color: '#F5A623', lineHeight: 1, margin: 0 }}>{animatedPending}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', margin: '4px 0 0' }}>booking requests waiting</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#F5A623', margin: '12px 0 0' }}>→ View all</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={32} style={{ color: '#4CAF7D', marginTop: '8px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#4CAF7D', margin: '8px 0 0' }}>You&apos;re all caught up!</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', margin: '2px 0 0' }}>No pending requests</p>
            </>
          )}
        </Link>

        {/* Card B — Today's Schedule */}
        <Link
          href="/dashboard/availability"
          style={cardBase}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>Today&apos;s Schedule</span>
            <CalendarDays size={16} style={{ color: '#888884', flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>{DAY_NAMES[today]}</p>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: '#000', background: '#F5A623', borderRadius: '20px', padding: '1px 8px', fontWeight: 700 }}>Today</span>
          </div>
          {allOff ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Moon size={22} style={{ color: '#888884' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#888884' }}>Day off</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {slots.map(s => (
                <span
                  key={s.label}
                  style={s.on
                    ? { background: '#F5A623', color: '#000', borderRadius: '9999px', padding: '4px 12px', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700 }
                    : { border: '1px solid #2A2A2A', color: '#444440', borderRadius: '9999px', padding: '4px 12px', fontFamily: 'var(--font-display)', fontSize: '11px' }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </Link>

        {/* Card C — Profile Completeness */}
        <Link
          href="/dashboard/profile"
          style={cardBase}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>Profile</span>
            <UserCircle size={16} style={{ color: '#888884', flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', position: 'relative', width: '72px', margin: '12px auto 0' }}>
            <ProgressRing progress={profilePercent} size={72} strokeWidth={5} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#F5F5F0' }}>
              {filledCount}/6
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', textAlign: 'center', margin: '8px 0 0' }}>{filledCount} of 6 fields complete</p>
          {profilePercent < 100 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#F5A623', textAlign: 'center', margin: '4px 0 0' }}>Complete your profile →</p>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#4CAF7D', textAlign: 'center', margin: '4px 0 0' }}>Profile complete ✓</p>
          )}
        </Link>
      </div>

      {/* ── SECTION 4: RECENT REQUESTS ── */}
      <div className="fade-in-4" style={{ background: '#141414', border: '1px solid #2A2A2A', borderRadius: '20px', padding: '20px 24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>Recent Requests</h2>
          {totalCount > 0 && (
            <Link
              href="/dashboard/requests"
              style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#F5A623', textDecoration: 'none', transition: 'opacity 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              View all →
            </Link>
          )}
        </div>

        {recentBookings.length > 0 ? (
          <div>
            {recentBookings.map((b, i) => (
              <Link
                key={b.id}
                href="/dashboard/requests"
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 8px', borderBottom: i < recentBookings.length - 1 ? '1px solid #1A1A1A' : 'none', borderRadius: '8px', transition: 'background 0.15s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#1E1E1E', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: '#F5A623' }}>
                    {(b.customer_name || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: '#F5F5F0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.customer_name || 'Anonymous Customer'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.message ? (b.message.length > 50 ? b.message.slice(0, 50) + '…' : b.message) : 'No message'}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#444440' }}>{timeAgo(b.created_at)}</span>
                  <StatusBadge status={b.status} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto', display: 'block' }}>
              <rect x="8" y="16" width="48" height="36" rx="4" stroke="#F5A623" strokeWidth="1.5" opacity="0.4"/>
              <path d="M8 28h12l4 6h16l4-6h12" stroke="#F5A623" strokeWidth="1.5" opacity="0.4"/>
              <path d="M20 22h24M20 28h12" stroke="#F5A623" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#F5F5F0', margin: '16px 0 4px' }}>No booking requests yet</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888884', margin: '0 0 16px' }}>Share your link with customers to start receiving bookings</p>
            <button
              onClick={copyLink}
              style={{ background: 'transparent', border: '1px solid rgba(245,166,35,0.4)', borderRadius: '12px', padding: '10px 20px', fontFamily: 'var(--font-display)', fontSize: '13px', color: '#F5A623', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Copy size={14} />
              Copy Your Link
            </button>
          </div>
        )}
      </div>

      <Toast message={toast} visible={!!toast} />
    </div>
  );
}
