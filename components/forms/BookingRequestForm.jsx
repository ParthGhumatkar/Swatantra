'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function BookingRequestForm({ providerSlug, t }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_mobile: '',
    customer_address: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_slug: providerSlug,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send request');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        customer_name: '',
        customer_mobile: '',
        customer_address: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to send request');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
        {t.public.request_sent}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label={t.public.your_name}
        value={formData.customer_name}
        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
        required
      />

      <Input
        label={t.public.your_mobile}
        type="tel"
        value={formData.customer_mobile}
        onChange={(e) => setFormData({ ...formData, customer_mobile: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.public.your_address}
        </label>
        <textarea
          value={formData.customer_address}
          onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
      </div>

      <Input
        label={t.public.preferred_date}
        type="date"
        value={formData.preferred_date}
        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.public.preferred_time}
        </label>
        <select
          value={formData.preferred_time}
          onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select time</option>
          <option value="morning">Morning (9 AM - 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
          <option value="evening">Evening (5 PM - 8 PM)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.public.message}
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Sending...' : t.public.submit_request}
      </Button>
    </form>
  );
}
