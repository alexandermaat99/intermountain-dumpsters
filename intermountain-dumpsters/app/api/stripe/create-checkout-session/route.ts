import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-05-28.basil',
    });

    const body = await request.json();
    const { pendingOrderId, amount, customerEmail, customerName, deliveryAddress, deliveryDate } = body;

    if (!pendingOrderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if customer already exists in Stripe
    let stripeCustomerId = null;
    try {
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            pendingOrderId: pendingOrderId.toString(),
          },
        });
        stripeCustomerId = customer.id;
      }
    } catch (error) {
      console.error('Error handling Stripe customer:', error);
      // Fall back to customer_email if customer creation fails
    }

    // Create Stripe checkout session
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
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 