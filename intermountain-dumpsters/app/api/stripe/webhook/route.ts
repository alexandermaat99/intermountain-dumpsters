import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { confirmPendingOrder } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  try {
    console.log('Webhook received at:', new Date().toISOString());
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook signature verified successfully');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Processing webhook event type:', event.type);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const pendingOrderId = parseInt(session.metadata?.pendingOrderId || '0');
        
        console.log('Checkout session completed:', {
          sessionId: session.id,
          pendingOrderId: pendingOrderId,
          paymentStatus: session.payment_status,
          status: session.status
        });
        
        if (pendingOrderId) {
          console.log('Attempting to confirm pending order:', pendingOrderId);
          try {
            const result = await confirmPendingOrder(pendingOrderId, session.id);
            if (result) {
              console.log(`Payment completed and order confirmed for pending order ${pendingOrderId}`);
            } else {
              console.error(`Failed to confirm pending order ${pendingOrderId} - confirmPendingOrder returned null`);
            }
          } catch (confirmError) {
            console.error(`Error in confirmPendingOrder for pending order ${pendingOrderId}:`, confirmError);
          }
        } else {
          console.error('No pendingOrderId found in session metadata');
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        const expiredPendingOrderId = parseInt(expiredSession.metadata?.pendingOrderId || '0');
        
        console.log('Checkout session expired:', {
          sessionId: expiredSession.id,
          pendingOrderId: expiredPendingOrderId
        });
        
        if (expiredPendingOrderId) {
          // Clean up expired pending order
          const { supabase } = await import('@/lib/supabaseClient');
          const { error } = await supabase
            .from('pending_orders')
            .delete()
            .eq('id', expiredPendingOrderId);
          
          if (error) {
            console.error('Error deleting expired pending order:', error);
          } else {
            console.log(`Expired pending order ${expiredPendingOrderId} cleaned up`);
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
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