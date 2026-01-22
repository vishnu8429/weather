import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUnit } from '@/store/slices/weather';
import { TemperatureUnit } from '@/store/types/weather';

export default function UnitToggle() {
  const dispatch = useAppDispatch();

  const unit = useAppSelector((state) => state.weather.unit);

  return (
    <div className="flex bg-[#c0d7f4] rounded-lg p-1">
      <button
        className={`flex-1 ${unit === TemperatureUnit.Celsius ? 'bg-white' : 'bg-transparent'} text-secondary text-sm rounded-md border-none ouline-none px-2.5 py-1`}
        onClick={() => dispatch(setUnit(TemperatureUnit.Celsius))}
      >
        °C
      </button>
      <button
        className={`flex-1 ${unit === TemperatureUnit.Fahrenheit ? 'bg-white' : 'bg-transparent'} text-secondary text-sm rounded-md border-none ouline-none px-2.5 py-1`}
        onClick={() => dispatch(setUnit(TemperatureUnit.Fahrenheit))}
      >
        °F
      </button>
    </div>
  );
}
