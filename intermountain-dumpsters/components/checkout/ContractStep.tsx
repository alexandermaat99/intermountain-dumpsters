'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertCircle } from 'lucide-react';

interface ContractStepProps {
  contractAccepted: boolean;
  onUpdate: (contractAccepted: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContractStep({ contractAccepted, onUpdate, onNext, onBack }: ContractStepProps) {
  const handleNext = () => {
    if (contractAccepted) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
        <p className="text-muted-foreground">Please review and accept our rental agreement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Dumpster Rental Agreement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-y-auto text-sm">
            <h4 className="font-semibold mb-3">Rental Terms & Conditions</h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium">1. Rental Period</h5>
                <p>Standard rental period is 7 days. Extended rentals available for additional fees.</p>
              </div>

              <div>
                <h5 className="font-medium">2. Delivery & Pickup</h5>
                <p>Delivery and pickup will be scheduled during business hours (7 AM - 5 PM). Customer must ensure access to delivery location.</p>
              </div>

              <div>
                <h5 className="font-medium">3. Prohibited Materials</h5>
                <p>The following materials are NOT allowed: hazardous waste, chemicals, paint, batteries, electronics, tires, appliances with Freon, or any materials requiring special disposal.</p>
              </div>

              <div>
                <h5 className="font-medium">4. Weight Limits</h5>
                <p>Standard weight limit is 2 tons (4,000 lbs). Additional fees apply for overweight loads.</p>
              </div>

              <div>
                <h5 className="font-medium">5. Placement Requirements</h5>
                <p>Dumpster must be placed on a solid, level surface. Customer is responsible for any damage to property during delivery/pickup unless driveway protection insurance is purchased.</p>
              </div>

              <div>
                <h5 className="font-medium">6. Cancellation Policy</h5>
                <p>Cancellations must be made 24 hours before scheduled delivery. Cancellation insurance provides full refund for late cancellations.</p>
              </div>

              <div>
                <h5 className="font-medium">7. Liability</h5>
                <p>Customer is responsible for safe use of dumpster and compliance with local regulations. Intermountain Dumpsters is not liable for damage to property unless caused by our negligence.</p>
              </div>

              <div>
                <h5 className="font-medium">8. Payment</h5>
                <p>Full payment is required at time of booking. Additional charges for overweight loads or extended rentals will be billed separately.</p>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="contract_accepted"
              checked={contractAccepted}
              onCheckedChange={(checked) => onUpdate(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="contract_accepted" className="text-base font-medium cursor-pointer">
                I have read and agree to the Terms & Conditions
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                By checking this box, you acknowledge that you have read, understood, and agree to be bound by the rental agreement.
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              You must accept the terms and conditions to proceed with your rental.
            </p>
          </div> */}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="min-w-[120px]"
          disabled={!contractAccepted}
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 