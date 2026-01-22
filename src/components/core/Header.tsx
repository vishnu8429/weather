"use client";

import { FiMapPin } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import SearchBar from "@/components/core/SearchBar";
import UnitToggle from "@/components/core/UnitToggle";

export default function Header() {
  const cityName = useAppSelector((state) => state.weather.cityName);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiMapPin size={20} className="text-blue-600" />
          <h1 className="text-xl font-semibold">
            {cityName || 'Weather Forecast'}
          </h1>
        </div>
        <UnitToggle />
      </div>
      <SearchBar />
    </div>
  );
}