import { Suspense } from "react";
import WeatherDisplay from "@/components/WeatherDisplay";
import Loader from "@/components/ui/Loader";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <WeatherDisplay />
    </Suspense>
  );
}
