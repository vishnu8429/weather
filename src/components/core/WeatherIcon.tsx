'use client';

import Image from "next/image";

interface WeatherIconProps {
  className?: string;
  icon: string;
  size?: number;
  alt?: string;
}

export default function WeatherIcon({
  className = "size-12",
  icon,
  size = 64,
  alt = "Weather icon"
}: WeatherIconProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className={`${className}`}>
      <Image
        src={iconUrl}
        alt={alt}
        width={size}
        height={size}
        className={`w-full h-full object-contain`}
      />
    </div>
  );
}
