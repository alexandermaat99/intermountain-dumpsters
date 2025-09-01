"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Intermountain Dumpsters Admin!</h1>
        <p className="mb-6">
          Your account has been created. For security, please set your password before continuing.
        </p>
        <Button
          onClick={() => router.push('/admin/reset-password')}
          className="w-full"
        >
          Set My Password
        </Button>
      </div>
    </div>
  );
} 