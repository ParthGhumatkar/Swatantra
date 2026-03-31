'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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

export default function SettingsPage() {
  const { lang, t, changeLang } = useLanguage();
  const [provider, setProvider] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const [langSaving, setLangSaving] = useState(false);
  const [langSaved, setLangSaved] = useState(false);

  const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' });
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMsg, setPinMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/provider')
      .then(r => r.json())
      .then(d => {
        setProvider(d.provider || null);
        setSubscription(d.subscription || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateLanguage = async (newLang) => {
    changeLang(newLang);
    setProvider(prev => ({ ...prev, language: newLang }));
    setLangSaving(true);
    setLangSaved(false);
    try {
      await fetch('/api/provider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang }),
      });
      setLangSaved(true);
      setTimeout(() => setLangSaved(false), 2000);
    } catch { /* ignore */ }
    finally { setLangSaving(false); }
  };

  const changePin = async (e) => {
    e.preventDefault();
    setPinMsg({ type: '', text: '' });

    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinMsg({ type: 'error', text: 'New PIN and confirmation do not match' });
      return;
    }
    if (pinForm.newPin.length < 4 || pinForm.newPin.length > 6) {
      setPinMsg({ type: 'error', text: 'PIN must be 4-6 digits' });
      return;
    }

    setPinLoading(true);
    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pinForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setPinMsg({ type: 'error', text: data.error || 'Failed to change PIN' });
      } else {
        setPinMsg({ type: 'success', text: 'PIN updated successfully' });
        setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      }
    } catch {
      setPinMsg({ type: 'error', text: 'Failed to change PIN' });
    } finally {
      setPinLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Logout from all devices?')) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  const langs = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="space-y-8 fade-in-1" style={{ maxWidth: '640px' }}>
      <h1 className="font-display text-[24px] font-bold" style={{ color: 'var(--text-primary)' }}>{t.settings.title}</h1>

      {/* Language */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>{t.settings.interface_language}</h2>
          {langSaving && <span className="flex items-center gap-1 text-[12px] font-body" style={{ color: 'var(--text-secondary)' }}><Loader2 size={12} className="animate-spin" /> {t.settings.saving}</span>}
          {langSaved && <span className="flex items-center gap-1 text-[12px] font-body" style={{ color: 'var(--mint)' }}><Check size={12} /> {t.settings.saved}</span>}
        </div>
        <div className="flex flex-wrap gap-3" style={{ maxWidth: '480px' }}>
          {langs.map(l => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => updateLanguage(l.code)}
                className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{
                  flex: 1,
                  minWidth: '100px',
                  justifyContent: 'center',
                  border: active ? '2px solid var(--accent)' : '1px solid var(--border)',
                  color: active ? 'var(--accent)' : 'var(--text-primary)',
                  background: active ? 'var(--accent-dim)' : 'transparent',
                }}
              >
                {active && <Check size={14} />}
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Change PIN */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="font-display text-[16px] font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.settings.change_pin}</h2>

        {pinMsg.text && (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm font-body"
            style={{
              background: pinMsg.type === 'error' ? 'rgba(255,107,107,0.1)' : 'rgba(76,175,125,0.1)',
              color: pinMsg.type === 'error' ? 'var(--danger)' : 'var(--mint)',
              border: `1px solid ${pinMsg.type === 'error' ? 'rgba(255,107,107,0.3)' : 'rgba(76,175,125,0.3)'}`,
            }}
          >
            {pinMsg.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            {pinMsg.text}
          </div>
        )}

        <form onSubmit={changePin} className="space-y-4">
          <div>
            <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.settings.current_pin}</label>
            <input
              type="password"
              maxLength={6}
              value={pinForm.currentPin}
              onChange={e => setPinForm(p => ({ ...p, currentPin: e.target.value }))}
              required
              style={{ ...INPUT_STYLE, maxWidth: '320px' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.settings.new_pin}</label>
            <input
              type="password"
              minLength={4}
              maxLength={6}
              value={pinForm.newPin}
              onChange={e => setPinForm(p => ({ ...p, newPin: e.target.value }))}
              required
              style={{ ...INPUT_STYLE, maxWidth: '320px' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div>
            <label className="block font-body text-[12px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>{t.settings.confirm_pin}</label>
            <input
              type="password"
              minLength={4}
              maxLength={6}
              value={pinForm.confirmPin}
              onChange={e => setPinForm(p => ({ ...p, confirmPin: e.target.value }))}
              required
              style={{ ...INPUT_STYLE, maxWidth: '320px' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(245,166,35,0.6)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <button
            type="submit"
            disabled={pinLoading}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95 hover:bg-amber-400"
            style={{ background: 'var(--accent)', color: '#000' }}
          >
            {pinLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            {t.settings.update_pin}
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="font-display text-[16px] font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.settings.your_plan}</h2>
        <div className="rounded-xl p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          {subscription?.status === 'active' ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(76,175,125,0.2)', color: 'var(--mint)' }}>Active</span>
                <span className="font-body text-[13px] capitalize" style={{ color: 'var(--text-primary)' }}>{subscription.plan || 'Free'} Plan</span>
              </div>
              <p className="font-body text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Valid until {formatDate(subscription.expires_at)}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  {subscription ? 'Expired' : 'Free'}
                </span>
              </div>
              <p className="font-body text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
                {subscription ? 'Renew to keep your profile live' : 'You are on the free plan'}
              </p>
              <button
                className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(245,166,35,0.3)' }}
              >
                Manage Subscription
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid rgba(255,107,107,0.3)' }}>
        <h2 className="font-display text-[16px] font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t.settings.account}</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95"
          style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,107,107,0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; }}
        >
          <LogOut size={16} />
          {t.settings.logout}
        </button>
      </div>
    </div>
  );
}
