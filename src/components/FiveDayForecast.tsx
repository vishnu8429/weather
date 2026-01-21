import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPageView, setSelectedDay } from '@/store/slices/weather';
import { DayForecast, PageView } from '@/store/types/weather';
import ForecastCard from '@/components/ForecastCard';

export default function FiveDayForecast() {
  const dispatch = useAppDispatch();
  const { unit, forecasts } = useAppSelector((state: RootState) => state.weather);

  const handleDayClick = (day: DayForecast) => {
    dispatch(setSelectedDay(day));
    dispatch(setPageView(PageView.DayDetails));
  };

  // Empty forecast state
  if (forecasts && forecasts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">
          No forecast data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {forecasts && forecasts[0] && (
        <ForecastCard
          type="today"
          unit={unit}
          forecast={forecasts[0]}
        />
      )}

      <h2 className="text-gray-700 uppercase pt-3">5-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {forecasts && forecasts.map((forecast, index) => (
          <ForecastCard
            key={index}
            unit={unit}
            forecast={forecast}
            onClick={() => handleDayClick(forecast)}
          />
        ))}
      </div>
    </div>
  );
}
