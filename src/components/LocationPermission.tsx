"use client";

import { useState, useEffect, useCallback } from "react";
import { FiMapPin } from "react-icons/fi";
import { LuTriangleAlert } from 'react-icons/lu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setError, setPageView, setLocationPermission, setCoords } from '@/store/slices/weather';
import { PageView } from "@/store/types/weather";
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LocationPermission() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.weather);

  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [autoRequested, setAutoRequested] = useState<boolean>(false);

  const handleRequestLocation = useCallback(() => {
    dispatch(setLoading(true));
    dispatch(setError(undefined));

    if (!navigator.geolocation) {
      dispatch(setLoading(false));
      dispatch(setError('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLoading(false));
        dispatch(setLocationPermission("granted"));
        dispatch(setCoords({ latitude, longitude }));
      },
      (error) => {
        let message = 'Failed to get location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied. Please search by city instead.';
          dispatch(setLocationPermission("denied"));
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location unavailable. Please search by city instead.';
        }
        dispatch(setLoading(false));
        dispatch(setError(message));
      }
    );
  }, [dispatch]);

  // Auto-request location if permission is already granted
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setIsInitializing(false);
      return;
    }

    const permissions = navigator.permissions;
    if (!permissions?.query) {
      setIsInitializing(false);
      return;
    }

    permissions
      .query({ name: 'geolocation' })
      .then((status: PermissionStatus) => {
        if (status.state === 'granted' && !autoRequested) {
          setAutoRequested(true);
          handleRequestLocation();
        }
        setIsInitializing(false);
      })
      .catch(() => {
        setIsInitializing(false);
      });
  }, [autoRequested, handleRequestLocation]);

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Preparing your local weather...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      <Card
        className="w-full max-w-md"
        contentClassName="flex flex-col items-center text-center space-y-8"
      >
        <div className="bg-blue-100 rounded-full p-6">
          <FiMapPin size={34} className="text-blue-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome to Weather App</h1>
          <p className="text-gray-500">
            Allow access to your location to get accurate weather forecasts for your area.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-lg w-full">
            <LuTriangleAlert size={20} />
            <p className="text-sm text-start">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Button
            disabled={isLoading}
            color="secondary"
            label={isLoading ? "Requesting..." : "Allow Location Access"}
            onClick={() => handleRequestLocation()}
          />
          <Button
            disabled={isLoading}
            label="Search by City Instead"
            onClick={() => dispatch(setPageView(PageView.Forecast))}
          />
        </div>
      </Card>
    </div>
  );
}
