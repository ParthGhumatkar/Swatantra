'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginForm({ t }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ mobile: '', pin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.login.error);
        setLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(t.login.error);
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
        label={t.login.mobile_label}
        type="tel"
        value={formData.mobile}
        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        required
        placeholder="1234567890"
      />

      <Input
        label={t.login.pin_label}
        type="password"
        value={formData.pin}
        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
        required
        placeholder="****"
        maxLength={6}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : t.login.submit}
      </Button>
    </form>
  );
}
