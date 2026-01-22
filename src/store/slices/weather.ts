import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { weatherApi } from "@/store/api/weather";
import { PageView, DayForecast, TemperatureUnit, ForecastView } from "@/store/types/weather";

interface WeatherState {
  isLoading: boolean;
  error: string | undefined;
  pageView: PageView;
  locationPermission: "pending" | "granted" | "denied";
  coords: { latitude: number; longitude: number } | null;
  cityName: string;
  country: string;
  timezone: number;
  unit: TemperatureUnit;
  selectedDay: DayForecast | null;
  forecasts: DayForecast[] | null;
}

const initialState: WeatherState = {
  isLoading: false,
  error: undefined,
  pageView: PageView.Permission,
  locationPermission: "pending",
  coords: null,
  cityName: "",
  country: "",
  timezone: 0,
  unit: TemperatureUnit.Celsius,
  selectedDay: null,
  forecasts: []
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    setPageView: (state, action: PayloadAction<PageView>) => {
      state.pageView = action.payload;
    },
    setLocationPermission: (
      state,
      action: PayloadAction<"pending" | "granted" | "denied">
    ) => {
      state.locationPermission = action.payload;
    },
    setCoords: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number; } | null>
    ) => {
      state.coords = action.payload;
    },
    setUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.unit = action.payload;
    },
    setSelectedDay: (state, action: PayloadAction<DayForecast | null>) => {
      state.selectedDay = action.payload;
    },
    setForecast: (
      state,
      action: PayloadAction<ForecastView>
    ) => {
      state.cityName = action.payload.cityName;
      state.country = action.payload.country;
      state.timezone = action.payload.timezone;
      state.forecasts = action.payload.forecasts;
      // state.pageView = action.payload.forecasts.length > 0 ? PageView.Forecast : PageView.Permission;
    },
  },
  extraReducers: (builder) => {
    // Handle pending forecast queries
    const handleForecastPending = (state: WeatherState) => {
      state.isLoading = true;
      state.error = undefined;
    };

    // Handle fulfilled forecast
    const handleForecastFulfilled = (state: WeatherState, action: any) => {
      state.isLoading = false;
      state.error = undefined;
      const data = action.payload as ForecastView;
      if (data) {
        state.cityName = data.cityName || "";
        state.country = data.country || "";
        state.timezone = data.timezone || 0;
        state.forecasts = Array.isArray(data.forecasts) ? data.forecasts : [];
        state.pageView = state.forecasts.length > 0 ? PageView.Forecast : PageView.Permission;
      } else {
        state.cityName = "";
        state.country = "";
        state.timezone = 0;
        state.forecasts = [];
        state.pageView = PageView.Permission;
      }
    };

    // Handle rejected forecast
    const handleForecastRejected = (state: WeatherState, action: any) => {
      state.isLoading = false;
      const errorMessage =
        (action.payload as any)?.data ||
        (action.error as any)?.message ||
        'Failed to fetch weather data';
      state.error = errorMessage;
    };

    // Handle getForecastByCoords
    builder
      .addMatcher(
        weatherApi.endpoints.getForecastByCoords.matchPending,
        handleForecastPending
      )
      .addMatcher(
        weatherApi.endpoints.getForecastByCoords.matchFulfilled,
        handleForecastFulfilled
      )
      .addMatcher(
        weatherApi.endpoints.getForecastByCoords.matchRejected,
        handleForecastRejected
      )
      // Handle getForecastByCity
      .addMatcher(
        weatherApi.endpoints.getForecastByCity.matchPending,
        handleForecastPending
      )
      .addMatcher(
        weatherApi.endpoints.getForecastByCity.matchFulfilled,
        handleForecastFulfilled
      )
      .addMatcher(
        weatherApi.endpoints.getForecastByCity.matchRejected,
        handleForecastRejected
      );
  },
});

export const {
  setLoading,
  setError,
  setPageView,
  setLocationPermission,
  setCoords,
  setUnit,
  setSelectedDay,
  setForecast,
} = weatherSlice.actions;

export default weatherSlice.reducer;