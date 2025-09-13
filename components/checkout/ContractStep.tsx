'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useContactInfo } from '@/lib/hooks/useContactInfo';

interface ContractStepProps {
  contractAccepted: boolean;
  onUpdate: (contractAccepted: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContractStep({ contractAccepted, onUpdate, onNext, onBack }: ContractStepProps) {
  const { contactInfo } = useContactInfo();
  
  const handleNext = () => {
    if (contractAccepted) {
      onNext();
    }
  };

  // Format the price per pound for display
  const formatPricePerLb = () => {
    const price = contactInfo?.price_per_lb || 0.03;
    return `$${price.toFixed(2)}`;
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
                <h5 className="font-medium">1. Rental Period & Pricing</h5>
                <p>Initial rental price covers the first day. Additional days are charged at $20 per day. Rental period begins on delivery date.</p>
              </div>

              <div>
                <h5 className="font-medium">2. Weight Charges</h5>
                <p>All dumpster contents are weighed upon pickup and charged at {formatPricePerLb()} per pound. You will receive a follow-up invoice for the total weight charges after pickup.</p>
              </div>

              <div>
                <h5 className="font-medium">3. Follow-Up Billing</h5>
                <p>After dumpster pickup, you will receive a separate invoice for any additional charges including: per-pound weight charges at {formatPricePerLb()}/lb for all contents, extended rental days beyond the first day ($20/day), and any other applicable fees.</p>
              </div>

              <div>
                <h5 className="font-medium">4. Delivery & Pickup</h5>
                <p>Delivery and pickup will be scheduled during business hours (7 AM - 5 PM). Customer must ensure access to delivery location.</p>
              </div>

              <div>
                <h5 className="font-medium">5. Prohibited Materials</h5>
                <p>The following materials are NOT allowed: hazardous waste, chemicals, paint, batteries, electronics, tires, appliances with Freon, or any materials requiring special disposal.</p>
              </div>

              <div>
                <h5 className="font-medium">6. Placement Requirements</h5>
                <p>Dumpster must be placed on a solid, level surface. Customer is responsible for any damage to property during delivery/pickup unless driveway protection insurance is purchased.</p>
              </div>

              <div>
                <h5 className="font-medium">7. Cancellation Policy</h5>
                <p>Cancellations must be made 24 hours before scheduled delivery. Cancellation insurance provides full refund for late cancellations.</p>
              </div>

              <div>
                <h5 className="font-medium">8. Liability & Property Damage</h5>
                <p>Customer is responsible for safe use of dumpster and compliance with local regulations. Customer is liable for any damage to property during delivery, placement, or pickup unless driveway protection insurance is purchased. Intermountain Dumpsters is not liable for damage to property unless caused by our negligence.</p>
              </div>

              <div>
                <h5 className="font-medium">9. Payment</h5>
                <p>Initial payment is required at time of booking for the first day rental. All additional charges will be billed separately after pickup via follow-up invoice.</p>
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

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">ℹ</span>
              </div>
              <div>
                <h6 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Important Billing Information</h6>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Initial payment covers only the first day.</strong> You will receive a follow-up invoice after pickup for any additional charges including $20/day for extra rental days and {formatPricePerLb()}/lb charges for all dumpster contents.
                </p>
              </div>
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

      <div className="flex justify-between pt-4 pb-6 md:pb-4">
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