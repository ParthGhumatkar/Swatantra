import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verifyToken(token);
  
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/provider/:path*',
    '/api/bookings/:path*',
    '/api/availability/:path*',
    '/api/auth/logout:path*',
    '/api/auth/change-pin:path*',
    '/api/upload/:path*',
  ],
};
