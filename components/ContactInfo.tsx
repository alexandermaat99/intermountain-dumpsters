'use client';

import { useContactInfo } from '@/lib/hooks/useContactInfo';

interface ContactInfoProps {
  showBusinessHours?: boolean;
  showEmergency?: boolean;
  className?: string;
}

export default function ContactInfo({ 
  showBusinessHours = true, 
  showEmergency = true, 
  className = "" 
}: ContactInfoProps) {
  const { contactInfo, loading, error } = useContactInfo();

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 ${className}`}>
        Error loading contact information. Please try again later.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        {/* Phone */}
        <a 
          href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
          className="flex items-start gap-4 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-muted-foreground hover:text-primary transition-colors">{contactInfo.phone}</p>
            <p className="text-sm text-muted-foreground">Monday - Friday: {contactInfo.business_hours.monday_friday}</p>
          </div>
        </a>

        {/* Email */}
        <a 
          href={`mailto:${contactInfo.email}`}
          className="flex items-start gap-4 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground hover:text-primary transition-colors">{contactInfo.email}</p>
            <p className="text-sm text-muted-foreground">We typically respond within 2 hours</p>
          </div>
        </a>

        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Office</h3>
            <p className="text-muted-foreground">
              {contactInfo.address}<br />
              {contactInfo.city}, {contactInfo.state} {contactInfo.zip_code}
            </p>
            <p className="text-sm text-muted-foreground">By appointment only</p>
          </div>
        </div>

        {/* Facebook */}
        <a 
          href="https://www.facebook.com/profile.php?id=61578904738151&mibextid=LQQJ4d&rdid=m9ja1CegWswQomeh#" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-start gap-4 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Follow Us</h3>
            <p className="text-muted-foreground hover:text-primary transition-colors">Facebook</p>
            <p className="text-sm text-muted-foreground">Stay updated with our latest news and offers</p>
          </div>
        </a>
      </div>

      {/* Business Hours */}
      {showBusinessHours && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Business Hours</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Monday - Friday: {contactInfo.business_hours.monday_friday}</p>
            <p>Saturday: {contactInfo.business_hours.saturday}</p>
            <p>Sunday: {contactInfo.business_hours.sunday}</p>
          </div>
        </div>
      )}

      {/* Rush Service */}
      {showEmergency && (
        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Rush Service</h2>
          <p className="text-muted-foreground mb-4">
            Need immediate assistance outside of business hours?
          </p>
          <p className="font-semibold text-lg">Rush Hotline: {contactInfo.emergency_phone}</p>
        </div>
      )}
    </div>
  );
} 