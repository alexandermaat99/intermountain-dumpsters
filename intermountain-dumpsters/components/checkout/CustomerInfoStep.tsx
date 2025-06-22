'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerInfo } from '@/lib/types';
import { Building2, User } from 'lucide-react';

interface CustomerInfoStepProps {
  customer: CustomerInfo;
  onUpdate: (customer: CustomerInfo) => void;
  onNext: () => void;
}

export default function CustomerInfoStep({ customer, onUpdate, onNext }: CustomerInfoStepProps) {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [isBusiness, setIsBusiness] = useState(customer.business);

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {};
    
    if (!customer.first_name.trim()) newErrors.first_name = isBusiness ? 'Company name is required' : 'First name is required';
    if (!isBusiness && !customer.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!customer.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!customer.email.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) newErrors.email = 'A valid email is required';

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

  const handleBusinessToggle = (isBusiness: boolean) => {
    setIsBusiness(isBusiness);
    onUpdate({ ...customer, business: isBusiness });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <p className="text-muted-foreground">Please provide your contact information</p>
      </div>

      {/* Customer Type Toggle */}
      <div className="w-fit flex items-center justify-start gap-3 p-3 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-medium">Individual</span>
        </div>
        
        <button
          onClick={() => handleBusinessToggle(!isBusiness)}
          className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              isBusiness ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">Company</span>
          <Building2 className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">{isBusiness ? 'Company Name *' : 'First Name *'}</Label>
          <Input
            id="first_name"
            value={customer.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            placeholder={isBusiness ? 'Your Company LLC' : 'John'}
            className={errors.first_name ? 'border-destructive' : ''}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive mt-1">{errors.first_name}</p>
          )}
        </div>

        {!isBusiness && (
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={customer.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder="Doe"
              className={errors.last_name ? 'border-destructive' : ''}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive mt-1">{errors.last_name}</p>
            )}
          </div>
        )}

        <div className={isBusiness ? 'md:col-span-2' : ''}>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={customer.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="you@example.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div className={isBusiness ? 'md:col-span-2' : ''}>
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
      </div>

      <div className="flex justify-end pt-4 pb-6 md:pb-4">
        <Button onClick={handleNext} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
} 