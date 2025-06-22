import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateRentalWithPayment } from '@/lib/checkout';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rentalId, amount, customerEmail, customerName, deliveryAddress, deliveryDate } = body;

    if (!rentalId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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
      customer_email: customerEmail,
      metadata: {
        rentalId: rentalId.toString(),
        customerName,
        deliveryAddress,
        deliveryDate,
      },
    });

    // Update rental with Stripe session ID
    await updateRentalWithPayment(rentalId, 'pending', session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 