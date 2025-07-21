import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });

    const body = await request.json();
    console.log('📋 Received checkout session request:', JSON.stringify(body, null, 2));
    
    const { pendingOrderId, amount, customerEmail, customerName, deliveryAddress, deliveryDate } = body;

    if (!pendingOrderId || !amount || !customerEmail) {
      console.error('❌ Missing required fields:', { pendingOrderId, amount, customerEmail });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if customer already exists in Stripe
    let stripeCustomerId = null;
    try {
      console.log('🔍 Looking up existing Stripe customer for email:', customerEmail);
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
        console.log('✅ Found existing Stripe customer:', stripeCustomerId);
      } else {
        // Create new Stripe customer
        console.log('📝 Creating new Stripe customer for:', customerEmail);
        const customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            pendingOrderId: pendingOrderId.toString(),
          },
        });
        stripeCustomerId = customer.id;
        console.log('✅ Created new Stripe customer:', stripeCustomerId);
      }
    } catch (error) {
      console.error('❌ Error handling Stripe customer:', error);
      console.error('Customer error details:', JSON.stringify(error, null, 2));
      // Fall back to customer_email if customer creation fails
    }

    // Create Stripe checkout session
    console.log('🛒 Creating Stripe checkout session with data:', {
      amount: Math.round(amount * 100),
      customerEmail,
      customerName,
      deliveryAddress,
      deliveryDate,
      stripeCustomerId,
      payment_method_collection: 'always'
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Dumpster Rental',
              description: `Delivery to: ${deliveryAddress} on ${deliveryDate}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      ...(stripeCustomerId ? { customer: stripeCustomerId } : { customer_email: customerEmail }),
      metadata: {
        pendingOrderId: pendingOrderId.toString(),
        customerName,
        deliveryAddress,
        deliveryDate,
        stripeCustomerId: stripeCustomerId || '',
      },
      // Enable automatic email receipts
      payment_method_collection: 'always',
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Dumpster Rental - Delivery to: ${deliveryAddress} on ${deliveryDate}`,
          metadata: {
            type: 'initial_payment',
            delivery_address: deliveryAddress,
            delivery_date: deliveryDate,
          },
        },
      },
    });

    console.log('✅ Checkout session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 