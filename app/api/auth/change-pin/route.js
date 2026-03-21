import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import { verifyToken, comparePin, hashPin } from '@/lib/auth';

export async function POST(request) {
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

    const { currentPin, newPin, confirmPin } = await request.json();

    if (!currentPin || !newPin || !confirmPin) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPin !== confirmPin) {
      return NextResponse.json({ error: 'New PIN and confirmation do not match' }, { status: 400 });
    }

    if (newPin.length < 4 || newPin.length > 6) {
      return NextResponse.json({ error: 'PIN must be 4-6 digits' }, { status: 400 });
    }

    const result = await sql`
      SELECT pin_hash FROM providers WHERE id = ${payload.provider_id} LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const isValid = await comparePin(currentPin, result[0].pin_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current PIN is incorrect' }, { status: 401 });
    }

    const newHash = await hashPin(newPin);

    await sql`
      UPDATE providers SET pin_hash = ${newHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${payload.provider_id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change PIN error:', error);
    return NextResponse.json({ error: 'Failed to change PIN' }, { status: 500 });
  }
}
