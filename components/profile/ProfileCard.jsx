import Image from 'next/image';
import Card from '@/components/ui/Card';

export default function ProfileCard({ provider }) {
  return (
    <Card>
      <div className="flex flex-col items-center text-center">
        {provider.photo_url ? (
          <Image
            src={provider.photo_url}
            alt={provider.name}
            width={120}
            height={120}
            className="rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-30 h-30 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-primary-600">
              {provider.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {provider.name}
        </h1>

        {provider.service && (
          <p className="text-lg text-primary-600 font-medium mb-2">
            {provider.service}
          </p>
        )}

        {(provider.area || provider.city) && (
          <p className="text-gray-600">
            {[provider.area, provider.city].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
    </Card>
  );
}
