"use client";

import React, { useRef, useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { TbLoader2 } from "react-icons/tb";
import { useAppDispatch } from "@/store/hooks";
import { useLazySearchCitiesQuery, useLazyGetForecastByCoordsQuery } from "@/store/api/weather";
import { setForecast, setCoords } from "@/store/slices/weather";
import { GeoCodingEntry } from "@/store/types/weather";
import Input from "@/components/ui/Input";

export default function SearchBar() {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSearchTextRef = useRef<string>("");

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<GeoCodingEntry[]>([]);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const [searchCities, { isFetching: isSearching }] = useLazySearchCitiesQuery();
  const [getForecast, { isFetching: isLoadingForecast }] = useLazyGetForecastByCoordsQuery();

  useEffect(() => {
    if (!isUserTyping) {
      return;
    }

    // Track the latest search text
    latestSearchTextRef.current = searchText;

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchText.trim().length < 2) {
      setIsOpen(false);
      setSuggestions([]);
      return;
    }

    const term = searchText.trim();

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await searchCities(term).unwrap();

        if (term !== latestSearchTextRef.current) {
          return;
        }

        setIsOpen(result.length > 0);
        setActiveIndex(-1);
        setSuggestions(result);
      } catch (error) {
        setIsOpen(false);
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText, searchCities, isUserTyping]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = async (location: GeoCodingEntry) => {
    const displayName = location.state
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;

    setIsUserTyping(false);

    // Cancel any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

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
      console.error("Failed to fetch forecast:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => prev < suggestions.length - 1 ? prev + 1 : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => prev > 0 ? prev - 1 : suggestions.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelectCity(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

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
