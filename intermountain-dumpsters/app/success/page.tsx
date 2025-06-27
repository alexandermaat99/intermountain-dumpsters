import { Suspense } from 'react';
import { getContactInfo } from '@/lib/contact-info';
import dynamic from 'next/dynamic';

const SuccessContent = dynamic(() => import('./SuccessContent'), { ssr: false });

export default async function SuccessPage() {
  const contactInfo = await getContactInfo();
  const phone = contactInfo.phone || '(801) 555-0123';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    }>
      <SuccessContent phone={phone} baseUrl={baseUrl} />
    </Suspense>
  );
} 