import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { PageView, DayForecast, TemperatureUnit } from "@/store/types/weather";

interface ForecastResult {
  cityName: string;
  country: string;
  timezone: number;
  forecasts: DayForecast[];
}

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
      action: PayloadAction<ForecastResult>
    ) => {
      state.cityName = action.payload.cityName;
      state.country = action.payload.country;
      state.timezone = action.payload.timezone;
      state.forecasts = action.payload.forecasts;
      state.pageView = action.payload.forecasts.length > 0 ? PageView.Forecast : PageView.Permission;
    },
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