import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateRentalWithPayment } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const rentalId = parseInt(session.metadata?.rentalId || '0');
        
        if (rentalId) {
          await updateRentalWithPayment(rentalId, 'completed', session.id);
          console.log(`Payment completed for rental ${rentalId}`);
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        const expiredRentalId = parseInt(expiredSession.metadata?.rentalId || '0');
        
        if (expiredRentalId) {
          await updateRentalWithPayment(expiredRentalId, 'failed', expiredSession.id);
          console.log(`Payment expired for rental ${expiredRentalId}`);
        }
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle failed payment - you might want to update rental status
        console.log('Payment failed:', paymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 