'use client';

import { useState, useEffect } from 'react';
import { Phone, CheckCircle2, XCircle, Copy, Loader2 } from 'lucide-react';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'done', label: 'Done' },
  { key: 'declined', label: 'Declined' },
];

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

export default function RequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

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
      <h1 className="font-display text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>Booking Requests</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl p-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-150"
            style={{
              background: tab === t.key ? 'var(--accent-dim)' : 'transparent',
              color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {t.label}
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
                    Mark as Done
                  </button>
                  <button
                    onClick={() => updateStatus(b.id, 'declined')}
                    disabled={updating === b.id}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
                    style={{ border: '1px solid rgba(255,107,107,0.3)', color: 'var(--danger)', background: 'transparent' }}
                  >
                    <XCircle size={14} /> Decline
                  </button>
                  {b.customer_mobile && (
                    <a
                      href={`tel:${b.customer_mobile}`}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      <Phone size={14} /> Call Customer
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
              Load more
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
    </div>
  );
}
