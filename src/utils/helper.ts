import { TemperatureUnit } from "@/store/types/weather";

const convertCelsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

export const formatTemp = (temp: number, unit: TemperatureUnit) => {
  const value = unit === 'fahrenheit' ? convertCelsiusToFahrenheit(temp) : temp;
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

export const formatTime = (dateString: string, timezoneOffset: number = 0) => {
  // Parse UTC time from API (dt_txt is in UTC format: "2024-01-20 12:00:00")
  // Add 'Z' to explicitly mark it as UTC
  const utcDate = new Date(dateString.replace(' ', 'T') + 'Z');

  // Convert to local time using timezone offset
  // Add the offset to get the local time
  const localTime = new Date(utcDate.getTime() + timezoneOffset * 1000);

  return localTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
};