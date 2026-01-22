import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPageView, setSelectedDay } from '@/store/slices/weather';
import { DayForecast, PageView } from '@/store/types/weather';
import ForecastCard, { ForecastCardType } from '@/components/ForecastCard';

export default function FiveDayForecast() {
  const dispatch = useAppDispatch();

  const error = useAppSelector((state: RootState) => state.weather.error);
  const unit = useAppSelector((state: RootState) => state.weather.unit);
  const forecasts = useAppSelector((state: RootState) => state.weather.forecasts);

  const handleDayClick = (day: DayForecast) => {
    dispatch(setSelectedDay(day));
    dispatch(setPageView(PageView.DayDetails));
  };

  // Empty forecast state
  if (forecasts && forecasts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm text-center p-8">
        <p className="text-gray-600">
          {error || "No forecast data available"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {forecasts && forecasts[0] && (
        <ForecastCard unit={unit} forecast={forecasts[0]} />
      )}

      <h2 className="text-gray-700 uppercase pt-3">5-Day Forecast</h2>
      <div className="grid grid-cols-1 gap-3">
        {forecasts && forecasts.map((forecast, index) => (
          <ForecastCard
            key={index}
            type={ForecastCardType.FiveDay}
            unit={unit}
            forecast={forecast}
            onClick={() => handleDayClick(forecast)}
          />
        ))}
      </div>
    </div>
  );
}
