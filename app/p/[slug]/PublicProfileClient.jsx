'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, MapPin, Phone, MessageCircle, Star, CalendarPlus, Loader2, CheckCircle2 } from 'lucide-react';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function to12hr(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase();
}

export default function PublicProfileClient({ provider, availability }) {
  const [form, setForm] = useState({ customer_name: '', customer_mobile: '', preferred_time: '', message: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotFromClick, setSlotFromClick] = useState(false);
  const hasScrolled = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

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
  const hasAnyAvailability = Object.values(availability).some(d => (Array.isArray(d.timeSlots) && d.timeSlots.length > 0) || d.dayOff);
  const week7 = Array.from({ length: 7 }, (_, i) => {
    const slot = availability[i] || {};
    const timeSlots = Array.isArray(slot.timeSlots) ? slot.timeSlots : [];
    const dayOff = !!slot.dayOff;
    const sorted = [...timeSlots].filter(t => typeof t === 'string').sort();
    const morningSlots = sorted.filter(t => t >= '06:00' && t < '12:00');
    const afternoonSlots = sorted.filter(t => t >= '12:00' && t < '17:00');
    const eveningSlots = sorted.filter(t => t >= '17:00' && t < '22:00');
    const isAvailable = !dayOff && sorted.length > 0;
    return {
      day: i,
      label: DAY_SHORT[i],
      dayOff,
      timeSlots: sorted,
      morningSlots,
      afternoonSlots,
      eveningSlots,
      isAvailable,
      isToday: i === today,
    };
  });

  const inputStyle = {
    background: '#0F0F0F',
    border: '1px solid #2A2A2A',
    borderRadius: '12px',
    padding: '11px 14px',
    color: '#F5F5F0',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    display: 'block',
    marginBottom: '8px',
  };

  const fadeIn = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 0.35s ease ${delay}s, transform 0.35s ease ${delay}s`,
  });

  const handleSlotClick = (t) => {
    const display = to12hr(t);
    setSelectedSlot(display);
    setSlotFromClick(true);
    setForm(f => ({ ...f, preferred_time: display }));
    if (!hasScrolled.current) {
      hasScrolled.current = true;
      setTimeout(() => {
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .live-dot { animation: livePulse 2s infinite; }
      `}</style>

      <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '24px 16px 140px' }}>
        <div style={{ maxWidth: '460px', margin: '0 auto', width: '100%' }}>

          {/* ── HERO CARD ── */}
          <div style={{ ...fadeIn(0.05), background: 'linear-gradient(160deg, #1A1A0E 0%, #111108 100%)', borderRadius: '24px', border: '1px solid #2A2A2A', padding: '20px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
            {/* Bottom glow line */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.4), transparent)' }} />

            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '5px 10px' }}>
                <Eye size={10} style={{ color: '#F5A623' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#F5A623' }}>New listing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.25)', borderRadius: '20px', padding: '5px 10px' }}>
                <span className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#4CAF7D' }}>Live</span>
              </div>
            </div>

            {/* Avatar — linear-gradient ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #F5A623, #FFD580, #F5A623)', padding: '2.5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#1A1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {provider.photo_url ? (
                    <img src={provider.photo_url} alt={provider.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: '#F5A623' }}>{getInitials(provider.name)}</span>
                  )}
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#F5F5F0', marginTop: '12px', marginBottom: 0, textAlign: 'center' }}>{provider.name}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#F5A623', fontWeight: 500 }}>{provider.service || 'Service Provider'}</span>
              </div>

              {provider.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={10} style={{ color: '#888884' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>{provider.city}</span>
                </div>
              )}

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '20px', padding: '3px 10px' }}>
                <CheckCircle2 size={9} style={{ color: '#60A5FA' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#60A5FA' }}>Verified Professional</span>
              </div>
            </div>

            {/* Stats row — inside hero card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #222222', borderBottom: '1px solid #222222', marginTop: '16px' }}>
              <div style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid #222222' }}>
                {provider.experience > 0 ? (
                  <>
                    <div className="shimmer-text" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>{provider.experience}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>Years exp.</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#444440' }}>—</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>Years exp.</div>
                  </>
                )}
              </div>
              <div style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid #222222' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#F5F5F0' }}>—</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>Bookings</div>
              </div>
              <div style={{ padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#4CAF7D' }}>New</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginTop: '2px' }}>On Swatantra</div>
              </div>
            </div>
          </div>

          {/* ── AVAILABILITY CARD ── */}
          {hasAnyAvailability && (
            <div style={{ ...fadeIn(0.12), background: '#141414', border: '1px solid #222222', borderRadius: '20px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px 0' }}>AVAILABLE THIS WEEK</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '12px' }}>
                {week7.map((d) => (
                  <div
                    key={d.day}
                    style={{ background: '#1A1A1A', border: `1px solid ${d.isToday ? 'rgba(245,166,35,0.4)' : '#222222'}`, borderRadius: '10px', padding: '7px 4px', textAlign: 'center' }}
                  >
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: d.isToday ? '#F5A623' : '#888884', margin: 0 }}>{d.label}</p>
                    <div style={{ marginTop: '4px' }}>
                      {d.isAvailable ? (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5A623', display: 'inline-block' }} />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#444440' }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {week7.map((d) => {
                  const showMorning = d.morningSlots.length > 0;
                  const showAfternoon = d.afternoonSlots.length > 0;
                  const showEvening = d.eveningSlots.length > 0;
                  const showAny = showMorning || showAfternoon || showEvening;

                  return (
                    <div key={d.day} style={{ background: '#0F0F0F', border: '1px solid #222222', borderRadius: '14px', padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: '#F5F5F0' }}>
                          {d.label}
                        </span>
                        {d.isToday && (
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: '#000', background: '#F5A623', borderRadius: '20px', padding: '1px 7px', fontWeight: 700 }}>
                            Today
                          </span>
                        )}
                      </div>

                      {!showAny ? (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>Not available</span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {showMorning && (
                            <div>
                              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginBottom: '6px' }}>Morning</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {d.morningSlots.map(t => (
                                  <button
                                    key={t}
                                    onClick={() => handleSlotClick(t)}
                                    style={{
                                      border: selectedSlot === to12hr(t) ? '2px solid #F5A623' : '1px solid rgba(245,166,35,0.35)',
                                      color: '#F5A623',
                                      background: selectedSlot === to12hr(t) ? 'rgba(245,166,35,0.18)' : 'rgba(245,166,35,0.06)',
                                      borderRadius: '9999px',
                                      padding: selectedSlot === to12hr(t) ? '4px 9px' : '5px 10px',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '11px',
                                      cursor: 'pointer',
                                      boxShadow: selectedSlot === to12hr(t) ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                                      transition: 'all 0.15s',
                                    }}
                                  >
                                    {to12hr(t)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {showAfternoon && (
                            <div>
                              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginBottom: '6px' }}>Afternoon</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {d.afternoonSlots.map(t => (
                                  <button
                                    key={t}
                                    onClick={() => handleSlotClick(t)}
                                    style={{
                                      border: selectedSlot === to12hr(t) ? '2px solid #F5A623' : '1px solid rgba(245,166,35,0.35)',
                                      color: '#F5A623',
                                      background: selectedSlot === to12hr(t) ? 'rgba(245,166,35,0.18)' : 'rgba(245,166,35,0.06)',
                                      borderRadius: '9999px',
                                      padding: selectedSlot === to12hr(t) ? '4px 9px' : '5px 10px',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '11px',
                                      cursor: 'pointer',
                                      boxShadow: selectedSlot === to12hr(t) ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                                      transition: 'all 0.15s',
                                    }}
                                  >
                                    {to12hr(t)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {showEvening && (
                            <div>
                              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', marginBottom: '6px' }}>Evening</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {d.eveningSlots.map(t => (
                                  <button
                                    key={t}
                                    onClick={() => handleSlotClick(t)}
                                    style={{
                                      border: selectedSlot === to12hr(t) ? '2px solid #F5A623' : '1px solid rgba(245,166,35,0.35)',
                                      color: '#F5A623',
                                      background: selectedSlot === to12hr(t) ? 'rgba(245,166,35,0.18)' : 'rgba(245,166,35,0.06)',
                                      borderRadius: '9999px',
                                      padding: selectedSlot === to12hr(t) ? '4px 9px' : '5px 10px',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '11px',
                                      cursor: 'pointer',
                                      boxShadow: selectedSlot === to12hr(t) ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                                      transition: 'all 0.15s',
                                    }}
                                  >
                                    {to12hr(t)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ABOUT CARD ── */}
          {provider.description && (
            <div style={{ ...fadeIn(0.18), background: '#141414', border: '1px solid #222222', borderLeft: '3px solid #F5A623', borderRadius: '0 20px 20px 0', padding: '16px 18px', marginBottom: '10px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#C8C8C4', lineHeight: '1.7', fontStyle: 'italic', margin: 0 }}>"{provider.description}"</p>
            </div>
          )}

          {/* ── EXPERIENCE PILL ── */}
          {provider.experience > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '20px', padding: '6px 14px' }}>
                <Star size={13} style={{ color: '#F5A623' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#F5A623' }}>{provider.experience} years of experience</span>
              </div>
            </div>
          )}

          {/* ── BOOKING FORM ── */}
          <div id="booking-form" style={{ ...fadeIn(0.24), background: '#141414', border: '1px solid #222222', borderRadius: '20px', padding: '18px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CalendarPlus size={16} style={{ color: '#F5A623' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#F5F5F0' }}>Request a Booking</span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={40} style={{ color: '#4CAF7D', margin: '0 auto 10px', display: 'block' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#4CAF7D', fontWeight: 600, margin: '0 0 4px' }}>✓ Request sent!</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888884', margin: 0 }}>{provider.name.split(' ')[0]} will contact you soon.</p>
              </div>
            ) : (
              <>
                {error && (
                  <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#FF6B6B' }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.customer_name}
                    onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#2A2A2A'; e.target.style.boxShadow = 'none'; }}
                  />
                  <input
                    type="tel"
                    placeholder="Mobile number *"
                    required
                    value={form.customer_mobile}
                    onChange={e => setForm(f => ({ ...f, customer_mobile: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#2A2A2A'; e.target.style.boxShadow = 'none'; }}
                  />
                  <textarea
                    rows={3}
                    placeholder="Describe what you need... (optional)"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = '#2A2A2A'; e.target.style.boxShadow = 'none'; }}
                  />
                  <input
                    type="text"
                    placeholder="Preferred time (optional)"
                    value={form.preferred_time}
                    onChange={e => {
                      setForm(f => ({ ...f, preferred_time: e.target.value }));
                      setSlotFromClick(false);
                      setSelectedSlot(null);
                    }}
                    style={{ ...inputStyle, marginBottom: slotFromClick ? '4px' : '8px', border: slotFromClick ? '1px solid #F5A623' : '1px solid #2A2A2A', boxShadow: slotFromClick ? '0 0 0 3px rgba(245,166,35,0.08)' : 'none' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.08)'; }}
                    onBlur={e => { e.target.style.borderColor = slotFromClick ? '#F5A623' : '#2A2A2A'; e.target.style.boxShadow = slotFromClick ? '0 0 0 3px rgba(245,166,35,0.08)' : 'none'; }}
                  />
                  {slotFromClick && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#F5A623', margin: '0 0 8px 2px', opacity: 0.8 }}>
                      Selected from schedule · tap a time above to change
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ background: '#F5A623', color: '#000', borderRadius: '12px', padding: '13px', border: 'none', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, width: '100%', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1, transition: 'all 0.15s', marginTop: '4px' }}
                    onMouseOver={e => { if (!submitting) e.currentTarget.style.background = '#FFB84D'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#F5A623'; }}
                    onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    Send Request
                  </button>
                </form>
              </>
            )}
          </div>

          {/* ── URL WATERMARK ── */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#333330', textAlign: 'center', margin: 0, paddingBottom: '8px' }}>
            {process.env.NEXT_PUBLIC_APP_URL || 'https://swatantra.vercel.app'}/p/{provider.slug}
          </p>
        </div>

        {/* ── STICKY BOTTOM BAR ── */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid #1A1A1A', padding: '12px 16px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '460px', margin: '0 auto' }}>
            <a
              href={provider.mobile ? telLink : undefined}
              style={{ background: '#F5A623', color: '#000', borderRadius: '12px', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, textDecoration: 'none', opacity: provider.mobile ? 1 : 0.5, pointerEvents: provider.mobile ? 'auto' : 'none' }}
            >
              <Phone size={13} style={{ color: '#000' }} />
              Call Now
            </a>
            <a
              href={(provider.whatsapp || provider.mobile) ? waLink : undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'transparent', color: '#F5F5F0', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-display)', fontSize: '13px', textDecoration: 'none', transition: 'border-color 0.2s', opacity: (provider.whatsapp || provider.mobile) ? 1 : 0.5, pointerEvents: (provider.whatsapp || provider.mobile) ? 'auto' : 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; }}
            >
              <MessageCircle size={13} style={{ color: '#F5F5F0' }} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
