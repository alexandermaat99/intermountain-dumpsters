'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerInfo } from '@/lib/types';

interface CustomerInfoStepProps {
  customer: CustomerInfo;
  onUpdate: (customer: CustomerInfo) => void;
  onNext: () => void;
}

export default function CustomerInfoStep({ customer, onUpdate, onNext }: CustomerInfoStepProps) {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!customer.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!customer.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!customer.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!customer.address_line_1.trim()) newErrors.address_line_1 = 'Address is required';
    if (!customer.city.trim()) newErrors.city = 'City is required';
    if (!customer.state.trim()) newErrors.state = 'State is required';
    if (!customer.zip.trim()) newErrors.zip = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onUpdate({ ...customer, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <p className="text-muted-foreground">Please provide your contact information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={customer.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className={errors.first_name ? 'border-destructive' : ''}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive mt-1">{errors.first_name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={customer.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className={errors.last_name ? 'border-destructive' : ''}
          />
          {errors.last_name && (
            <p className="text-sm text-destructive mt-1">{errors.last_name}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="phone_number">Phone Number *</Label>
          <Input
            id="phone_number"
            type="tel"
            value={customer.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            placeholder="(555) 123-4567"
            className={errors.phone_number ? 'border-destructive' : ''}
          />
          {errors.phone_number && (
            <p className="text-sm text-destructive mt-1">{errors.phone_number}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address_line_1">Address Line 1 *</Label>
          <Input
            id="address_line_1"
            value={customer.address_line_1}
            onChange={(e) => handleInputChange('address_line_1', e.target.value)}
            placeholder="123 Main St"
            className={errors.address_line_1 ? 'border-destructive' : ''}
          />
          {errors.address_line_1 && (
            <p className="text-sm text-destructive mt-1">{errors.address_line_1}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
          <Input
            id="address_line_2"
            value={customer.address_line_2}
            onChange={(e) => handleInputChange('address_line_2', e.target.value)}
            placeholder="Apt, Suite, etc."
          />
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={customer.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && (
            <p className="text-sm text-destructive mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={customer.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="UT"
            className={errors.state ? 'border-destructive' : ''}
          />
          {errors.state && (
            <p className="text-sm text-destructive mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <Label htmlFor="zip">ZIP Code *</Label>
          <Input
            id="zip"
            value={customer.zip}
            onChange={(e) => handleInputChange('zip', e.target.value)}
            placeholder="84101"
            className={errors.zip ? 'border-destructive' : ''}
          />
          {errors.zip && (
            <p className="text-sm text-destructive mt-1">{errors.zip}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
} 