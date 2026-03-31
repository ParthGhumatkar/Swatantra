import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import sql from '@/lib/db';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import LanguageWrapper from './LanguageWrapper';
import LangPromptBanner from '@/components/dashboard/LangPromptBanner';

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  const providerResult = await sql`
    SELECT id, name, slug, service, city, photo_url, language
    FROM providers
    WHERE id = ${payload.provider_id}
    LIMIT 1
  `;

  if (providerResult.length === 0) {
    redirect('/login');
  }

  const provider = providerResult[0];

  const pendingResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM booking_requests
    WHERE provider_id = ${provider.id} AND status = 'pending'
  `;
  const pendingCount = pendingResult[0]?.count || 0;

  const subResult = await sql`
    SELECT status, plan, expires_at
    FROM subscriptions
    WHERE provider_id = ${provider.id}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const subscription = subResult.length > 0 ? subResult[0] : null;

  const p = JSON.parse(JSON.stringify(provider));
  const s = subscription ? JSON.parse(JSON.stringify(subscription)) : null;

  return (
    <LanguageWrapper initialLang={provider.language ?? 'hi'}>
      <div className="grain-overlay" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Sidebar provider={p} pendingCount={pendingCount} subscription={s} />
        <main className="md:ml-[240px] min-h-screen">
          <div className="mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-24 md:pb-12" style={{ maxWidth: '960px' }}>
            {children}
          </div>
        </main>
        <MobileNav pendingCount={pendingCount} />
        <LangPromptBanner />
      </div>
    </LanguageWrapper>
  );
}
