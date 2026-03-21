import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { hashPin, signToken } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';

export async function POST(request) {
  try {
    const { mobile, name, pin, service, city, language } = await request.json();

    if (!mobile || !name || !pin) {
      return NextResponse.json(
        { error: 'Mobile, name, and PIN are required' },
        { status: 400 }
      );
    }

    if (pin.length < 4 || pin.length > 6) {
      return NextResponse.json(
        { error: 'PIN must be 4-6 digits' },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id FROM providers WHERE mobile = ${mobile} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Mobile number already registered' },
        { status: 409 }
      );
    }

    const pinHash = await hashPin(pin);
    const slug = await generateUniqueSlug(name, service, city);

    const result = await sql`
      INSERT INTO providers (mobile, name, pin_hash, slug, service, city, language)
      VALUES (${mobile}, ${name}, ${pinHash}, ${slug}, ${service || null}, ${city || null}, ${language || 'en'})
      RETURNING id, mobile, name, slug, service, city, language
    `;

    const provider = result[0];

    await sql`
      INSERT INTO availability (provider_id, day_of_week, morning, afternoon, evening)
      VALUES 
        (${provider.id}, 0, false, false, false),
        (${provider.id}, 1, false, false, false),
        (${provider.id}, 2, false, false, false),
        (${provider.id}, 3, false, false, false),
        (${provider.id}, 4, false, false, false),
        (${provider.id}, 5, false, false, false),
        (${provider.id}, 6, false, false, false)
    `;

    await sql`
      INSERT INTO subscriptions (provider_id, status, plan)
      VALUES (${provider.id}, 'active', 'free')
    `;

    const token = await signToken({
      provider_id: provider.id,
      mobile: provider.mobile,
      slug: provider.slug,
    });

    const response = NextResponse.json({
      success: true,
      provider: {
        id: provider.id,
        name: provider.name,
        mobile: provider.mobile,
        slug: provider.slug,
        service: provider.service,
        city: provider.city,
        language: provider.language,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
