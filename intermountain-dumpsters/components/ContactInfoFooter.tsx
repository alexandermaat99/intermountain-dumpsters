'use client';

import { useContactInfo } from '@/lib/hooks/useContactInfo';

export default function ContactInfoFooter() {
  const { contactInfo, loading, error } = useContactInfo();

  if (loading) {
    return (
      <div className="space-y-2 text-sm text-white/80 animate-pulse">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
        <div className="h-4 bg-white/20 rounded w-2/3 mt-2"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!contactInfo) {
    return <p className="text-sm text-white/60">Contact information not available.</p>;
  }

  return (
    <div className="space-y-2 text-sm text-white/80">
      <p>{contactInfo.address}</p>
      <p>
        <span className="font-semibold text-white">Phone:</span>{" "}
        <a href={`tel:${contactInfo.phone}`} className="hover:underline">
          {contactInfo.phone}
        </a>
      </p>
      <div className="text-sm">
        <span className="font-semibold text-white">Hours:</span>
        <div className="mt-1 space-y-1">
          <p>Mon-Fri: {contactInfo.business_hours.monday_friday}</p>
          <p>Sat: {contactInfo.business_hours.saturday}</p>
          <p>Sun: {contactInfo.business_hours.sunday}</p>
        </div>
      </div>
    </div>
  );
} 