'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  UserCircle,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
  { href: '/dashboard/availability', icon: CalendarDays, label: 'Availability' },
  { href: '/dashboard/requests', icon: Bell, label: 'Requests' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase();
}

export default function Sidebar({ provider, pendingCount, subscription }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 flex-col z-40"
      style={{ width: '240px', background: '#0A0A0A', borderRight: '1px solid #1A1A1A' }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 20px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, margin: 0, lineHeight: 1 }}>
          <span style={{ color: '#F5F5F0' }}>Swat</span>
          <span style={{ color: '#F5A623' }}>antra</span>
        </h1>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(245,166,35,0.3), transparent)', marginTop: '14px' }} />
      </div>

      {/* Provider card */}
      <div style={{ margin: '14px 10px 4px', padding: '12px', background: 'linear-gradient(135deg, #1A1A0E, #141410)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Avatar with conic-gradient ring */}
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'conic-gradient(#F5A623 0deg, #FFD580 120deg, #1A1A1A 120deg)', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {provider?.photo_url ? (
                <img src={provider.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#F5A623' }}>{getInitials(provider?.name)}</span>
              )}
            </div>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: '#F5F5F0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {provider?.name || 'Provider'}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#888884', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {[provider?.service, provider?.city].filter(Boolean).join(' · ') || 'Service Provider'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#4CAF7D' }}>Profile live</span>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: '8px 10px', marginTop: '8px', flex: 1, overflow: 'hidden' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', color: '#444440', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 8px', margin: '0 0 8px 0' }}>MENU</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="transition-all duration-150"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '12px',
                marginBottom: '2px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                textDecoration: 'none',
                color: active ? '#F5A623' : '#555552',
                background: active
                  ? 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(245,166,35,0.06))'
                  : 'transparent',
                border: active ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent',
                boxShadow: active ? '0 0 20px rgba(245,166,35,0.06) inset' : 'none',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#888884';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#555552';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={18} style={{ color: active ? '#F5A623' : '#555552', flexShrink: 0, transition: 'color 0.15s' }} />
              <span>{item.label}</span>
              {item.label === 'Requests' && pendingCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    right: '8px',
                    width: '18px',
                    height: '18px',
                    background: '#FF6B6B',
                    color: '#fff',
                    borderRadius: '50%',
                    fontFamily: 'var(--font-display)',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom section */}
      <div style={{ padding: '12px', marginTop: 'auto' }}>
        {/* Subscription status */}
        {subscription?.status === 'active' ? (
          <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(76,175,125,0.08)', border: '1px solid rgba(76,175,125,0.2)', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF7D', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: '#4CAF7D', fontWeight: 700 }}>Active</span>
            </div>
            {subscription.expires_at && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#888884', margin: 0 }}>Valid until {formatDate(subscription.expires_at)}</p>
            )}
          </div>
        ) : (
          <button
            style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'var(--font-display)', fontSize: '11px', color: '#F5A623', cursor: 'pointer', marginBottom: '8px', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,166,35,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245,166,35,0.08)'; }}
          >
            Upgrade Plan
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #1E1E1E', background: 'transparent', color: '#555552', fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B6B'; e.currentTarget.style.borderColor = 'rgba(255,107,107,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#555552'; e.currentTarget.style.borderColor = '#1E1E1E'; }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
