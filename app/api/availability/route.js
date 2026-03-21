import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function buildMap(rows) {
  const map = {};
  for (let i = 0; i < 7; i++) {
    const row = rows.find(r => r.day_of_week === i);
    map[i] = {
      morning: !!row?.morning,
      afternoon: !!row?.afternoon,
      evening: !!row?.evening,
      dayOff: !!row?.day_off,
    };
  }
  return map;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicProviderId = searchParams.get('provider_id');

    let providerId;
    if (publicProviderId) {
      providerId = publicProviderId;
    } else {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const payload = await verifyToken(token);
      if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      providerId = payload.provider_id;
    }

    let rows = await sql`
      SELECT day_of_week, morning, afternoon, evening, day_off
      FROM availability
      WHERE provider_id = ${providerId}
      ORDER BY day_of_week ASC
    `;

    if (rows.length < 7) {
      await sql`
        INSERT INTO availability (provider_id, day_of_week, morning, afternoon, evening, day_off)
        VALUES
          (${providerId}, 0, false, false, false, false),
          (${providerId}, 1, false, false, false, false),
          (${providerId}, 2, false, false, false, false),
          (${providerId}, 3, false, false, false, false),
          (${providerId}, 4, false, false, false, false),
          (${providerId}, 5, false, false, false, false),
          (${providerId}, 6, false, false, false, false)
        ON CONFLICT (provider_id, day_of_week) DO NOTHING
      `;
      rows = await sql`
        SELECT day_of_week, morning, afternoon, evening, day_off
        FROM availability
        WHERE provider_id = ${providerId}
        ORDER BY day_of_week ASC
      `;
    }

    return NextResponse.json({ availability: buildMap(rows) });
  } catch (error) {
    console.error('Get availability error:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { dayOfWeek, morning, afternoon, evening, dayOff } = body;

    if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: 'dayOfWeek must be 0–6' }, { status: 400 });
    }

    const m = !!morning;
    const af = !!afternoon;
    const ev = !!evening;
    const off = !!dayOff;

    const updated = await sql`
      INSERT INTO availability (provider_id, day_of_week, morning, afternoon, evening, day_off)
      VALUES (${payload.provider_id}, ${dayOfWeek}, ${m}, ${af}, ${ev}, ${off})
      ON CONFLICT (provider_id, day_of_week)
      DO UPDATE SET morning = ${m}, afternoon = ${af}, evening = ${ev}, day_off = ${off}
      RETURNING day_of_week, morning, afternoon, evening, day_off
    `;

    return NextResponse.json({ success: true, day: updated[0] });
  } catch (error) {
    console.error('Update availability error:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
