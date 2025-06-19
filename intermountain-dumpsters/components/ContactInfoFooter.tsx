'use client';

import { useContactInfo } from '@/lib/hooks/useContactInfo';

export default function ContactInfoFooter() {
  const { contactInfo, loading, error } = useContactInfo();

  if (loading) {
    return <p className="text-muted-foreground">Loading contact information...</p>;
  }

  if (error) {
    return <p className="text-muted-foreground">Error loading contact information</p>;
  }

  return (
    <div className="space-y-2 text-muted-foreground">
      <p className="text-sm">
        {contactInfo.address}, {contactInfo.city}, {contactInfo.state} {contactInfo.zip_code}
      </p>
      <p className="text-sm">
        <span className="font-medium">Phone:</span> {contactInfo.phone}
      </p>
      <div className="text-sm">
        <span className="font-medium">Hours:</span>
        <div className="mt-1 space-y-1">
          <p>Mon-Fri: {contactInfo.business_hours.monday_friday}</p>
          <p>Sat: {contactInfo.business_hours.saturday}</p>
          <p>Sun: {contactInfo.business_hours.sunday}</p>
        </div>
      </div>
    </div>
  );
} 