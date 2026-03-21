'use client';

import Link from 'next/link';

export default function StatCard({ href, children, className = '', delay = '' }) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl p-6 transition-all duration-200 cursor-pointer active:scale-[0.98] ${delay} ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)';
        e.currentTarget.style.boxShadow = '0 0 24px rgba(245,166,35,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </Link>
  );
}
