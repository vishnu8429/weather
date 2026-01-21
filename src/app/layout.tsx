
import { ReactNode } from "react";
import type { Metadata } from 'next'
import StoreProvider from "@/store/StoreProvider";
import "./globals.css";

// always render with the latest client-side weather data.
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Weather Forecast",
  description: "Weather forecast for your city",
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
