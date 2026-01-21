'use client';

import Link from 'next/link';
import { LuChrome } from 'react-icons/lu';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <div className="flex flex-col items-center text-center space-y-6 p-8">
            <div className="text-8xl sm:text-9xl font-bold text-blue-200">
              404
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Page Not Found
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <Link href="/" className="w-full">
              <Button
                variant="solid"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                label="Go to Home Page"
              >
                <LuChrome size={20} />
                <span>Go to Home Page</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
