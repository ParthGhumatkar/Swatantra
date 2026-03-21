'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/lib/i18n';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function ProfilePage() {
  const t = getTranslations('en');
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    city: '',
    area: '',
    whatsapp: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = async () => {
    const res = await fetch('/api/provider');
    if (res.ok) {
      const data = await res.json();
      setProvider(data.provider);
      setFormData({
        name: data.provider.name || '',
        service: data.provider.service || '',
        city: data.provider.city || '',
        area: data.provider.area || '',
        whatsapp: data.provider.whatsapp || '',
      });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        await fetch('/api/provider', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo_url: data.url }),
        });
        fetchProvider();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/provider', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage(t.profile.saved);
        fetchProvider();
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!provider) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t.profile.edit_title}
      </h1>

      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.profile.photo}
          </label>
          <div className="flex items-center gap-4">
            {provider.photo_url ? (
              <Image
                src={provider.photo_url}
                alt={provider.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {provider.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button as="span" variant="secondary" disabled={uploading}>
                  {uploading ? 'Uploading...' : t.profile.upload_photo}
                </Button>
              </label>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t.profile.name}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label={t.profile.service}
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          />

          <Input
            label={t.profile.city}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <Input
            label={t.profile.area}
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          />

          <Input
            label={t.profile.whatsapp}
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
          />

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : t.profile.save}
          </Button>
        </form>
      </Card>
    </div>
  );
}
