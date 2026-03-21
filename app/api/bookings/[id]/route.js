import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PATCH(request, { params }) {
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

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['done', 'declined', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = await sql`
      UPDATE booking_requests
      SET status = ${status}
      WHERE id = ${id} AND provider_id = ${payload.provider_id}
      RETURNING id, customer_name, customer_mobile, message, status, created_at
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
