'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export default function LangPromptBanner() {
  const [visible, setVisible] = useState(false);
  const { changeLang } = useLanguage();

  useEffect(() => {
    if (!sessionStorage.getItem('langPromptShown')) {
      setVisible(true);
      sessionStorage.setItem('langPromptShown', 'true');
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLang = async (code) => {
    changeLang(code);
    setVisible(false);
    try {
      await fetch('/api/provider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: code }),
      });
    } catch {}
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '76px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        background: '#1a1a1a',
        border: '1px solid rgba(245,166,35,0.35)',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        maxWidth: 'calc(100vw - 32px)',
        width: 'max-content',
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888884', whiteSpace: 'nowrap' }}>
        हिंदी में देख रहे हैं · Switch to:
      </span>
      <div style={{ display: 'flex', gap: '6px' }}>
        {LANGS.map(l => (
          <button
            key={l.code}
            onClick={() => handleLang(l.code)}
            style={{
              background: 'rgba(245,166,35,0.1)',
              border: '1px solid rgba(245,166,35,0.25)',
              borderRadius: '8px',
              padding: '5px 12px',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#F5A623',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.1)'; }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#555',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#888884'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#555'; }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
