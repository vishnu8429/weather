"use client";

import { useRef, useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { TbLoader2 } from "react-icons/tb";
import { useAppDispatch } from "@/store/hooks";
import { useLazySearchCitiesQuery, useLazyGetForecastByCoordsQuery } from "@/store/api/weather";
import { setError, setCoords, setForecast } from "@/store/slices/weather";
import { GeoCodingEntry } from "@/store/types/weather";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import Input from "@/components/ui/Input";

export default function SearchBar() {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<GeoCodingEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [searchCities, { isFetching: isSearching }] = useLazySearchCitiesQuery();
  const [getForecast, { isFetching: isLoadingForecast }] = useLazyGetForecastByCoordsQuery();

  // Handle debounce search
  const { cancel: cancelDebounce } = useDebounce({
    isUserTyping,
    searchText,
    onSearch: async (term: string) => {
      const result = await searchCities(term).unwrap();
      if (result.length === 0) {
        dispatch(setError(`Failed to fetch forecast for city: ${term}`));
        dispatch(setForecast({
          cityName: "",
          country: "",
          timezone: 0,
          forecasts: [],
        }));
      }
      return result;
    },
    onResults: (results) => {
      setIsOpen(results && results.length > 0);
      setSuggestions(results);
      setActiveIndex(-1); // Reset active index when new results arrive
    },
    onError: () => {
      setIsOpen(false);
      setSuggestions([]);
    },
  });

  // Handle city selection
  const handleSelectCity = useCallback(async (location: GeoCodingEntry) => {
    const displayName = location.state
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;

    setIsUserTyping(false);
    cancelDebounce();

    setSearchText(displayName);
    setIsOpen(false);
    setSuggestions([]);

    if (inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const result = await getForecast({ latitude: location.lat, longitude: location.lon }).unwrap();
      dispatch(setForecast(result));
      dispatch(setCoords({ latitude: location.lat, longitude: location.lon }));
    } catch (error) {
      dispatch(setError(`Failed to fetch forecast for city: ${displayName}`));
    }
  }, [cancelDebounce, getForecast, dispatch]);

  // Handle click outside to close dropdown
  useClickOutside({
    ref: containerRef,
    enabled: isOpen,
    handler: () => setIsOpen(false),
  });

  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    items: suggestions,
    isOpen,
    activeIndex,
    setActiveIndex,
    onSelect: handleSelectCity,
    onClose: () => setIsOpen(false),
  });

  const isLoading = isSearching || isLoadingForecast;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <CiSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
        <Input
          ref={inputRef}
          className="pl-10 pr-10"
          disabled={isLoadingForecast}
          placeholder="Search for a city..."
          value={searchText}
          onChange={(e) => {
            setIsUserTyping(true);
            setSearchText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        />
        {isLoading && (
          <TbLoader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id="city-suggestions"
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
          {suggestions.map((location, index) => {
            const displayName = location.state
              ? `${location.name}, ${location.state}`
              : location.name;

            return (
              <li
                key={index}
                role="option"
                aria-selected={activeIndex === index}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${activeIndex === index
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
                  }`}
                onClick={() => handleSelectCity(location)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <FiMapPin className="h-4 w-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {location.country}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
