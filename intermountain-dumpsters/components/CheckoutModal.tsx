'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useCartContext } from '@/lib/contexts/CartContext';
import { CheckoutData, CheckoutStep, CustomerInfo, DeliveryDetails, InsuranceOptions } from '@/lib/types';
import CustomerInfoStep from './checkout/CustomerInfoStep';
import DeliveryStep from './checkout/DeliveryStep';
import InsuranceStep from './checkout/InsuranceStep';
import ContractStep from './checkout/ContractStep';
import PaymentStep from './checkout/PaymentStep';
import { useContactInfo } from '@/lib/hooks/useContactInfo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps: { key: CheckoutStep; label: string; description: string }[] = [
  { key: 'customer', label: 'Customer Info', description: 'Name & phone' },
  { key: 'delivery', label: 'Delivery', description: 'Date & address' },
  { key: 'insurance', label: 'Insurance', description: 'Optional coverage' },
  { key: 'contract', label: 'Contract', description: 'Terms & conditions' },
  { key: 'payment', label: 'Payment', description: 'Billing & payment' },
];

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart } = useCartContext();
  const { contactInfo } = useContactInfo();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('customer');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer: {
      first_name: '',
      last_name: '',
      phone_number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      zip: '',
      business: false,
    },
    delivery: {
      delivery_date: '',
      delivery_address: '',
    },
    insurance: {
      driveway_insurance: false,
      cancelation_insurance: false,
      emergency_delivery: false,
    },
    contract_accepted: false,
  });

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('customer');
    }
  }, [isOpen]);

  const updateCustomerInfo = (customer: CustomerInfo) => {
    setCheckoutData(prev => ({ ...prev, customer }));
  };

  const updateDeliveryDetails = (delivery: DeliveryDetails) => {
    setCheckoutData(prev => ({ ...prev, delivery }));
  };

  const updateInsuranceOptions = (insurance: InsuranceOptions) => {
    setCheckoutData(prev => ({ ...prev, insurance }));
  };

  const updateContractAccepted = (contract_accepted: boolean) => {
    setCheckoutData(prev => ({ ...prev, contract_accepted }));
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  const calculateInsuranceTotal = () => {
    let total = 0;
    if (checkoutData.insurance.driveway_insurance) {
      total += contactInfo?.driveway_insurance || 40;
    }
    if (checkoutData.insurance.cancelation_insurance) {
      total += contactInfo?.cancelation_insurance || 40;
    }
    if (checkoutData.insurance.emergency_delivery) {
      total += contactInfo?.rush_fee || 60;
    }
    return total;
  };

  const totalWithInsurance = cart.total + calculateInsuranceTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 md:p-4">
      <div
        className="w-full h-full max-w-none max-h-none rounded-none shadow-none bg-background flex flex-col
        md:w-full md:max-w-4xl md:max-h-[90vh] md:rounded-lg md:shadow-xl md:overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-lg md:text-xl font-semibold">Checkout</h2>
              <p className="text-sm text-muted-foreground">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-base md:text-lg font-semibold">${totalWithInsurance.toFixed(2)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                      index <= getCurrentStepIndex()
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < getCurrentStepIndex() ? (
                      <Check className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="hidden sm:block mt-1 md:mt-2 text-center">
                    <p className="text-xs font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-1 md:mx-2 ${
                      index < getCurrentStepIndex() ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentStep === 'customer' && (
            <CustomerInfoStep
              customer={checkoutData.customer}
              onUpdate={updateCustomerInfo}
              onNext={nextStep}
            />
          )}
          {currentStep === 'delivery' && (
            <DeliveryStep
              delivery={checkoutData.delivery}
              onUpdate={updateDeliveryDetails}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'insurance' && (
            <InsuranceStep
              insurance={checkoutData.insurance}
              onUpdate={updateInsuranceOptions}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'contract' && (
            <ContractStep
              contractAccepted={checkoutData.contract_accepted}
              onUpdate={updateContractAccepted}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 'payment' && (
            <PaymentStep
              checkoutData={checkoutData}
              cart={cart}
              insuranceTotal={calculateInsuranceTotal()}
              total={totalWithInsurance}
              onBack={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
} 