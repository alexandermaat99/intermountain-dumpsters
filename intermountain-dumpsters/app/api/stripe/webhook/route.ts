import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { confirmPendingOrder } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Webhook received at:', new Date().toISOString());
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    console.log('Webhook secret exists:', !!webhookSecret);
    console.log('Signature exists:', !!signature);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified successfully');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Processing webhook event type:', event.type);
    console.log('Event ID:', event.id);

    // Handle the event
    switch (event.type) {

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





      case 'invoice.payment_succeeded':
        const paidInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', paidInvoice.id);
        
        // Handle follow-up charge invoice payment success
        if (paidInvoice.metadata?.charge_type === 'follow_up_charge') {
          const rentalId = paidInvoice.metadata?.rental_id;
          if (rentalId) {
            const { supabase } = await import('@/lib/supabaseClient');
            const { error } = await supabase
              .from('rentals')
              .update({
                follow_up_charge_status: 'completed',
                follow_up_charge_completed_at: new Date().toISOString(),
              })
              .eq('id', rentalId);
            
            if (error) {
              console.error('Error updating rental follow-up charge status:', error);
            } else {
              console.log(`Updated rental ${rentalId} follow-up charge status to completed`);
            }
          }
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', failedInvoice.id);
        
        // Handle follow-up charge invoice payment failure
        if (failedInvoice.metadata?.charge_type === 'follow_up_charge') {
          const rentalId = failedInvoice.metadata?.rental_id;
          if (rentalId) {
            const { supabase } = await import('@/lib/supabaseClient');
            const { error } = await supabase
              .from('rentals')
              .update({
                follow_up_charge_status: 'failed',
              })
              .eq('id', rentalId);
            
            if (error) {
              console.error('Error updating rental follow-up charge status:', error);
            } else {
              console.log(`Updated rental ${rentalId} follow-up charge status to failed`);
            }
          }
        }
        break;

      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const pendingOrderId = parseInt(session.metadata?.pendingOrderId || '0');
        
        console.log('=== CHECKOUT SESSION COMPLETED ===');
        console.log('Session ID:', session.id);
        console.log('Pending Order ID:', pendingOrderId);
        console.log('Payment Status:', session.payment_status);
        console.log('Session Status:', session.status);
        console.log('Session Metadata:', session.metadata);
        
        if (pendingOrderId) {
          console.log('✅ Found pendingOrderId, attempting to confirm order:', pendingOrderId);
          try {
            const result = await confirmPendingOrder(pendingOrderId, session.id);
            if (result) {
              console.log('✅ Payment completed and order confirmed for pending order', pendingOrderId);
              console.log('✅ Created rental with ID:', result.rental_id);
              console.log('✅ Customer ID:', result.customer_id);
              
              // If payment method was collected, it's automatically saved to the customer
              if (session.payment_method_collection === 'always') {
                console.log('✅ Payment method saved for future use');
              }
            } else {
              console.error('❌ Failed to confirm pending order', pendingOrderId, '- confirmPendingOrder returned null');
            }
          } catch (confirmError) {
            console.error('❌ Error in confirmPendingOrder for pending order', pendingOrderId, ':', confirmError);
          }
        } else {
          console.error('❌ No pendingOrderId found in session metadata');
          console.log('Available metadata keys:', Object.keys(session.metadata || {}));
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log('=== WEBHOOK PROCESSING COMPLETE ===');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 