import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import sql from '@/lib/db';

export async function POST(request) {
  try {
    const { mobile, newPin } = await request.json();

    if (!mobile || !newPin) {
      return NextResponse.json({ error: 'Mobile and new PIN are required' }, { status: 400 });
    }

    if (newPin.length < 4 || newPin.length > 6) {
      return NextResponse.json({ error: 'PIN must be 4-6 digits' }, { status: 400 });
    }

    const providers = await sql`
      SELECT id FROM providers WHERE mobile = ${mobile}
    `;

    if (providers.length === 0) {
      return NextResponse.json({ error: 'Mobile number not found' }, { status: 404 });
    }

    const pin_hash = await bcrypt.hash(newPin, 10);

    await sql`
      UPDATE providers SET pin_hash = ${pin_hash} WHERE mobile = ${mobile}
    `;

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Reset PIN error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
