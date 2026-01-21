import { baseApi } from "@/store/api/base";
import {
  WeatherForecastEntry,
  WeatherForecastResponse,
  DayForecast,
  ForecastView,
  GeoCodingResponse,
} from "@/store/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("OPENWEATHER_API_KEY is not set");
}

const API_ENDPOINT = {
  FORECAST: "/data/2.5/forecast",
  GEOCODING: "/geo/1.0/direct",
};

// Transform OpenWeather forecast response
const transformForecastResponse = (response: WeatherForecastResponse): ForecastView => {
  // Handle empty responses
  if (!response.list || response.list.length === 0) {
    return {
      cityName: "",
      country: "",
      timezone: 0,
      forecasts: [],
    };
  }

  const data: WeatherForecastEntry[] = response.list;

  const days: Record<string, WeatherForecastEntry[]> = {};

  // Group forecast data
  data.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    if (!days[dateKey]) {
      days[dateKey] = [];
    }
    days[dateKey].push(item);
  });

  // Create 5-day forecasts
  const dayForecasts: DayForecast[] = Object.entries(days)
    .slice(0, 5)
    .map(([dateKey, intervals]) => {
      const date = new Date(dateKey);
      const temps = intervals.map((i) => i.main.temp);
      const tempMin = Math.min(...temps);
      const tempMax = Math.max(...temps);

      // Get the common weather condition for the day
      const weatherCounts: Record<string, number> = {};
      intervals.forEach((i) => {
        const key = i.weather[0].icon;
        weatherCounts[key] = (weatherCounts[key] || 0) + 1;
      });

      const icon = Object.entries(weatherCounts).sort((a, b) => b[1] - a[1])[0][0];
      const description =
        intervals.find((i) => i.weather[0].icon === icon)?.weather[0]
          .description || "";

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
        tempMin,
        tempMax,
        icon: icon,
        description: description,
        intervals,
      };
    });

  return {
    cityName: response.city.name,
    country: response.city.country,
    timezone: response.city.timezone,
    forecasts: dayForecasts,
  };
};

const weatherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch forecast data by coordinates
    getForecastByCoords: builder.query<ForecastView, { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => `${API_ENDPOINT.FORECAST}?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
      transformResponse: (response: WeatherForecastResponse): ForecastView =>
        transformForecastResponse(response),
    }),

    // Fetch forecast data by city name
    getForecastByCity: builder.query<ForecastView, { cityName: string }>({
      query: ({ cityName }) => `${API_ENDPOINT.FORECAST}?q=${cityName}&units=metric&appid=${API_KEY}`,
      transformResponse: (response: WeatherForecastResponse): ForecastView =>
        transformForecastResponse(response),
    }),

    // Search cities using Geocoding API
    searchCities: builder.query<GeoCodingResponse, string>({
      query: (cityName) => `${API_ENDPOINT.GEOCODING}?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`,
    }),
  }),
});

export const {
  useGetForecastByCoordsQuery,
  useLazyGetForecastByCoordsQuery,
  useLazySearchCitiesQuery,
} = weatherApi;
