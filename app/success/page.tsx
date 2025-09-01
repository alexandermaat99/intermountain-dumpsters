import { getContactInfo } from '@/lib/contact-info';
import SuccessContent from './SuccessContent';
import { Suspense } from 'react';

export default async function SuccessPage() {
  const contactInfo = await getContactInfo();
  const phone = contactInfo.phone || '(801) 555-0123';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent phone={phone} baseUrl={baseUrl} />
    </Suspense>
  );
} 