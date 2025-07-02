'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactInfo, updateContactInfo } from '@/lib/contact-info';
import { Loader2, Phone, Mail, MapPin } from 'lucide-react';

interface AdminInfoFormProps {
  contactInfo: ContactInfo;
  onUpdate: (updatedInfo: ContactInfo) => void;
  onCancel: () => void;
}

export default function AdminInfoForm({ contactInfo, onUpdate, onCancel }: AdminInfoFormProps) {
  const [formData, setFormData] = useState<ContactInfo>(contactInfo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updated = await updateContactInfo({ ...formData, id: 1 });
      if (updated) {
        onUpdate(updated);
        setSuccess('Contact information updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update contact information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      setError('An error occurred while updating contact information. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            value={formData.zip_code}
            onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
                        <Label htmlFor="emergency_phone">Rush Phone</Label>
        <Input
          id="emergency_phone"
          value={formData.emergency_phone}
          onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label>Business Hours</Label>
        <div className="grid grid-cols-1 gap-2">
          <Input
            placeholder="Monday-Friday (e.g., 7:00 AM - 6:00 PM)"
            value={formData.business_hours.monday_friday}
            onChange={(e) => setFormData({
              ...formData, 
              business_hours: {
                ...formData.business_hours,
                monday_friday: e.target.value
              }
            })}
          />
          <Input
            placeholder="Saturday (e.g., 8:00 AM - 4:00 PM)"
            value={formData.business_hours.saturday}
            onChange={(e) => setFormData({
              ...formData, 
              business_hours: {
                ...formData.business_hours,
                saturday: e.target.value
              }
            })}
          />
          <Input
            placeholder="Sunday (e.g., Closed)"
            value={formData.business_hours.sunday}
            onChange={(e) => setFormData({
              ...formData, 
              business_hours: {
                ...formData.business_hours,
                sunday: e.target.value
              }
            })}
          />
        </div>
      </div>

      {/* Pricing fields */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="price_per_lb">Price per lb ($)</Label>
          <Input
            id="price_per_lb"
            type="number"
            step="0.01"
            value={formData.price_per_lb || 0}
            onChange={(e) => setFormData({
              ...formData, 
              price_per_lb: parseFloat(e.target.value)
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="day_rate">Day Rate ($)</Label>
          <Input
            id="day_rate"
            type="number"
            step="0.01"
            value={formData.day_rate || 0}
            onChange={(e) => setFormData({
              ...formData, 
              day_rate: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cancelation_insurance">Cancellation Insurance ($)</Label>
          <Input
            id="cancelation_insurance"
            type="number"
            step="0.01"
            value={formData.cancelation_insurance || 0}
            onChange={(e) => setFormData({
              ...formData, 
              cancelation_insurance: parseFloat(e.target.value)
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="driveway_insurance">Driveway Insurance ($)</Label>
          <Input
            id="driveway_insurance"
            type="number"
            step="0.01"
            value={formData.driveway_insurance || 0}
            onChange={(e) => setFormData({
              ...formData, 
              driveway_insurance: parseFloat(e.target.value)
            })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rush_fee">Rush Fee ($)</Label>
        <Input
          id="rush_fee"
          type="number"
          step="0.01"
          value={formData.rush_fee || 0}
          onChange={(e) => setFormData({
            ...formData, 
            rush_fee: parseFloat(e.target.value)
          })}
        />
      </div>

      {/* Service Area fields */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="service_radius">Service Radius (miles)</Label>
          <Input
            id="service_radius"
            type="number"
            step="1"
            min="0"
            value={formData.service_radius || 0}
            onChange={(e) => setFormData({
              ...formData, 
              service_radius: parseInt(e.target.value)
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surrounding_area_radius">Surrounding Area Radius (miles)</Label>
          <Input
            id="surrounding_area_radius"
            type="number"
            step="1"
            min="0"
            value={formData.surrounding_area_radius || 0}
            onChange={(e) => setFormData({
              ...formData, 
              surrounding_area_radius: parseInt(e.target.value)
            })}
          />
        </div>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
          {success}
        </div>
      )}
      
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 