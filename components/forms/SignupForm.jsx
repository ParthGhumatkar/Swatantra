'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { languages } from '@/lib/i18n';

export default function SignupForm({ t }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    mobile: '',
    name: '',
    pin: '',
    service: '',
    city: '',
    language: 'en',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Failed to create account');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label={t.signup.name_label}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        placeholder="Rohit Kumar"
      />

      <Input
        label={t.signup.mobile_label}
        type="tel"
        value={formData.mobile}
        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        required
        placeholder="1234567890"
      />

      <Input
        label={t.signup.pin_label}
        type="password"
        value={formData.pin}
        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
        required
        placeholder="****"
        minLength={4}
        maxLength={6}
      />

      <Input
        label={t.signup.service_label}
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        placeholder="Electrician"
      />

      <Input
        label={t.signup.city_label}
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        placeholder="Pune"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.signup.language_label}
        </label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : t.signup.submit}
      </Button>
    </form>
  );
}
