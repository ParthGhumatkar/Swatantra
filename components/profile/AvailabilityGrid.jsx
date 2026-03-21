import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AvailabilityGrid({ availability, t }) {
  const timeSlots = ['morning', 'afternoon', 'evening'];

  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t.public.available}</h2>
      <div className="space-y-3">
        {availability.map((day) => {
          const hasAvailability = day.morning || day.afternoon || day.evening;
          
          if (!hasAvailability) return null;

          return (
            <div key={day.day_of_week} className="flex items-start gap-3">
              <div className="w-24 font-medium text-gray-700">
                {t.availability.days[day.day_of_week]}
              </div>
              <div className="flex flex-wrap gap-2">
                {day.morning && (
                  <Badge variant="success">{t.availability.morning}</Badge>
                )}
                {day.afternoon && (
                  <Badge variant="success">{t.availability.afternoon}</Badge>
                )}
                {day.evening && (
                  <Badge variant="success">{t.availability.evening}</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
