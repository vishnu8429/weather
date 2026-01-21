export enum PageView {
  Permission = 'permission',
  Forecast = 'forecast',
  DayDetails = 'dayDetails',
}

export enum TemperatureUnit {
  Celsius = 'celsius',
  Fahrenheit = 'fahrenheit',
}

// OpenWeather forecast API types
interface MainWeatherMetrics {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface CloudInfo {
  all: number;
}

interface WindInfo {
  speed: number;
  deg: number;
  gust: number;
}

interface SysInfo {
  pod: string;
}

interface Coord {
  lat: number;
  lon: number;
}

interface CityInfo {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherForecastEntry {
  dt: number;
  main: MainWeatherMetrics;
  weather: WeatherCondition[];
  clouds: CloudInfo;
  wind: WindInfo;
  visibility: number;
  pop: number;
  sys: SysInfo;
  dt_txt: string;
}

export interface WeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecastEntry[];
  city: CityInfo;
}

// OpenWeather Geocoding API types
export interface GeoCodingEntry {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type GeoCodingResponse = GeoCodingEntry[];

export interface DayForecast {
  date: string;
  dayOfWeek: string;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
  intervals: WeatherForecastEntry[];
}

export interface ForecastView {
  cityName: string;
  country: string;
  timezone: number;
  forecasts: DayForecast[];
}
