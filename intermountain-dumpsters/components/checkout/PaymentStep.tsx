'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutData, CartItem, CartState } from '@/lib/types';
import { CreditCard, ArrowLeft, CheckCircle, User, MapPin } from 'lucide-react';
import { useContactInfo } from '@/lib/hooks/useContactInfo';
import { createPendingOrder } from '@/lib/checkout';
import { calculateTaxFromServiceArea, TaxInfo, formatTaxDisplay } from '@/lib/tax-calculator-db';

interface PaymentStepProps {
  checkoutData: CheckoutData;
  cart: CartState;
  insuranceTotal: number;
  total: number;
  onBack: () => void;
}

export default function PaymentStep({ checkoutData, cart, insuranceTotal, total, onBack }: PaymentStepProps) {
  const { contactInfo } = useContactInfo();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBillingAddress, setShowBillingAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip: ''
  });
  const [billingErrors, setBillingErrors] = useState<{[key: string]: string}>({});
  const [taxInfo, setTaxInfo] = useState<TaxInfo | null>(null);

  // Initialize billing address from checkoutData if it exists
  useEffect(() => {
    if (checkoutData.billing) {
      setBillingAddress({
        address_line_1: checkoutData.billing.address_line_1,
        address_line_2: checkoutData.billing.address_line_2 || '',
        city: checkoutData.billing.city,
        state: checkoutData.billing.state,
        zip: checkoutData.billing.zip
      });
      setShowBillingAddress(true);
    }
  }, [checkoutData.billing]);

  // Calculate tax based on delivery address
  useEffect(() => {
    const calculateTax = async () => {
      if (!checkoutData.delivery.delivery_address) {
        setTaxInfo(null);
        return;
      }
      
      try {
        const calculatedTax = await calculateTaxFromServiceArea(
          cart.total + insuranceTotal,
          checkoutData.delivery.delivery_address
        );
        setTaxInfo(calculatedTax);
      } catch (error) {
        console.error('Error calculating tax:', error);
        setTaxInfo(null);
      }
    };

    calculateTax();
  }, [cart.total, insuranceTotal, checkoutData.delivery.delivery_address]);

  const formatDrivewayInsurancePrice = () => {
    return `$${contactInfo?.driveway_insurance || 40}`;
  };

  const formatCancellationInsurancePrice = () => {
    return `$${contactInfo?.cancelation_insurance || 40}`;
  };

  const formatRushDeliveryPrice = () => {
    return `$${contactInfo?.rush_fee || 60}`;
  };

  const validateBillingAddress = () => {
    const errors: {[key: string]: string} = {};
    
    if (showBillingAddress) {
      if (!billingAddress.address_line_1.trim()) {
        errors.address_line_1 = 'Billing address is required';
      }
      if (!billingAddress.city.trim()) {
        errors.city = 'City is required';
      }
      if (!billingAddress.state.trim()) {
        errors.state = 'State is required';
      }
      if (!billingAddress.zip.trim()) {
        errors.zip = 'ZIP code is required';
      }
    }
    
    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
    if (billingErrors[field]) {
      setBillingErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProceedToPayment = async () => {
    if (!validateBillingAddress()) {
      return;
    }

    if (!taxInfo) {
      alert('Please wait for tax calculation to complete.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Determine the address to use for customer table
      let customerAddress = checkoutData.customer;
      
      if (!showBillingAddress) {
        // Use delivery address for billing (same as delivery)
        // Parse delivery address to extract components
        const deliveryParts = checkoutData.delivery.delivery_address.split(',').map(part => part.trim());
        customerAddress = {
          ...customerAddress,
          address_line_1: deliveryParts[0] || '',
          city: deliveryParts[1] || '',
          state: deliveryParts[2] || '',
          zip: deliveryParts[3] || ''
        };
      } else {
        // Use billing address
        customerAddress = {
          ...customerAddress,
          address_line_1: billingAddress.address_line_1,
          address_line_2: billingAddress.address_line_2,
          city: billingAddress.city,
          state: billingAddress.state,
          zip: billingAddress.zip
        };
      }

      // Save checkout data with billing address and cart
      const checkoutDataWithBilling = {
        ...checkoutData,
        billing: showBillingAddress ? billingAddress : undefined,
        cart: cart
      };

      const result = await createPendingOrder(checkoutDataWithBilling, taxInfo.total, customerAddress);

      if (result) {
        // Redirect to Stripe checkout
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('Failed to create pending order');
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('An error occurred while processing your checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!taxInfo) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculating tax based on delivery location...</p>
        </div>
      </div>
    );
  }

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
                      <span>{formatDrivewayInsurancePrice()}</span>
                    </div>
                  )}
                  {checkoutData.insurance.cancelation_insurance && (
                    <div className="flex justify-between">
                      <span>Cancellation Insurance</span>
                      <span>{formatCancellationInsurancePrice()}</span>
                    </div>
                  )}
                  {checkoutData.insurance.emergency_delivery && (
                    <div className="flex justify-between">
                      <span>Rush Delivery (2 Hours)</span>
                      <span>{formatRushDeliveryPrice()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tax Breakdown */}
            {taxInfo && (
              <div className="border-t pt-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${taxInfo.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <div>
                      <div>Sales Tax</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTaxDisplay(taxInfo)}
                      </div>
                    </div>
                    <span>${taxInfo.taxAmount.toFixed(2)}</span>
                  </div>
                  {taxInfo.serviceArea && (
                    <div className="text-xs text-muted-foreground ml-4">
                      Based on {taxInfo.serviceArea.name} service area
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${taxInfo?.total.toFixed(2) || total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tax calculated based on delivery address
              </p>
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
              <div className="md:col-span-2">
                <Label htmlFor="billing_address">Billing Address *</Label>
                <Input
                  id="billing_address"
                  placeholder="Enter billing address"
                  className={`mt-1 ${billingErrors.address_line_1 ? 'border-destructive' : ''}`}
                  value={billingAddress.address_line_1}
                  onChange={(e) => handleBillingAddressChange('address_line_1', e.target.value)}
                />
                {billingErrors.address_line_1 && (
                  <p className="text-sm text-destructive mt-1">{billingErrors.address_line_1}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="billing_address_2">Address Line 2 (Optional)</Label>
                <Input
                  id="billing_address_2"
                  placeholder="Apartment, suite, etc."
                  className="mt-1"
                  value={billingAddress.address_line_2}
                  onChange={(e) => handleBillingAddressChange('address_line_2', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billing_city">City *</Label>
                <Input
                  id="billing_city"
                  placeholder="City"
                  className={`mt-1 ${billingErrors.city ? 'border-destructive' : ''}`}
                  value={billingAddress.city}
                  onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                />
                {billingErrors.city && (
                  <p className="text-sm text-destructive mt-1">{billingErrors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="billing_state">State *</Label>
                <Input
                  id="billing_state"
                  placeholder="State"
                  className={`mt-1 ${billingErrors.state ? 'border-destructive' : ''}`}
                  value={billingAddress.state}
                  onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                />
                {billingErrors.state && (
                  <p className="text-sm text-destructive mt-1">{billingErrors.state}</p>
                )}
              </div>
              <div>
                <Label htmlFor="billing_zip">ZIP Code *</Label>
                <Input
                  id="billing_zip"
                  placeholder="ZIP Code"
                  className={`mt-1 ${billingErrors.zip ? 'border-destructive' : ''}`}
                  value={billingAddress.zip}
                  onChange={(e) => handleBillingAddressChange('zip', e.target.value)}
                />
                {billingErrors.zip && (
                  <p className="text-sm text-destructive mt-1">{billingErrors.zip}</p>
                )}
              </div>
            </div>
          )}

          <div className="pt-4">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h4 className="font-medium">Secure Payment</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your payment will be processed securely through stripe. We accept all major credit cards and PayPal.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>SSL Encrypted</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>PCI Compliant</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Consent Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Follow-Up Charges
              </h4>
              <p className="text-xs text-blue-700">
                After your rental period, you may receive an invoice for additional charges such as weight-based fees or extra days. 
                These invoices will be sent via email and can be paid securely online.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4 pb-6 md:pb-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleProceedToPayment} 
          className="min-w-[200px]"
          disabled={isProcessing || !taxInfo}
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