'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_DAY = { morning: false, afternoon: false, evening: false, dayOff: false };
const DEFAULT_AVAIL = Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, { ...DEFAULT_DAY }]));

function ToggleSwitch({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '44px', height: '24px', borderRadius: '12px', background: on ? '#FF6B6B' : '#2A2A2A', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
    </button>
  );
}

const SLOT_CFG = [
  { field: 'morning',   label: 'Morning',   color: '#F5A623', text: '#000' },
  { field: 'afternoon', label: 'Afternoon', color: '#60A5FA', text: '#000' },
  { field: 'evening',   label: 'Evening',   color: '#4CAF7D', text: '#000' },
];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState(DEFAULT_AVAIL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);
  const today = new Date().getDay();

  useEffect(() => {
    fetch('/api/availability')
      .then(r => r.json())
      .then(d => {
        if (d.availability) {
          const map = {};
          for (let i = 0; i < 7; i++) {
            const row = d.availability[i] ?? d.availability[String(i)];
            map[i] = { morning: !!row?.morning, afternoon: !!row?.afternoon, evening: !!row?.evening, dayOff: !!row?.dayOff };
          }
          setAvailability(map);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const patchDay = (dayIndex, updated) =>
    fetch('/api/availability', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayOfWeek: dayIndex, ...updated }),
    });

  const handleToggle = async (dayIndex, field) => {
    const current = availability[dayIndex];
    const updated = field === 'dayOff'
      ? { ...current, dayOff: !current.dayOff }
      : { ...current, [field]: !current[field], dayOff: false };
    setAvailability(prev => ({ ...prev, [dayIndex]: updated }));
    setSaving(dayIndex);
    try {
      await patchDay(dayIndex, updated);
      setSaving(null);
      setSaved(dayIndex);
      setTimeout(() => setSaved(s => s === dayIndex ? null : s), 2000);
    } catch {
      setAvailability(prev => ({ ...prev, [dayIndex]: current }));
      setSaving(null);
    }
  };

  const setAllWeekdays = async () => {
    if (!confirm('Set Mon–Fri as available (Morning + Afternoon)?')) return;
    const next = { ...availability };
    [1, 2, 3, 4, 5].forEach(d => { next[d] = { morning: true, afternoon: true, evening: false, dayOff: false }; });
    setAvailability(next);
    for (const d of [1, 2, 3, 4, 5]) await patchDay(d, next[d]);
  };

  const clearAll = async () => {
    if (!confirm('Clear all availability?')) return;
    const cleared = {};
    for (let i = 0; i < 7; i++) cleared[i] = { morning: false, afternoon: false, evening: false, dayOff: false };
    setAvailability(cleared);
    for (let i = 0; i < 7; i++) await patchDay(i, cleared[i]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="fade-in-1">

      {/* ── HEADER ── */}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: '#F5F5F0', margin: 0 }}>Weekly Schedule</h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888884', marginTop: '4px', marginBottom: 0 }}>
        Set your recurring availability. Customers will see when you&apos;re free.
      </p>

      {/* ── TOP ROW ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#888884' }}>Your weekly availability</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={setAllWeekdays}
            style={{ background: 'transparent', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '7px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#F5F5F0', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; e.currentTarget.style.background = 'rgba(245,166,35,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.background = 'transparent'; }}
          >
            All weekdays on
          </button>
          <button
            onClick={clearAll}
            style={{ background: 'transparent', border: '1px solid #2A2A2A', borderRadius: '10px', padding: '7px 14px', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888884', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,107,0.3)'; e.currentTarget.style.color = '#FF6B6B'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888884'; }}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* ── WEEKLY SUMMARY STRIP ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {Array.from({ length: 7 }, (_, i) => {
          const day = availability[i];
          const isToday = i === today;
          return (
            <div
              key={i}
              style={{ background: '#1A1A1A', border: `1px solid ${isToday ? 'rgba(245,166,35,0.4)' : '#2A2A2A'}`, borderRadius: '12px', padding: '8px 12px', textAlign: 'center', minWidth: '52px', flexShrink: 0 }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', margin: 0 }}>{DAY_SHORT[i]}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '5px' }}>
                {day?.dayOff ? (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#444440', lineHeight: 1 }}>—</span>
                ) : (
                  <>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: day?.morning ? '#F5A623' : '#2A2A2A', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: day?.afternoon ? '#60A5FA' : '#2A2A2A', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: day?.evening ? '#4CAF7D' : '#2A2A2A', display: 'inline-block', flexShrink: 0 }} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DAY ROWS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Array.from({ length: 7 }, (_, dayIndex) => {
          const day = availability[dayIndex];
          const isToday = dayIndex === today;
          const hasSlot = day?.morning || day?.afternoon || day?.evening;
          const isSaving = saving === dayIndex;
          const isSaved = saved === dayIndex;
          const borderColor = day?.dayOff ? 'rgba(255,107,107,0.15)' : hasSlot ? 'rgba(245,166,35,0.2)' : '#2A2A2A';

          return (
            <div
              key={dayIndex}
              style={{
                background: day?.dayOff ? '#161210' : '#1A1A1A',
                border: `1px solid ${borderColor}`,
                borderLeft: isToday ? '3px solid rgba(245,166,35,0.5)' : `1px solid ${borderColor}`,
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                transition: 'border-color 0.15s',
              }}
            >
              {/* LEFT — Day name + save indicator */}
              <div style={{ minWidth: '110px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#F5F5F0' }}>{DAY_NAMES[dayIndex]}</span>
                  {isToday && (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', color: '#000', background: '#F5A623', borderRadius: '20px', padding: '1px 7px', fontWeight: 700, flexShrink: 0 }}>Today</span>
                  )}
                </div>
                {isSaving && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                    <Loader2 size={11} className="animate-spin" style={{ color: '#888884' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884' }}>Saving…</span>
                  </div>
                )}
                {isSaved && !isSaving && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                    <CheckCircle2 size={11} style={{ color: '#4CAF7D' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#4CAF7D' }}>Saved</span>
                  </div>
                )}
              </div>

              {/* CENTER — Slot buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                {SLOT_CFG.map(({ field, label, color, text }) => {
                  const isActive = !!day?.[field] && !day?.dayOff;
                  return (
                    <button
                      key={field}
                      onClick={() => handleToggle(dayIndex, field)}
                      disabled={!!day?.dayOff}
                      style={{
                        borderRadius: '20px',
                        padding: '5px 14px',
                        border: isActive ? 'none' : '1px solid #2A2A2A',
                        background: isActive ? color : 'transparent',
                        color: isActive ? text : '#444440',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: day?.dayOff ? 'not-allowed' : 'pointer',
                        opacity: day?.dayOff ? 0.35 : 1,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!day?.dayOff && !isActive) { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'; e.currentTarget.style.color = '#888884'; } }}
                      onMouseLeave={e => { if (!day?.dayOff && !isActive) { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#444440'; } }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* RIGHT — Day off toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', whiteSpace: 'nowrap' }}>Day off</span>
                <ToggleSwitch on={!!day?.dayOff} onClick={() => handleToggle(dayIndex, 'dayOff')} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LEGEND ── */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
        {[{ color: '#F5A623', label: 'Morning' }, { color: '#60A5FA', label: 'Afternoon' }, { color: '#4CAF7D', label: 'Evening' }].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
