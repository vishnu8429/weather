import { Suspense } from "react";
import WeatherPage from "@/app/weather/page";
import Loader from "@/components/ui/Loader";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <WeatherPage />
    </Suspense>
  );
}
