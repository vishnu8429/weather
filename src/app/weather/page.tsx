'use client';

import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetForecastByCoordsQuery } from '@/store/api/weather';
import { setLoading, setError, setPageView, setForecast } from '@/store/slices/weather';
import { PageView } from '@/store/types/weather';
import Loader from '@/components/ui/Loader';
import Header from '@/components/core/Header';
import LocationPermission from '@/components/LocationPermission';
import FiveDayForecast from '@/components/FiveDayForecast';
import DayDetails from '@/components/DayDetails';

export default function WeatherPage() {
  const dispatch = useAppDispatch();

  const { isLoading, pageView, coords } = useAppSelector((state) => state.weather);

  // Weather by coords
  const {
    isLoading: isLoadingWeatherByCoords,
    error: errorWeatherByCoords,
    data: weatherByCoordsData
  } = useGetForecastByCoordsQuery(coords ?? skipToken);

  // Update loading state
  useEffect(() => {
    dispatch(setLoading(isLoadingWeatherByCoords));
  }, [isLoadingWeatherByCoords, dispatch]);

  // Extract error message from RTK Query
  useEffect(() => {
    if (errorWeatherByCoords) {
      const errorMessage =
        (errorWeatherByCoords as any)?.data ||
        (errorWeatherByCoords as any)?.message ||
        'Failed to fetch weather data';
      dispatch(setError(errorMessage));
    } else {
      dispatch(setError(undefined));
    }
  }, [errorWeatherByCoords, dispatch]);

  // When forecast data arrives, update store
  useEffect(() => {
    if (weatherByCoordsData && weatherByCoordsData.forecasts.length > 0) {
      dispatch(setForecast(weatherByCoordsData));
      dispatch(setPageView(PageView.Forecast));
    }
  }, [weatherByCoordsData, dispatch]);

  // Auto scroll to top when view changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [pageView]);

  if (pageView === PageView.Permission) {
    return (
      <LocationPermission />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Header />

        {isLoading && <Loader />}

        {!isLoading && pageView === PageView.Forecast && (
          <FiveDayForecast />
        )}

        {!isLoading && pageView === PageView.DayDetails && (
          <DayDetails />
        )}
      </div>
    </div>
  );
}
