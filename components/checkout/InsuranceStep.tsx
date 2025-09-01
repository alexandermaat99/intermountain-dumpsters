'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InsuranceOptions } from '@/lib/types';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { useContactInfo } from '@/lib/hooks/useContactInfo';

interface InsuranceStepProps {
  insurance: InsuranceOptions;
  onUpdate: (insurance: InsuranceOptions) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function InsuranceStep({ insurance, onUpdate, onNext, onBack }: InsuranceStepProps) {
  const { contactInfo } = useContactInfo();
  
  const handleInsuranceChange = (field: keyof InsuranceOptions, checked: boolean) => {
    onUpdate({ ...insurance, [field]: checked });
  };

  // Format the price per pound for display
  const formatPricePerLb = () => {
    const price = contactInfo?.price_per_lb || 0.03;
    return `$${price.toFixed(2)}`;
  };

  // Format the day rate for display
  const formatDayRate = () => {
    const rate = contactInfo?.day_rate || 20;
    return `$${rate}`;
  };

  // Format the driveway insurance price for display
  const formatDrivewayInsurance = () => {
    const price = contactInfo?.driveway_insurance || 40;
    return `+$${price}`;
  };

  // Format the cancellation insurance price for display
  const formatCancellationInsurance = () => {
    const price = contactInfo?.cancelation_insurance || 40;
    return `+$${price}`;
  };

  // Format the rush delivery fee for display
  const formatRushDeliveryFee = () => {
    const fee = contactInfo?.rush_fee || 60;
    return `+$${fee}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Insurance & Delivery Options</h3>
        <p className="text-muted-foreground">Select any additional coverage you&apos;d like for your rental</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="driveway_insurance"
                checked={insurance.driveway_insurance}
                onCheckedChange={(checked) => handleInsuranceChange('driveway_insurance', checked as boolean)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <Label htmlFor="driveway_insurance" className="text-base font-medium cursor-pointer">
                    Driveway Protection Insurance
                  </Label>
                  <span className="text-sm font-semibold text-primary">{formatDrivewayInsurance()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Protects your driveway from damage during delivery and pickup. Covers repairs up to $500.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="cancelation_insurance"
                checked={insurance.cancelation_insurance}
                onCheckedChange={(checked) => handleInsuranceChange('cancelation_insurance', checked as boolean)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <Label htmlFor="cancelation_insurance" className="text-base font-medium cursor-pointer">
                    Cancellation Insurance
                  </Label>
                  <span className="text-sm font-semibold text-primary">{formatCancellationInsurance()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Allows you to cancel your rental anytime before delivery with a full refund.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="emergency_delivery"
                checked={insurance.emergency_delivery}
                onCheckedChange={(checked) => handleInsuranceChange('emergency_delivery', checked as boolean)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <Label htmlFor="emergency_delivery" className="text-base font-medium cursor-pointer">
                    Rush Delivery (Within 2 Hours)
                  </Label>
                  <span className="text-sm font-semibold text-primary">{formatRushDeliveryFee()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll deliver your dumpster within 2 hours of your call for an additional fee.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">What you should know:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Additional Day Rate only {formatDayRate()}/Day</li>
          <li>• All waste/debris is billed at {formatPricePerLb()}/Lb</li>
          <li>• Call us when you&apos;re done for prompt pickup</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4 pb-6 md:pb-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
} 