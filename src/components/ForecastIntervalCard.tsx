import { TemperatureUnit, ForecastEntry } from '@/store/types/weather';
import { formatTemp, formatTime } from '@/utils/helper';
import Card from '@/components/ui/Card';
import WeatherIcon from '@/components/core/WeatherIcon';

interface ForecastIntervalCardProps {
  unit: TemperatureUnit;
  timezone: number;
  interval: ForecastEntry;
}

export default function ForecastIntervalCard({ unit, timezone, interval }: ForecastIntervalCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-6">
        <div className="text-center min-w-[80px]">
          <p className="text-sm sm:text-base font-semibold">
            {formatTime(interval.dt_txt, timezone)}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between gap-3 w-full">
          <WeatherIcon icon={interval.weather[0].icon} />

          <div className="flex-1">
            <p className="text-sm capitalize">
              {interval.weather[0].description}
            </p>
            <p className="text-xs text-gray-500">
              Humidity: {Math.round(interval.main.humidity)}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm sm:text-xl font-semibold">
              {formatTemp(interval.main.temp, unit)}
            </p>
            <p className="text-xs text-gray-500">
              Feels like {formatTemp(interval.main.feels_like, unit)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}