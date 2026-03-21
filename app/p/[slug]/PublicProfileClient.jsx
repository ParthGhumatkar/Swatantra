'use client';

import { useState } from 'react';
import { Eye, MapPin, Phone, MessageCircle, Star, CheckSquare, CalendarPlus, Loader2, CheckCircle2 } from 'lucide-react';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase();
}

export default function PublicProfileClient({ provider, availability }) {
  const [form, setForm] = useState({ customer_name: '', customer_mobile: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customer_mobile) { setError('Mobile number is required'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_slug: provider.slug, ...form }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = `https://wa.me/${(provider.whatsapp || provider.mobile || '').replace(/\D/g, '')}`;
  const telLink = `tel:${provider.mobile || ''}`;

  const today = new Date().getDay();
  const hasAnyAvailability = Object.values(availability).some(d => d.morning || d.afternoon || d.evening || d.dayOff);
  const week7 = Array.from({ length: 7 }, (_, i) => {
    const slot = availability[i] || {};
    return { day: i, label: DAY_SHORT[i], morning: !!slot.morning, afternoon: !!slot.afternoon, evening: !!slot.evening, dayOff: !!slot.dayOff, isToday: i === today };
  });

  const inputStyle = {
    background: '#111111',
    border: '1px solid #2A2A2A',
    borderRadius: '12px',
    padding: '12px 14px',
    color: '#F5F5F0',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    display: 'block',
  };

  return (
    <div style={{ background: '#0F0F0F', minHeight: '100vh', paddingBottom: '128px' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', padding: '24px 16px 0' }}>

        {/* ── HERO CARD ── */}
        <div style={{ background: 'linear-gradient(135deg, #1A1A0E 0%, #1E1C10 100%)', borderRadius: '24px', border: '1px solid #2A2A2A', padding: '24px 20px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
          {/* Bottom glow line */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.3), transparent)' }} />

          {/* Badges row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '20px', padding: '4px 10px' }}>
              <Eye size={10} style={{ color: '#F5A623' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#F5A623' }}>47 views this week</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.25)', borderRadius: '20px', padding: '4px 10px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#4CAF7D' }}>Live</span>
            </div>
          </div>

          {/* Avatar with conic-gradient ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'conic-gradient(#F5A623 0deg, #FFD580 90deg, #F5A623 180deg, #1A1A1A 180deg)', padding: '3px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {provider.photo_url ? (
                  <img src={provider.photo_url} alt={provider.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: '#F5A623' }}>{getInitials(provider.name)}</span>
                )}
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#F5F5F0', marginTop: '12px', marginBottom: 0, textAlign: 'center' }}>{provider.name}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
              <span style={{ fontSize: '14px' }}>⚡</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#F5A623' }}>{provider.service || 'Service Provider'}</span>
            </div>

            {provider.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <MapPin size={11} style={{ color: '#888884' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>{provider.city}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '20px', padding: '2px 10px' }}>
              <CheckSquare size={9} style={{ color: '#60A5FA' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#60A5FA', marginLeft: '3px' }}>Verified Professional</span>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#141414', border: '1px solid #2A2A2A', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ padding: '14px 8px', textAlign: 'center', borderRight: '1px solid #2A2A2A' }}>
            <div className="shimmer-text" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>{provider.experience || '—'}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>Years exp.</div>
          </div>
          <div style={{ padding: '14px 8px', textAlign: 'center', borderRight: '1px solid #2A2A2A' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#F5F5F0' }}>—</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>Bookings</div>
          </div>
          <div style={{ padding: '14px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: '#4CAF7D' }}>New</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>On ServiceLink</div>
          </div>
        </div>

        {/* ── AVAILABILITY ── */}
        {hasAnyAvailability && (
          <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>AVAILABLE THIS WEEK</p>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
              {week7.map((d) => (
                <div
                  key={d.day}
                  style={{ background: '#111', border: `1px solid ${d.isToday ? 'rgba(245,166,35,0.4)' : '#2A2A2A'}`, borderRadius: '12px', padding: '8px', textAlign: 'center', minWidth: '44px', flexShrink: 0 }}
                >
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', margin: '0 0 4px 0' }}>{d.label}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
                    {d.dayOff ? (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#444440' }}>—</span>
                    ) : (
                      <>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: d.morning ? '#F5A623' : '#2A2A2A', display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: d.afternoon ? '#60A5FA' : '#2A2A2A', display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: d.evening ? '#4CAF7D' : '#2A2A2A', display: 'inline-block', flexShrink: 0 }} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F5A623', display: 'inline-block' }} /> Morning
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#60A5FA', display: 'inline-block' }} /> Afternoon
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block' }} /> Evening
              </span>
            </div>
          </div>
        )}

        {/* ── ABOUT ── */}
        {provider.description && (
          <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderLeft: '4px solid #F5A623', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#F5F5F0', lineHeight: '1.6', fontStyle: 'italic', margin: 0 }}>{provider.description}</p>
          </div>
        )}

        {/* ── EXPERIENCE PILL ── */}
        {provider.experience > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '9999px', padding: '8px 16px' }}>
              <Star size={13} style={{ color: '#F5A623' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#F5A623' }}>{provider.experience} years of experience</span>
            </div>
          </div>
        )}

        {/* ── BOOKING REQUEST FORM ── */}
        <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CalendarPlus size={18} style={{ color: '#F5A623' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#F5F5F0' }}>Request a Booking</span>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={36} style={{ color: '#4CAF7D', margin: '0 auto 8px' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#4CAF7D', fontWeight: 600, margin: 0 }}>
                ✓ Request sent! {provider.name.split(' ')[0]} will contact you soon.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#FF6B6B' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = '#2A2A2A'; }}
                />
                <input
                  type="tel"
                  placeholder="Mobile number *"
                  required
                  value={form.customer_mobile}
                  onChange={e => setForm(f => ({ ...f, customer_mobile: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = '#2A2A2A'; }}
                />
                <textarea
                  rows={3}
                  placeholder="Describe what you need... (optional)"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor = '#2A2A2A'; }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#F5A623', color: '#000', borderRadius: '12px', padding: '14px', border: 'none', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, width: '100%', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s' }}
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Send Request
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── URL FOOTER ── */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#333330', textAlign: 'center', paddingBottom: '16px', margin: 0 }}>
          {(process.env.NEXT_PUBLIC_APP_URL || 'https://swatantra.vercel.app').replace(/^https?:\/\//, '')}/p/{provider.slug}
        </p>
      </div>

      {/* ── STICKY BOTTOM BAR ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: '#111111', borderTop: '1px solid #1E1E1E', padding: '12px 16px', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '448px', margin: '0 auto' }}>
          {provider.mobile && (
            <a
              href={telLink}
              style={{ background: '#F5A623', color: '#000', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}
            >
              <Phone size={16} style={{ color: '#000' }} />
              Call Now
            </a>
          )}
          {(provider.whatsapp || provider.mobile) && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'transparent', color: '#F5F5F0', border: '1px solid #2A2A2A', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '14px', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; }}
            >
              <MessageCircle size={16} style={{ color: '#F5F5F0' }} />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
