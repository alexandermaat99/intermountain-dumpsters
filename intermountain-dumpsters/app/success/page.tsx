'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Phone } from 'lucide-react';
import Link from 'next/link';
import { useCartContext } from '@/lib/contexts/CartContext';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { clearCart } = useCartContext();

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart();
      // You could fetch order details here if needed
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• We'll deliver your dumpster on the scheduled date</li>
              <li>• Call us when you're ready for pickup</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
            
            <a href="tel:+1234567890" className="block">
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 