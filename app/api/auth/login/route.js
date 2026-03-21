import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { comparePin, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { mobile, pin } = await request.json();

    if (!mobile || !pin) {
      return NextResponse.json(
        { error: 'Mobile and PIN are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id, mobile, name, slug, pin_hash, service, city, language, photo_url
      FROM providers
      WHERE mobile = ${mobile}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invalid mobile or PIN' },
        { status: 401 }
      );
    }

    const provider = result[0];
    const isValidPin = await comparePin(pin, provider.pin_hash);

    if (!isValidPin) {
      return NextResponse.json(
        { error: 'Invalid mobile or PIN' },
        { status: 401 }
      );
    }

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
        photo_url: provider.photo_url,
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
