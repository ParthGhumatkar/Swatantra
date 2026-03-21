'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

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

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}

function StyledInput({ ...props }) {
  return (
    <input
      {...props}
      style={INPUT_STYLE}
      onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

export default function SignupPage() {
  const [form, setForm] = useState({
    mobile: '', name: '', pin: '', confirmPin: '', service: '', city: '', language: 'en',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.pin !== form.confirmPin) {
      setError('PINs do not match');
      return;
    }
    if (form.pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: form.mobile,
          name: form.name,
          pin: form.pin,
          service: form.service,
          city: form.city,
          language: form.language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    } catch {
      setError('Failed to create account');
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen grain-overlay flex items-center justify-center p-4 py-8" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div
          className="rounded-2xl p-8 fade-in-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h1 className="font-display text-[22px] font-bold mb-6">
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#F5F5F0', letterSpacing: '-0.02em' }}>Swatantra<span style={{ color: '#F5A623' }}>.</span></span>
          </h1>

          <h2 className="font-display text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>Create your account</h2>
          <p className="font-body text-[14px] mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>Start receiving bookings today</p>

          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm font-body"
              style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,107,107,0.3)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Mobile Number">
              <StyledInput type="tel" value={form.mobile} onChange={set('mobile')} required placeholder="Mobile number" />
            </Field>
            <Field label="Full Name">
              <StyledInput type="text" value={form.name} onChange={set('name')} required placeholder="Your full name" />
            </Field>
            <Field label="PIN (4-6 digits)">
              <StyledInput type="password" value={form.pin} onChange={set('pin')} required placeholder="Create a PIN" minLength={4} maxLength={6} />
            </Field>
            <Field label="Confirm PIN">
              <StyledInput type="password" value={form.confirmPin} onChange={set('confirmPin')} required placeholder="Confirm your PIN" minLength={4} maxLength={6} />
            </Field>
            <Field label="Service Type">
              <StyledInput type="text" value={form.service} onChange={set('service')} placeholder="e.g. Electrician, Tutor" />
            </Field>
            <Field label="City">
              <StyledInput type="text" value={form.city} onChange={set('city')} placeholder="e.g. Pune" />
            </Field>
            <Field label="Language">
              <select
                value={form.language}
                onChange={set('language')}
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150 active:scale-95 hover:bg-amber-400 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--accent)' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
