"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Phone, CreditCard, Shield } from 'lucide-react';
import { useCartContext } from '@/lib/contexts/CartContext';
import SaveCardModal from '@/components/SaveCardModal';

export default function SuccessContent({ phone, baseUrl }: { phone: string, baseUrl: string }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartContext();
  const [showSaveCardModal, setShowSaveCardModal] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [rentalId, setRentalId] = useState<string | null>(null);
  const [hasSavedCard, setHasSavedCard] = useState(false);

  useEffect(() => {
    if (sessionId) {
      clearCart();
      // Get customer and rental info from the session
      fetchCustomerInfo(sessionId);
    }
  }, [sessionId, clearCart]);

  const fetchCustomerInfo = async (sessionId: string) => {
    try {
      // You'll need to create an API endpoint to get customer info from session
      // For now, we'll use a placeholder approach
      const response = await fetch(`/api/stripe/get-session-info?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerId(data.customerId);
        setRentalId(data.rentalId);
        setHasSavedCard(data.hasSavedCard);
      }
    } catch (error) {
      console.error('Error fetching customer info:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <p className="text-muted-foreground">
            Thank you for your dumpster rental order.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Your order has been confirmed and payment has been processed successfully.
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground break-all">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You&apos;ll receive a confirmation email shortly</li>
              <li>• We&apos;ll deliver your dumpster on the scheduled date</li>
              <li>• Call us when you&apos;re ready for pickup</li>
            </ul>
          </div>

          {/* Save Card Section - Only show if customer doesn't have a saved card */}
          {customerId && !hasSavedCard && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Enable Automatic Follow-Up Charges
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Save your payment method to enable automatic charges for weight and additional days. 
                    No action required from you - charges happen automatically.
                  </p>
                  <Button
                    onClick={() => setShowSaveCardModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Save Payment Method
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <a href={baseUrl}>
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </a>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="block">
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>
          </div>

          {/* Save Card Modal */}
          {customerId && (
            <SaveCardModal
              isOpen={showSaveCardModal}
              onClose={() => setShowSaveCardModal(false)}
              customerId={customerId}
              rentalId={rentalId || undefined}
              onSuccess={() => setHasSavedCard(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 