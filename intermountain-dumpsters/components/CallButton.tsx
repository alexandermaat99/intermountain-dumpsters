'use client';

import { useContactInfo } from "@/lib/hooks/useContactInfo";

export default function CallButton() {
  const { contactInfo, loading } = useContactInfo();

  return (
    <a 
      href={`tel:${loading ? '#' : contactInfo.phone}`}
      className="bg-[#2C6B9E] text-white px-6 py-3 sm:px-8 rounded-lg font-semibold hover:bg-[#2C6B9E]/80 transition-colors text-center shadow-lg"
    >
      Call to Book
    </a>
  );
} 