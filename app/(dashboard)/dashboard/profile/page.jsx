'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Check, Loader2, AlertCircle } from 'lucide-react';

const INPUT_STYLE = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s',
  fontSize: '14px',
  fontFamily: 'var(--font-dm-sans)',
};

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase();
}

export default function ProfilePage() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/provider').then(r => r.json()).then(d => {
      setProvider(d.provider || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const debouncedSave = useCallback((updates) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSaving(true);
      setSaved(false);
      setSaveError('');
      try {
        const res = await fetch('/api/provider', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Save failed');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        setSaveError('Failed to save');
      } finally {
        setSaving(false);
      }
    }, 1500);
  }, []);

  const updateField = (field, value) => {
    setProvider(prev => ({ ...prev, [field]: value }));
    debouncedSave({ [field]: value });
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!upRes.ok) throw new Error('Upload failed');
      const { url } = await upRes.json();
      await fetch('/api/provider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_url: url }),
      });
      setProvider(prev => ({ ...prev, photo_url: url }));
    } catch {
      setSaveError('Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (!provider) return <div className="text-center py-20 font-body" style={{ color: 'var(--text-secondary)' }}>Failed to load profile.</div>;

  const fields = [provider.name, provider.service, provider.city, provider.description, provider.experience, provider.photo_url];
  const filledCount = fields.filter(Boolean).length;
  const percent = Math.round((filledCount / 6) * 100);
  const descLen = (provider.description || '').length;

  return (
    <div className="space-y-6 fade-in-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>Edit Profile</h1>
          <p className="font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>Changes save automatically</p>
        </div>
        <div className="font-body text-[13px]">
          {saving && <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><Loader2 size={14} className="animate-spin" /> Saving...</span>}
          {saved && <span className="flex items-center gap-1" style={{ color: 'var(--mint)' }}><Check size={14} /> Saved ✓</span>}
          {saveError && <span className="flex items-center gap-1" style={{ color: 'var(--danger)' }}><AlertCircle size={14} /> {saveError}</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>{filledCount} of 6 fields complete</span>
          <span className="font-display text-[13px] font-bold" style={{ color: percent >= 100 ? 'var(--mint)' : 'var(--accent)' }}>{percent}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
          <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: percent >= 100 ? 'var(--mint)' : 'var(--accent)' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* LEFT — Photo */}
        <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="relative inline-block mb-4">
            {provider.photo_url ? (
              <img src={provider.photo_url} className="w-[120px] h-[120px] rounded-full object-cover mx-auto" style={{ boxShadow: '0 0 0 2px var(--accent)' }} alt="" />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mx-auto" style={{ background: 'var(--surface-2)', boxShadow: '0 0 0 2px var(--accent)' }}>
                <span className="font-display font-bold text-4xl" style={{ color: 'var(--accent)' }}>{getInitials(provider.name)}</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent)' }} />
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 mx-auto rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95"
            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.5)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Camera size={16} /> Change Photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <p className="font-mono text-[12px] mt-4" style={{ color: 'var(--text-secondary)' }}>
            {(process.env.NEXT_PUBLIC_APP_URL || 'https://swatantra.vercel.app').replace(/^https?:\/\//, '')}/p/{provider.slug}
          </p>
        </div>

        {/* RIGHT — Form */}
        <div className="space-y-5">
          <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {/* Name */}
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                value={provider.name || ''}
                onChange={e => updateField('name', e.target.value)}
                maxLength={100}
                style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Service */}
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Service Type</label>
              <input
                type="text"
                value={provider.service || ''}
                onChange={e => updateField('service', e.target.value)}
                placeholder="e.g. Electrician, Tutor, Hair Dresser"
                style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>City / Area</label>
              <input
                type="text"
                value={provider.city || ''}
                onChange={e => updateField('city', e.target.value)}
                placeholder="e.g. Pune, Baner"
                style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>About You</label>
              <textarea
                rows={4}
                value={provider.description || ''}
                onChange={e => updateField('description', e.target.value)}
                maxLength={500}
                placeholder="Tell customers about your experience and services..."
                style={{ ...INPUT_STYLE, resize: 'vertical' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <p className="text-right font-body text-[12px] mt-1" style={{ color: descLen > 400 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {descLen}/500
              </p>
            </div>

            {/* Experience */}
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Years of Experience</label>
              <input
                type="number"
                min={0}
                max={60}
                value={provider.experience ?? ''}
                onChange={e => updateField('experience', e.target.value ? parseInt(e.target.value) : null)}
                style={{ ...INPUT_STYLE, maxWidth: '120px' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Language Preference</label>
              <select
                value={provider.language || 'en'}
                onChange={e => updateField('language', e.target.value)}
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
