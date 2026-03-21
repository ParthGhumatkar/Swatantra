'use client';

import { useState, useEffect } from 'react';
import { getTranslations, languages } from '@/lib/i18n';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const t = getTranslations('en');
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [language, setLanguage] = useState('en');
  const [pinData, setPinData] = useState({ current: '', new: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = async () => {
    const res = await fetch('/api/provider');
    if (res.ok) {
      const data = await res.json();
      setProvider(data.provider);
      setLanguage(data.provider.language || 'en');
    }
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    const res = await fetch('/api/provider', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: newLang }),
    });

    if (res.ok) {
      setMessage('Language updated!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (!provider) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        {t.settings.title}
      </h1>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t.settings.language}
        </h2>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t.settings.subscription}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{t.settings.plan}</p>
            <p className="text-lg font-semibold text-gray-900">{t.settings.free}</p>
          </div>
        </div>
      </Card>

      <Card>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
