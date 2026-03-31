'use client';

import { useState, useEffect } from 'react';
import { Phone, CheckCircle2, XCircle, Copy, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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

function StatusBadge({ status }) {
  const map = {
    pending: { bg: 'rgba(245,166,35,0.2)', color: '#F5A623', label: 'Pending' },
    done: { bg: 'rgba(76,175,125,0.2)', color: '#4CAF7D', label: 'Done' },
    declined: { bg: 'rgba(255,107,107,0.2)', color: '#FF6B6B', label: 'Declined' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="text-[11px] font-body font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

const DECLINE_REASONS = [
  "I'm fully booked on that day",
  "I don't cover that area",
  "Request outside my service scope",
  "Scheduling conflict",
  "Other (specify below)",
];

function DeclineModal({ booking, providerName, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [custom, setCustom] = useState('');
  const [declining, setDeclining] = useState(false);
  const isOther = reason === 'Other (specify below)';
  const finalReason = isOther ? custom.trim() : reason;
  const canSubmit = !declining && (isOther ? custom.trim().length > 0 : reason.length > 0);

  const handleDecline = async () => {
    if (!canSubmit) return;
    setDeclining(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'declined', declineReason: finalReason }),
      });
      if (!res.ok) throw new Error('Failed');
      const customerMessage = `Hi ${booking.customer_name}, this is ${providerName} from Swatantra.\n\nI've reviewed your booking request and unfortunately I'm unable to take it up at this time.\n\nReason: ${finalReason}\n\nYou can find and connect with other verified service providers at:\nswatantra.vercel.app\n\nSorry for the inconvenience, and thank you for reaching out!`;
      const raw = (booking.customer_mobile || '').replace(/\D/g, '');
      const fullPhone = raw.startsWith('91') ? raw : `91${raw}`;
      window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(customerMessage)}`, '_blank');
      onSuccess(booking.id);
    } catch (e) {
      console.error('Decline error:', e);
    } finally {
      setDeclining(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>Decline Request</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', margin: '4px 0 0' }}>
            {booking.customer_name || 'Customer'} &middot; {booking.customer_mobile}
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#888884', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reason for declining</p>
          <div style={{ position: 'relative' }}>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{ width: '100%', background: '#0F0F0F', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '10px 36px 10px 12px', color: reason ? '#F5F5F0' : '#555', fontFamily: 'var(--font-body)', fontSize: '13px', outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', boxSizing: 'border-box' }}
            >
              <option value="" disabled>Select a reason...</option>
              {DECLINE_REASONS.map(r => (
                <option key={r} value={r} style={{ color: '#F5F5F0', background: '#111' }}>{r}</option>
              ))}
            </select>
            <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="#888884" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div style={{ maxHeight: isOther ? '120px' : '0', overflow: 'hidden', transition: 'max-height 0.2s ease' }}>
          <textarea
            rows={3}
            placeholder="Type your reason here..."
            value={custom}
            onChange={e => setCustom(e.target.value)}
            style={{ background: '#0F0F0F', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '10px 12px', color: '#F5F5F0', fontFamily: 'var(--font-body)', fontSize: '13px', width: '100%', outline: 'none', resize: 'none', boxSizing: 'border-box', display: 'block' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = '#2A2A2A'; }}
          />
        </div>

        <button
          onClick={handleDecline}
          disabled={!canSubmit}
          style={{ background: canSubmit ? '#DC2626' : '#2A2A2A', color: canSubmit ? '#fff' : '#555', borderRadius: '12px', padding: '12px', border: 'none', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, width: '100%', cursor: canSubmit ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s' }}
        >
          {declining && <Loader2 size={14} className="animate-spin" />}
          Send & Decline
        </button>
        <button
          onClick={onClose}
          style={{ background: 'transparent', color: '#888884', borderRadius: '12px', padding: '11px', border: '1px solid #2A2A2A', fontFamily: 'var(--font-display)', fontSize: '13px', width: '100%', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F5F5F0'; e.currentTarget.style.borderColor = '#444440'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#888884'; e.currentTarget.style.borderColor = '#2A2A2A'; }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Toast({ message, visible }) {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200, background: '#1A1A1A', border: '1px solid rgba(76,175,125,0.3)', borderRadius: '14px', padding: '12px 16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#F5F5F0', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(110%)', transition: visible ? 'opacity 0.25s ease, transform 0.25s ease' : 'opacity 0.2s ease, transform 0.2s ease', pointerEvents: 'none' }}>
      <CheckCircle2 size={16} style={{ color: '#4CAF7D', flexShrink: 0 }} />
      {message}
    </div>
  );
}

export default function RequestsPage() {
  const { t } = useLanguage();
  const TABS = [
    { key: 'all', label: t.requests.tab_all },
    { key: 'pending', label: t.requests.status.pending },
    { key: 'done', label: t.requests.tab_done },
    { key: 'declined', label: t.requests.tab_declined },
  ];
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;
  const [provider, setProvider] = useState(null);
  const [declineModal, setDeclineModal] = useState({ open: false, booking: null });
  const [toast, setToast] = useState('');

  const fetchBookings = async (status, off = 0, append = false) => {
    try {
      const params = new URLSearchParams({ limit: LIMIT, offset: off });
      if (status !== 'all') params.set('status', status);
      const res = await fetch(`/api/bookings?${params}`);
      if (res.ok) {
        const d = await res.json();
        setBookings(prev => append ? [...prev, ...(d.bookings || [])] : (d.bookings || []));
        setTotal(d.total ?? 0);
        setPendingCount(d.pending ?? 0);
        setHasMore((d.bookings || []).length === LIMIT);
        setOffset(off + (d.bookings || []).length);
      }
    } catch (e) {
      console.error('Fetch bookings error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    fetchBookings(tab, 0);
  }, [tab]);

  useEffect(() => {
    fetch('/api/provider')
      .then(r => r.json())
      .then(d => { if (d.provider) setProvider(d.provider); })
      .catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        if (status === 'done' || status === 'declined') {
          setPendingCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (e) {
      console.error('Update booking error:', e);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeclineSuccess = (bookingId) => {
    setDeclineModal({ open: false, booking: null });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'declined' } : b));
    setPendingCount(prev => Math.max(0, prev - 1));
    setToast('Request declined · WhatsApp opened');
    setTimeout(() => setToast(''), 3000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/p/${window.__slug || ''}`;
    navigator.clipboard.writeText(url);
  };

  const getCounts = () => {
    const all = bookings;
    return {
      all: total,
      pending: pendingCount,
      done: bookings.filter(b => b.status === 'done').length,
      declined: bookings.filter(b => b.status === 'declined').length,
    };
  };

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  return (
    <div className="space-y-6 fade-in-1">
      <h1 className="font-display text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{t.requests.title}</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl p-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(tabItem => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-150"
            style={{
              background: tab === tabItem.key ? 'var(--accent-dim)' : 'transparent',
              color: tab === tabItem.key ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === tabItem.key ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Request cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(b => (
            <div
              key={b.id}
              className="rounded-2xl p-5 transition-all duration-200"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                    style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}
                  >
                    {(b.customer_name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {b.customer_name || 'Anonymous Customer'}
                    </p>
                    <p className="font-body text-[11px]" style={{ color: 'var(--text-secondary)' }}>{timeAgo(b.created_at)}</p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              {/* Phone */}
              {b.customer_mobile && (
                <a href={`tel:${b.customer_mobile}`} className="inline-flex items-center gap-1.5 mb-2 transition-all duration-150 hover:opacity-80">
                  <Phone size={14} style={{ color: 'var(--accent)' }} />
                  <span className="font-mono text-[14px]" style={{ color: 'var(--accent)' }}>{b.customer_mobile}</span>
                </a>
              )}

              {/* Message */}
              <div
                className="rounded-lg px-3 py-2 mb-3 font-body text-[14px] italic"
                style={{ background: 'var(--surface-2)', borderLeft: '2px solid rgba(245,166,35,0.4)', color: 'var(--text-secondary)' }}
              >
                {b.message || 'No message provided'}
              </div>

              {/* Actions */}
              {b.status === 'pending' && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(b.id, 'done')}
                    disabled={updating === b.id}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
                    style={{ background: 'var(--accent)', color: '#000' }}
                  >
                    {updating === b.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    {t.requests.mark_done}
                  </button>
                  <button
                    onClick={() => setDeclineModal({ open: true, booking: b })}
                    disabled={updating === b.id}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
                    style={{ border: '1px solid rgba(255,107,107,0.3)', color: 'var(--danger)', background: 'transparent' }}
                  >
                    <XCircle size={14} /> {t.requests.decline}
                  </button>
                  {b.customer_mobile && (
                    <a
                      href={`tel:${b.customer_mobile}`}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      <Phone size={14} /> {t.requests.call_customer}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <button
              onClick={() => fetchBookings(tab, offset, true)}
              className="w-full rounded-xl py-3 text-sm font-body font-semibold transition-all duration-150"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.5)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {t.requests.load_more}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)', paddingTop: '40px', paddingBottom: '40px', minHeight: '200px' }}>
          <svg className="w-16 h-16 mx-auto mb-3 opacity-30" viewBox="0 0 64 64" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <rect x="16" y="10" width="32" height="40" rx="4" />
            <path d="M24 22h16M24 30h16M24 38h8" strokeLinecap="round" />
          </svg>
          <p className="font-display text-[16px] mb-1" style={{ color: 'var(--text-primary)' }}>
            {tab === 'pending' ? 'No pending requests' : tab === 'done' ? 'No completed requests yet' : tab === 'declined' ? 'No declined requests' : 'No booking requests yet'}
          </p>
          <p className="font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            {tab === 'pending' ? 'Share your link with customers!' : ''}
          </p>
        </div>
      )}

      {declineModal.open && declineModal.booking && (
        <DeclineModal
          booking={declineModal.booking}
          providerName={provider?.name || 'Your provider'}
          onClose={() => setDeclineModal({ open: false, booking: null })}
          onSuccess={handleDeclineSuccess}
        />
      )}
      <Toast message={toast} visible={!!toast} />
    </div>
  );
}
