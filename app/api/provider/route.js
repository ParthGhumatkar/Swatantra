import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
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

    const result = await sql`
      SELECT id, name, mobile, slug, service, city, area, description, experience, photo_url, language, whatsapp, created_at
      FROM providers
      WHERE id = ${payload.provider_id}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const subResult = await sql`
      SELECT status, plan, expires_at
      FROM subscriptions
      WHERE provider_id = ${payload.provider_id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return NextResponse.json({
      provider: result[0],
      subscription: subResult.length > 0 ? subResult[0] : null,
    });
  } catch (error) {
    console.error('Get provider error:', error);
    return NextResponse.json({ error: 'Failed to fetch provider' }, { status: 500 });
  }
}

export async function PATCH(request) {
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

    const body = await request.json();

    if (body.name && body.name.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 });
    }

    if (body.description && body.description.length > 500) {
      return NextResponse.json({ error: 'Description must be 500 characters or less' }, { status: 400 });
    }

    const allowedFields = ['name', 'service', 'city', 'area', 'description', 'experience', 'photo_url', 'language', 'whatsapp'];
    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const setClauses = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = [payload.provider_id, ...Object.values(updates)];

    const result = await sql(
      `UPDATE providers SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, mobile, name, slug, service, city, area, photo_url, language, whatsapp`,
      values
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, provider: result[0] });
  } catch (error) {
    console.error('Update provider error:', error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}
