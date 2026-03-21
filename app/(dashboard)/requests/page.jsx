'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/lib/i18n';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function RequestsPage() {
  const t = getTranslations('en');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings);
    }
    setLoading(false);
  };

  const updateBooking = async (id, updates) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      fetchBookings();
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      seen: 'primary',
      completed: 'success',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {t.requests.status[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t.requests.title}
      </h1>

      {bookings.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">{t.requests.no_requests}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.customer_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {t.requests.mobile}
                  </p>
                  <p className="text-sm text-gray-900">{booking.customer_mobile}</p>
                </div>

                {booking.preferred_date && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t.requests.date}
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(booking.preferred_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {booking.preferred_time && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t.requests.time}
                    </p>
                    <p className="text-sm text-gray-900">{booking.preferred_time}</p>
                  </div>
                )}

                {booking.customer_address && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {t.requests.address}
                    </p>
                    <p className="text-sm text-gray-900">{booking.customer_address}</p>
                  </div>
                )}
              </div>

              {booking.message && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    {t.requests.message}
                  </p>
                  <p className="text-sm text-gray-900">{booking.message}</p>
                </div>
              )}

              <div className="flex gap-2">
                {booking.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateBooking(booking.id, { status: 'seen', seen: true })}
                  >
                    {t.requests.mark_seen}
                  </Button>
                )}
                {booking.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => updateBooking(booking.id, { status: 'completed' })}
                  >
                    {t.requests.mark_done}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
