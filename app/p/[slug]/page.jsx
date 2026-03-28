import { notFound } from 'next/navigation';
import sql from '@/lib/db';
import PublicProfileClient from './PublicProfileClient';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function getProvider(slug) {
  const result = await sql`
    SELECT id, name, slug, service, city, description, experience, photo_url, mobile, whatsapp
    FROM providers
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return result.length > 0 ? result[0] : null;
}

async function getAvailability(providerId) {
  await sql`ALTER TABLE availability ADD COLUMN IF NOT EXISTS day_off BOOLEAN DEFAULT false`;
  await sql`ALTER TABLE availability ADD COLUMN IF NOT EXISTS time_slots TEXT[] DEFAULT '{}'`;
  const rows = await sql`
    SELECT day_of_week, morning, afternoon, evening, day_off, time_slots
    FROM availability
    WHERE provider_id = ${providerId}
    ORDER BY day_of_week
  `;
  const map = {};
  for (let i = 0; i < 7; i++) {
    const row = rows.find(r => r.day_of_week === i);
    map[i] = {
      morning: !!row?.morning,
      afternoon: !!row?.afternoon,
      evening: !!row?.evening,
      dayOff: !!row?.day_off,
      timeSlots: row?.time_slots ?? [],
    };
  }
  return map;
}

async function getSubscription(providerId) {
  const result = await sql`
    SELECT status, expires_at FROM subscriptions
    WHERE provider_id = ${providerId}
    ORDER BY created_at DESC LIMIT 1
  `;
  return result.length > 0 ? result[0] : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return { title: 'Provider Not Found' };
  return {
    title: `${provider.name} — ${provider.service || 'Service Provider'} in ${provider.city || 'India'}`,
    description: `${provider.name} is a ${provider.service || 'service provider'} in ${provider.city || 'India'}. Book an appointment directly.`,
    openGraph: {
      title: `${provider.name} — ${provider.service || 'Service Provider'}`,
      description: `Book ${provider.service || 'services'} with ${provider.name}`,
      images: provider.photo_url ? [{ url: provider.photo_url }] : [],
    },
  };
}

export default async function PublicProfilePage({ params }) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) notFound();

  const sub = await getSubscription(provider.id);
  if (sub && sub.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center px-4">
          <h1 className="font-display text-[24px] font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Profile Inactive</h1>
          <p className="font-body text-[14px]" style={{ color: 'var(--text-secondary)' }}>This profile is currently inactive.</p>
        </div>
      </div>
    );
  }

  const availability = await getAvailability(provider.id);

  return (
    <PublicProfileClient
      provider={JSON.parse(JSON.stringify(provider))}
      availability={JSON.parse(JSON.stringify(availability))}
    />
  );
}
