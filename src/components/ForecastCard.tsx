import { DayForecast, TemperatureUnit } from '@/store/types/weather';
import { formatTemp } from '@/utils/helper';
import Card from '@/components/ui/Card';
import WeatherIcon from '@/components/core/WeatherIcon';

interface ForecastCardProps {
  type?: 'today' | 'five-day';
  unit: TemperatureUnit;
  forecast: DayForecast;
  onClick?: () => void;
}

export default function ForecastCard({
  type = 'five-day',
  unit,
  forecast,
  onClick
}: ForecastCardProps) {
  const { dayOfWeek, date, icon, description, tempMax, tempMin } = forecast;

  if (type === 'today') {
    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow duration-300"
        contentClassName="flex flex-col items-center justify-center space-y-3"
      >
        <div className="text-center font-semibold">
          <p>{dayOfWeek}, {date}</p>
        </div>

        <WeatherIcon className="size-24" icon={icon} alt={description} />

        <div className="text-center">
          <p className="text-sm text-gray-600 capitalize">{description}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="font-semibold">{formatTemp(tempMax, unit)}</span>
            <span className="text-gray-500">{formatTemp(tempMin, unit)}</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-300"
      contentClassName="flex items-center gap-3"
      onClick={onClick ?? undefined}
    >
      <WeatherIcon icon={icon} alt={description} />
      <div className="flex items-start justify-between w-full">
        <div>
          <p>{dayOfWeek}, {date}</p>
          <p className="text-xs text-gray-600 capitalize">{description}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{formatTemp(tempMax, unit)}</p>
          <p className="text-xs text-gray-500">{formatTemp(tempMin, unit)}</p>
        </div>
      </div>
    </Card>
  );
}
