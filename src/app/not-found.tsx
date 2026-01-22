'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <Card>
          <div className="flex flex-col items-center text-center space-y-6 p-8">
            <div className="text-blue-200 text-8xl sm:text-9xl font-bold">
              404
            </div>

            <div className="space-y-2">
              <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold">
                Page Not Found
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <Link
              href="/"
              className="w-full h-12 bg-primary text-white flex items-center justify-center gap-2 p-4 rounded-md transition-all hover:opacity-90 active:scale-95 outline-none"
            >
              <span>Go to Home Page</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
