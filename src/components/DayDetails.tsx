import { LuArrowLeft } from 'react-icons/lu';
import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPageView, setSelectedDay } from '@/store/slices/weather';
import { PageView } from '@/store/types/weather';
import ForecastCard from '@/components/ForecastCard';
import ForecastIntervalCard from './ForecastIntervalCard';
import Button from '@/components/ui/Button';

export default function DayDetails() {
  const dispatch = useAppDispatch();

  const { unit, selectedDay, timezone } = useAppSelector((state: RootState) => state.weather);

  if (!selectedDay) {
    return null;
  }

  const handleBack = () => {
    dispatch(setSelectedDay(null));
    dispatch(setPageView(PageView.Forecast));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="icon" onClick={() => handleBack()}>
          <LuArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{selectedDay.dayOfWeek}</h2>
          <p className="text-sm text-gray-600">{selectedDay.date}</p>
        </div>
      </div>

      <ForecastCard
        type="today"
        unit={unit}
        forecast={selectedDay}
      />

      <h2 className="text-gray-700 uppercase pt-3">3-Hour Forecast</h2>
      <div className="space-y-3">
        {selectedDay.intervals.map((interval, index) => (
          <ForecastIntervalCard
            key={index}
            unit={unit}
            timezone={timezone}
            interval={interval}
          />
        ))}
      </div>
    </div>
  );
}
