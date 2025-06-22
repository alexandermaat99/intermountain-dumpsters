'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutData, CartItem } from '@/lib/types';
import { CartState } from '@/lib/contexts/CartContext';
import { CreditCard, ArrowLeft, CheckCircle, User, MapPin } from 'lucide-react';

interface PaymentStepProps {
  checkoutData: CheckoutData;
  cart: CartState;
  insuranceTotal: number;
  total: number;
  onBack: () => void;
}

export default function PaymentStep({ checkoutData, cart, insuranceTotal, total, onBack }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillingAddress, setShowBillingAddress] = useState(false);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    
    try {
      // TODO: Save order to database
      // TODO: Generate Squarespace checkout URL
      // TODO: Redirect to Squarespace
      
      // For now, simulate the process
      setTimeout(() => {
        // This would be replaced with actual Squarespace integration
        window.open('https://www.squarespace.com', '_blank');
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Complete Your Order</h3>
        <p className="text-muted-foreground">Review your order details and provide billing information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {cart.items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {insuranceTotal > 0 && (
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Additional Services</h4>
                <div className="space-y-2 text-sm">
                  {checkoutData.insurance.driveway_insurance && (
                    <div className="flex justify-between">
                      <span>Driveway Protection Insurance</span>
                      <span>$40.00</span>
                    </div>
                  )}
                  {checkoutData.insurance.cancelation_insurance && (
                    <div className="flex justify-between">
                      <span>Cancellation Insurance</span>
                      <span>$40.00</span>
                    </div>
                  )}
                  {checkoutData.insurance.emergency_delivery && (
                    <div className="flex justify-between">
                      <span>Rush Delivery (2 Hours)</span>
                      <span>$60.00</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Delivery Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer & Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h4>
              <div className="text-sm space-y-1">
                <p><strong>{checkoutData.customer.business ? 'Company:' : 'Name:'}</strong> {
                  checkoutData.customer.business 
                    ? checkoutData.customer.first_name 
                    : `${checkoutData.customer.first_name} ${checkoutData.customer.last_name}`
                }</p>
                <p><strong>Phone:</strong> {checkoutData.customer.phone_number}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Information
              </h4>
              <div className="text-sm space-y-1">
                <p><strong>Delivery Date:</strong> {new Date(checkoutData.delivery.delivery_date).toLocaleDateString()}</p>
                <p><strong>Delivery Address:</strong></p>
                <p className="ml-4 whitespace-pre-wrap">{checkoutData.delivery.delivery_address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Address Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="same_as_delivery"
              checked={!showBillingAddress}
              onChange={(e) => setShowBillingAddress(!e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="same_as_delivery" className="text-sm">
              Billing address same as delivery address
            </Label>
          </div>

          {showBillingAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="billing_address">Billing Address *</Label>
                <Input
                  id="billing_address"
                  placeholder="Enter billing address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="billing_city">City *</Label>
                <Input
                  id="billing_city"
                  placeholder="City"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="billing_state">State *</Label>
                <Input
                  id="billing_state"
                  placeholder="State"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="billing_zip">ZIP Code *</Label>
                <Input
                  id="billing_zip"
                  placeholder="ZIP Code"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h4 className="font-medium">Secure Payment</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your payment will be processed securely through Squarespace. We accept all major credit cards and PayPal.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>SSL Encrypted</span>
              <span>•</span>
              <span>PCI Compliant</span>
              <span>•</span>
              <span>Secure Checkout</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleProceedToPayment} 
          className="min-w-[200px]"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 