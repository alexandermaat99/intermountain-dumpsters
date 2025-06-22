'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeliveryDetails } from '@/lib/types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

interface DeliveryStepProps {
  delivery: DeliveryDetails;
  onUpdate: (delivery: DeliveryDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DeliveryStep({ delivery, onUpdate, onNext, onBack }: DeliveryStepProps) {
  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});
  const [addressValue, setAddressValue] = useState(delivery.delivery_address);

  const validateForm = () => {
    const newErrors: Partial<DeliveryDetails> = {};
    
    if (!delivery.delivery_date) newErrors.delivery_date = 'Delivery date is required';
    if (!delivery.delivery_address.trim()) newErrors.delivery_address = 'Delivery address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: keyof DeliveryDetails, value: string) => {
    onUpdate({ ...delivery, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressSelect = async (address: string) => {
    setAddressValue(address);
    handleInputChange('delivery_address', address);
    
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      console.log('Selected address coordinates:', latLng);
      // You can store coordinates if needed for future use
    } catch (error) {
      console.error('Error getting address coordinates:', error);
    }
  };

  const handleAddressChange = (address: string) => {
    setAddressValue(address);
    handleInputChange('delivery_address', address);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
        <p className="text-muted-foreground">When and where would you like your dumpster delivered?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="delivery_date">Preferred Delivery Date *</Label>
          <Input
            id="delivery_date"
            type="date"
            value={delivery.delivery_date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('delivery_date', e.target.value)}
            min={today}
            className={errors.delivery_date ? 'border-destructive' : ''}
          />
          {errors.delivery_date && (
            <p className="text-sm text-destructive mt-1">{errors.delivery_date}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            We&apos;ll deliver your dumpster on the selected date between 7 AM - 5 PM
          </p>
        </div>

        <div>
          <Label htmlFor="delivery_address">Delivery Address *</Label>
          <PlacesAutocomplete
            value={addressValue}
            onChange={handleAddressChange}
            onSelect={handleAddressSelect}
            searchOptions={{
              componentRestrictions: { country: 'us' }, // Restrict to US addresses
              types: ['address'] // Only return addresses, not businesses
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className="relative">
                <Input
                  {...getInputProps({
                    placeholder: 'Start typing your address...',
                    className: `w-full ${errors.delivery_address ? 'border-destructive' : ''}`
                  })}
                />
                
                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                    {loading && (
                      <div className="p-3 text-sm text-muted-foreground">
                        Loading...
                      </div>
                    )}
                    {suggestions.map((suggestion, index) => (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          key: `suggestion-${index}`,
                          style: {
                            backgroundColor: suggestion.active ? 'hsl(var(--accent))' : 'transparent',
                            cursor: 'pointer',
                          }
                        })}
                        className="p-3 hover:bg-accent border-b border-border last:border-b-0"
                      >
                        <div className="text-sm font-medium text-popover-foreground">{suggestion.formattedSuggestion.mainText}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.formattedSuggestion.secondaryText}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
          {errors.delivery_address && (
            <p className="text-sm text-destructive mt-1">{errors.delivery_address}</p>
          )}
          {/* <p className="text-sm text-muted-foreground mt-1">
            Start typing to see address suggestions. Include any special instructions like gate codes or access requirements.
          </p> */}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
} 