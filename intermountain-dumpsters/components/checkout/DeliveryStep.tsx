'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeliveryDetails } from '@/lib/types';
import PlacesAutocomplete from 'react-places-autocomplete';
import { validateDeliveryAddress, quickCityValidation, AddressValidationResult } from '@/lib/address-validation';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DeliveryStepProps {
  delivery: DeliveryDetails;
  onUpdate: (delivery: DeliveryDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SuggestionItem = ({ suggestion, getSuggestionItemProps, onSelect }: { suggestion: any; getSuggestionItemProps: (input: any) => any; onSelect: (address: string) => void; }) => {
  const props = getSuggestionItemProps({ suggestion });
  const { key, onClick, ...otherProps } = props;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Call the original onClick if it exists
    if (onClick) {
      onClick(e);
    }
    // Also manually trigger our handler with the suggestion description
    console.log('Manual click handler with suggestion:', suggestion.description);
    onSelect(suggestion.description);
  };
  
  return (
    <div
      key={key}
      {...otherProps}
      onClick={handleClick}
      className="p-3 hover:bg-muted cursor-pointer text-sm"
    >
      {suggestion.description}
    </div>
  );
};

export default function DeliveryStep({ delivery, onUpdate, onNext, onBack }: DeliveryStepProps) {
  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});
  const [addressValue, setAddressValue] = useState(delivery.delivery_address || '');
  const [addressValidation, setAddressValidation] = useState<AddressValidationResult | null>(null);
  const [validatingAddress, setValidatingAddress] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<DeliveryDetails> = {};
    
    if (!delivery.delivery_date) newErrors.delivery_date = 'Delivery date is required';
    if (!delivery.delivery_address?.trim()) newErrors.delivery_address = 'Delivery address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Check if address is valid before proceeding
      if (addressValidation && !addressValidation.isValid) {
        setErrors(prev => ({ ...prev, delivery_address: 'Address is outside our service area' }));
        return;
      }
      onNext();
    }
  };

  const handleInputChange = (field: keyof DeliveryDetails, value: string) => {
    onUpdate({ ...delivery, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (address: string) => {
    const safeAddress = address || '';
    setAddressValue(safeAddress);
    handleInputChange('delivery_address', safeAddress);
    
    // Clear previous validation
    setAddressValidation(null);
    
    // Only validate if address is substantial enough
    if (safeAddress.trim().length < 10) {
      return;
    }
    
    // Debounce address validation with longer delay
    const timeoutId = setTimeout(() => {
      validateAddress(safeAddress);
    }, 2000); // Increased from 1000ms to 2000ms
    
    return () => clearTimeout(timeoutId);
  };

  const validateAddress = async (address: string) => {
    if (!address || !address.trim() || address.trim().length < 10) {
      setAddressValidation(null);
      return;
    }

    setValidatingAddress(true);
    try {
      // Try full validation first
      const result = await validateDeliveryAddress(address);
      setAddressValidation(result);
    } catch (error) {
      console.error('Full validation failed, trying quick validation:', error);
      // Fallback to quick city validation
      const quickResult = quickCityValidation(address);
      setAddressValidation(quickResult);
    } finally {
      setValidatingAddress(false);
    }
  };

  const handleAddressSelect = async (address: string) => {
    console.log('handleAddressSelect called with:', address);
    
    if (address && address.trim()) {
      setAddressValue(address);
      handleInputChange('delivery_address', address);
      
      // Validate the address after selection
      await validateAddress(address);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get validation status styling
  const getValidationStatus = () => {
    if (!addressValidation) return null;
    
    if (addressValidation.isValid) {
      if (addressValidation.isWithinServiceArea) {
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          className: 'text-green-600',
          bgClassName: 'bg-green-50 border-green-200'
        };
      } else {
        return {
          icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
          className: 'text-yellow-600',
          bgClassName: 'bg-yellow-50 border-yellow-200'
        };
      }
    } else {
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        className: 'text-red-600',
        bgClassName: 'bg-red-50 border-red-200'
      };
    }
  };

  const validationStatus = getValidationStatus();

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
            value={addressValue || ''}
            onChange={handleAddressChange}
            onSelect={handleAddressSelect}
            searchOptions={{
              componentRestrictions: { country: 'us' }
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
                      <SuggestionItem 
                        key={`suggestion-${index}`}
                        suggestion={suggestion} 
                        getSuggestionItemProps={getSuggestionItemProps} 
                        onSelect={handleAddressSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
          
          {/* Address validation status */}
          {validatingAddress && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
              Validating address...
            </div>
          )}
          
          {addressValidation && validationStatus && (
            <div className={`flex items-start gap-2 mt-2 p-3 rounded-md border ${validationStatus.bgClassName}`}>
              {validationStatus.icon}
              <div className={`text-sm ${validationStatus.className}`}>
                {addressValidation.message}
                {addressValidation.distance && (
                  <div className="text-xs mt-1 opacity-75">
                    Distance: {addressValidation.distance.toFixed(1)} miles
                  </div>
                )}
              </div>
            </div>
          )}
          
          {errors.delivery_address && (
            <p className="text-sm text-destructive mt-1">{errors.delivery_address}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="min-w-[120px]"
          disabled={addressValidation ? !addressValidation.isValid : false}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 