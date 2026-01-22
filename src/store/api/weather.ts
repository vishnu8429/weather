import { baseApi } from "@/store/api/base";
import {
  ForecastEntry,
  ForecastResponse,
  DayForecast,
  ForecastView,
  GeoCodingResponse,
} from "@/store/types/weather";

const API_ENDPOINT = {
  FORECAST: "/data/2.5/forecast",
  GEOCODING: "/geo/1.0/direct",
};

// Gets the OpenWeather API key
const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_OPENWEATHER_API_KEY is not set");
  }
  return apiKey;
};

// Transform OpenWeather forecast response
const transformForecastResponse = (response: any): ForecastView => {
  // Handle null/undefined responses
  if (!response || typeof response !== 'object') {
    return {
      cityName: "",
      country: "",
      timezone: 0,
      forecasts: [],
    };
  }

  // Handle API-level errors (cod !== '200')
  if ('cod' in response) {
    const cod = response.cod;
    if (cod && String(cod) !== '200') {
      return {
        cityName: (response.city && response.city.name) ? response.city.name : "",
        country: (response.city && response.city.country) ? response.city.country : "",
        timezone: (response.city && response.city.timezone) ? response.city.timezone : 0,
        forecasts: [],
      };
    }
  }

  // Handle empty list
  if (!response.list || !Array.isArray(response.list) || response.list.length === 0) {
    return {
      cityName: (response.city && response.city.name) ? response.city.name : "",
      country: (response.city && response.city.country) ? response.city.country : "",
      timezone: (response.city && response.city.timezone) ? response.city.timezone : 0,
      forecasts: [],
    };
  }

  const data: ForecastEntry[] = response.list;
  const days: Record<string, ForecastEntry[]> = {};

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
        if (i.weather && i.weather.length > 0) {
          const key = i.weather[0].icon;
          weatherCounts[key] = (weatherCounts[key] || 0) + 1;
        }
      });

      const sortedWeather = Object.entries(weatherCounts).sort((a, b) => b[1] - a[1]);
      const icon = sortedWeather.length > 0 ? sortedWeather[0][0] : "01d"; // Default to clear sky icon
      const description =
        intervals.find((i) => i.weather && i.weather.length > 0 && i.weather[0].icon === icon)?.weather[0]
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
  endpoints: (builder) => {
    return {
      // Fetch forecast data by coordinates
      getForecastByCoords: builder.query<ForecastView, { latitude: number; longitude: number }>({
        query: ({ latitude, longitude }) => {
          const apiKey = getApiKey();
          return `${API_ENDPOINT.FORECAST}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        },
        transformResponse: (response: ForecastResponse): ForecastView =>
          transformForecastResponse(response),
      }),

      // Fetch forecast data by city name
      getForecastByCity: builder.query<ForecastView, { cityName: string }>({
        query: ({ cityName }) => {
          const apiKey = getApiKey();
          return `${API_ENDPOINT.FORECAST}?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`;
        },
        transformResponse: (response: ForecastResponse): ForecastView =>
          transformForecastResponse(response),
      }),

      // Search cities using Geocoding API
      searchCities: builder.query<GeoCodingResponse, string>({
        query: (cityName) => {
          const apiKey = getApiKey();
          return `${API_ENDPOINT.GEOCODING}?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`;
        },
      }),
    };
  },
});

export const {
  useGetForecastByCoordsQuery,
  useLazyGetForecastByCoordsQuery,
  useGetForecastByCityQuery,
  useLazyGetForecastByCityQuery,
  useLazySearchCitiesQuery,
} = weatherApi;

export { weatherApi };
