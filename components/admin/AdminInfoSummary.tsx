'use client';

import { Button } from '@/components/ui/button';
import { ContactInfo } from '@/lib/contact-info';

interface AdminInfoSummaryProps {
  contactInfo: ContactInfo;
  onEdit: () => void;
}

export default function AdminInfoSummary({ contactInfo, onEdit }: AdminInfoSummaryProps) {
  return (
    <>
      <div className="mb-4">
        <Button 
          type="button" 
          onClick={onEdit}
        >
          Edit Admin Info
        </Button>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <div><strong>Phone:</strong> {contactInfo.phone}</div>
        <div><strong>Email:</strong> {contactInfo.email}</div>
        <div><strong>Address:</strong> {contactInfo.address}, {contactInfo.city}, {contactInfo.state} {contactInfo.zip_code}</div>
                        <div><strong>Rush Phone:</strong> {contactInfo.emergency_phone}</div>
        <div>
          <strong>Business Hours:</strong>
          <ul className="ml-4 list-disc">
            <li>Mon-Fri: {contactInfo.business_hours.monday_friday}</li>
            <li>Saturday: {contactInfo.business_hours.saturday}</li>
            <li>Sunday: {contactInfo.business_hours.sunday}</li>
          </ul>
        </div>
        <div className="pt-2"><strong>Price per lb ($):</strong> {contactInfo.price_per_lb ?? 0}</div>
        <div><strong>Day Rate ($):</strong> {contactInfo.day_rate ?? 0}</div>
        <div><strong>Cancellation Insurance ($):</strong> {contactInfo.cancelation_insurance ?? 0}</div>
        <div><strong>Driveway Insurance ($):</strong> {contactInfo.driveway_insurance ?? 0}</div>
        <div><strong>Rush Fee ($):</strong> {contactInfo.rush_fee ?? 0}</div>
        <div><strong>Service Radius:</strong> {contactInfo.service_radius ?? 0} miles</div>
        <div><strong>Surrounding Area Radius:</strong> {contactInfo.surrounding_area_radius ?? 0} miles</div>
      </div>
    </>
  );
} 