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

export default function LoginPage() {
  const [form, setForm] = useState({ mobile: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    } catch {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

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

          <h2 className="font-display text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
          <p className="font-body text-[14px] mt-1 mb-6" style={{ color: 'var(--text-secondary)' }}>Sign in to your dashboard</p>

          {error && (
            <div
              className="rounded-xl px-4 py-3 mb-4 text-sm font-body"
              style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,107,107,0.3)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Mobile Number</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                required
                placeholder="Mobile number"
                style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>PIN</label>
              <input
                type="password"
                value={form.pin}
                onChange={e => setForm(f => ({ ...f, pin: e.target.value }))}
                required
                placeholder="Enter your PIN"
                maxLength={6}
                style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; e.target.style.boxShadow = '0 0 0 2px rgba(245,166,35,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150 active:scale-95 hover:bg-amber-400 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            New provider?{' '}
            <Link href="/signup" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--accent)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
