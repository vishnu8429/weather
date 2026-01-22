'use client';

import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppSelector } from '@/store/hooks';
import { useGetForecastByCoordsQuery } from '@/store/api/weather';
import { PageView } from '@/store/types/weather';
import Loader from '@/components/ui/Loader';
import Header from '@/components/core/Header';
import LocationPermission from '@/components/LocationPermission';
import FiveDayForecast from '@/components/FiveDayForecast';
import DayDetails from '@/components/DayDetails';

export default function WeatherDisplay() {
  const isLoading = useAppSelector((state) => state.weather.isLoading);
  const pageView = useAppSelector((state) => state.weather.pageView);
  const coords = useAppSelector((state) => state.weather.coords);

  // Weather by coords - RTK Query state is automatically synced to Redux via extraReducers
  useGetForecastByCoordsQuery(coords ?? skipToken);

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
