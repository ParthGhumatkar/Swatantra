import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');

    let bookings = await sql`
      SELECT id, customer_name, customer_mobile, message, status, created_at
      FROM booking_requests
      WHERE provider_id = ${payload.provider_id}
      ORDER BY created_at DESC
    `;

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;

    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    if (limit) {
      bookings = bookings.slice(0, parseInt(limit));
    }

    return NextResponse.json({ bookings, total, pending });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { provider_slug, customer_name, customer_mobile, message } = await request.json();

    if (!provider_slug || !customer_mobile) {
      return NextResponse.json(
        { error: 'Provider slug and customer mobile are required' },
        { status: 400 }
      );
    }

    const providerResult = await sql`
      SELECT id FROM providers WHERE slug = ${provider_slug} LIMIT 1
    `;

    if (providerResult.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const providerId = providerResult[0].id;

    await sql`
      INSERT INTO booking_requests (provider_id, customer_name, customer_mobile, message, status, seen)
      VALUES (${providerId}, ${customer_name || 'Anonymous'}, ${customer_mobile}, ${message || null}, 'pending', false)
    `;

    return NextResponse.json({ success: true, message: 'Request sent successfully' });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking request' }, { status: 500 });
  }
}
