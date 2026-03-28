'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_DAY = { dayOff: true, timeSlots: [] };
const DEFAULT_AVAIL = Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i, { ...DEFAULT_DAY }]));

const ALL_SLOTS = [];
for (let h = 6; h <= 22; h++) {
  for (const m of [0, 30]) {
    if (h === 22 && m === 30) break;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    ALL_SLOTS.push(`${hh}:${mm}`);
  }
}

function to12hr(t) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

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
            map[i] = {
              dayOff: row?.dayOff === undefined ? true : !!row?.dayOff,
              timeSlots: Array.isArray(row?.timeSlots) ? row.timeSlots : [],
            };
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
      body: JSON.stringify({
        dayOfWeek: dayIndex,
        dayOff: !!updated.dayOff,
        timeSlots: Array.isArray(updated.timeSlots) ? updated.timeSlots : [],
      }),
    });

  const setDay = async (dayIndex, nextDay, previousDay) => {
    setAvailability(prev => ({ ...prev, [dayIndex]: nextDay }));
    setSaving(dayIndex);
    try {
      await patchDay(dayIndex, nextDay);
      setSaving(null);
      setSaved(dayIndex);
      setTimeout(() => setSaved(s => s === dayIndex ? null : s), 2000);
    } catch {
      setAvailability(prev => ({ ...prev, [dayIndex]: previousDay }));
      setSaving(null);
    }
  };

  const toggleDayOff = async (dayIndex) => {
    const current = availability[dayIndex];
    const next = current.dayOff
      ? { ...current, dayOff: false }
      : { dayOff: true, timeSlots: [] };
    await setDay(dayIndex, next, current);
  };

  const toggleSlot = async (dayIndex, slot) => {
    const current = availability[dayIndex];
    const set = new Set(Array.isArray(current.timeSlots) ? current.timeSlots : []);
    if (set.has(slot)) set.delete(slot);
    else set.add(slot);
    const nextSlots = Array.from(set).sort();
    const next = { dayOff: false, timeSlots: nextSlots };
    await setDay(dayIndex, next, current);
  };

  const setAllWeekdays = async () => {
    if (!confirm('Set Mon–Fri as available?')) return;
    const next = { ...availability };
    [1, 2, 3, 4, 5].forEach(d => { next[d] = { dayOff: false, timeSlots: [] }; });
    setAvailability(next);
    for (const d of [1, 2, 3, 4, 5]) await patchDay(d, next[d]);
  };

  const clearAll = async () => {
    if (!confirm('Clear all availability?')) return;
    const cleared = {};
    for (let i = 0; i < 7; i++) cleared[i] = { dayOff: true, timeSlots: [] };
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
                {!day || day?.dayOff || (Array.isArray(day?.timeSlots) && day.timeSlots.length === 0) ? (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#444440', lineHeight: 1 }}>—</span>
                ) : (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5A623', display: 'inline-block', flexShrink: 0 }} />
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
          const hasSlot = Array.isArray(day?.timeSlots) && day.timeSlots.length > 0;
          const isSaving = saving === dayIndex;
          const isSaved = saved === dayIndex;
          const borderColor = day?.dayOff ? 'rgba(255,107,107,0.15)' : hasSlot ? 'rgba(245,166,35,0.2)' : '#2A2A2A';

          return (
            <div
              key={dayIndex}
              style={{
                background: day?.dayOff ? '#161210' : '#1A1A1A',
                borderTop: `1px solid ${borderColor}`,
                borderRight: `1px solid ${borderColor}`,
                borderBottom: `1px solid ${borderColor}`,
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

              {/* CENTER — Slot pills */}
              {!day?.dayOff && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                  {ALL_SLOTS.map((slot) => {
                    const isActive = Array.isArray(day?.timeSlots) && day.timeSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(dayIndex, slot)}
                        style={{
                          borderRadius: '9999px',
                          padding: '6px 12px',
                          border: isActive ? '1px solid rgba(245,166,35,0.8)' : '1px solid #2A2A2A',
                          background: isActive ? 'rgba(245,166,35,0.08)' : 'transparent',
                          color: isActive ? '#F5A623' : '#888884',
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)';
                            e.currentTarget.style.color = '#F5F5F0';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = '#2A2A2A';
                            e.currentTarget.style.color = '#888884';
                          }
                        }}
                      >
                        {to12hr(slot)}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* RIGHT — Day off toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884', whiteSpace: 'nowrap' }}>Day off</span>
                <ToggleSwitch on={!!day?.dayOff} onClick={() => toggleDayOff(dayIndex)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LEGEND ── */}
      <div style={{ marginTop: '20px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#888884' }}>
          Tap a time slot to mark yourself available. Changes save instantly.
        </span>
      </div>
    </div>
  );
}
