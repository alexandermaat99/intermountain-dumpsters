import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rentalId, amount, description } = body;

    if (!rentalId || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: rentalId, amount, description' },
        { status: 400 }
      );
    }

    // Get the rental and customer information
    const { data: rental, error: rentalError } = await supabaseAdmin
      .from('rentals')
      .select(`
        *,
        customer:customers(stripe_customer_id, email, first_name, last_name)
      `)
      .eq('id', rentalId)
      .single();

    if (rentalError || !rental) {
      console.error('Error fetching rental:', rentalError);
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      );
    }

    if (!rental.customer?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Customer has no Stripe customer ID' },
        { status: 400 }
      );
    }

    // Create a payment intent for the follow-up charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: rental.customer.stripe_customer_id,
      description: description,
      metadata: {
        rental_id: rentalId.toString(),
        charge_type: 'follow_up_charge',
        customer_email: rental.customer.email,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update the rental with the payment intent information
    const { error: updateError } = await supabaseAdmin
      .from('rentals')
      .update({
        follow_up_charge_amount: amount,
        follow_up_charge_status: 'pending',
        follow_up_charge_intent_id: paymentIntent.id,
        follow_up_charge_date: new Date().toISOString(),
      })
      .eq('id', rentalId);

    if (updateError) {
      console.error('Error updating rental:', updateError);
      return NextResponse.json(
        { error: 'Failed to update rental record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
    });

  } catch (error) {
    console.error('Error creating follow-up charge:', error);
    return NextResponse.json(
      { error: 'Failed to create follow-up charge' },
      { status: 500 }
    );
  }
} 