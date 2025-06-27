import { getContactInfo } from '@/lib/contact-info';
import SuccessContent from './SuccessContent';

export default async function SuccessPage() {
  const contactInfo = await getContactInfo();
  const phone = contactInfo.phone || '(801) 555-0123';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/';

  return <SuccessContent phone={phone} baseUrl={baseUrl} />;
} 