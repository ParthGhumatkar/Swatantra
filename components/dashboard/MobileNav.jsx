'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  UserCircle,
  CalendarDays,
  Bell,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
  { href: '/dashboard/availability', icon: CalendarDays, label: 'Schedule' },
  { href: '/dashboard/requests', icon: Bell, label: 'Requests' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function MobileNav({ pendingCount }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #1A1A1A',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '100%', padding: '0 4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '6px 12px',
                textDecoration: 'none',
                position: 'relative',
                color: active ? '#F5A623' : '#444440',
                transition: 'color 0.15s',
              }}
            >
              {active && (
                <span style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', borderRadius: '50%', background: '#F5A623', display: 'block' }} />
              )}
              <Icon size={20} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', lineHeight: 1 }}>{item.label}</span>
              {item.label === 'Requests' && pendingCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#FF6B6B',
                    animation: 'pulseDot 2s ease-in-out infinite',
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
