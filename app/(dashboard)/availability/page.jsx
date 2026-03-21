'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/lib/i18n';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AvailabilityPage() {
  const t = getTranslations('en');
  const [availability, setAvailability] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = async () => {
    const res = await fetch('/api/provider');
    if (res.ok) {
      const data = await res.json();
      setProviderId(data.provider.id);
      fetchAvailability(data.provider.id);
    }
  };

  const fetchAvailability = async (id) => {
    const res = await fetch(`/api/availability?provider_id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setAvailability(data.availability);
    }
  };

  const toggleSlot = (dayIndex, slot) => {
    const updated = [...availability];
    updated[dayIndex] = {
      ...updated[dayIndex],
      [slot]: !updated[dayIndex][slot],
    };
    setAvailability(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability }),
      });

      if (res.ok) {
        setMessage(t.availability.saved);
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (availability.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t.availability.title}
      </h1>

      <Card>
        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {availability.map((day, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium text-gray-900 mb-3">
                  {t.availability.days[day.day_of_week]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={day.morning}
                      onChange={() => toggleSlot(index, 'morning')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t.availability.morning}
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={day.afternoon}
                      onChange={() => toggleSlot(index, 'afternoon')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t.availability.afternoon}
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={day.evening}
                      onChange={() => toggleSlot(index, 'evening')}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t.availability.evening}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : t.availability.save}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
