import { nanoid } from 'nanoid';
import sql from './db';

function sanitize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function generateUniqueSlug(name, service, city) {
  const parts = [
    sanitize(name),
    service ? sanitize(service) : null,
    city ? sanitize(city) : null,
  ].filter(Boolean);

  let baseSlug = parts.join('-');
  let slug = baseSlug;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await sql`
      SELECT id FROM providers WHERE slug = ${slug} LIMIT 1
    `;

    if (existing.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${nanoid(4)}`;
    attempts++;
  }

  return `${baseSlug}-${nanoid(6)}`;
}
