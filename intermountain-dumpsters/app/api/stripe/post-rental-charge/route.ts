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
    console.log('📋 Received follow-up charge request:', JSON.stringify(body, null, 2));
    
    const { rentalId, amount, description } = body;

    if (!rentalId || !amount || !description) {
      console.error('❌ Missing required fields:', { rentalId, amount, description });
      return NextResponse.json(
        { error: 'Missing required fields: rentalId, amount, description' },
        { status: 400 }
      );
    }

    // Get the rental and customer information
    console.log('🔍 Looking up rental:', rentalId);
    const { data: rental, error: rentalError } = await supabaseAdmin
      .from('rentals')
      .select(`
        *,
        customer:customers(stripe_customer_id, email, first_name, last_name)
      `)
      .eq('id', rentalId)
      .single();

    if (rentalError || !rental) {
      console.error('❌ Error fetching rental:', rentalError);
      console.error('Rental data:', rental);
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found rental:', rental.id);
    console.log('Customer data:', rental.customer);

    if (!rental.customer?.stripe_customer_id) {
      console.error('❌ Customer has no Stripe customer ID');
      return NextResponse.json(
        { error: 'Customer has no Stripe customer ID' },
        { status: 400 }
      );
    }

    // Get the customer's default payment method
    let paymentMethodId = null;
    try {
      console.log('🔍 Retrieving customer payment methods for:', rental.customer.stripe_customer_id);
      const customer = await stripe.customers.retrieve(rental.customer.stripe_customer_id) as Stripe.Customer;
      console.log('✅ Customer retrieved:', customer.id);
      console.log('Customer invoice settings:', customer.invoice_settings);
      
      if (customer.invoice_settings?.default_payment_method) {
        paymentMethodId = customer.invoice_settings.default_payment_method as string;
        console.log('✅ Found default payment method:', paymentMethodId);
      } else {
        console.log('⚠️ No default payment method found');
      }
    } catch (error) {
      console.error('❌ Error retrieving customer payment method:', error);
      console.error('Payment method error details:', JSON.stringify(error, null, 2));
    }

    // Create a payment intent for the follow-up charge
    const paymentIntentData: any = {
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: rental.customer.stripe_customer_id,
      description: description,
      metadata: {
        rental_id: rentalId.toString(),
        charge_type: 'follow_up_charge',
        customer_email: rental.customer.email,
      },
    };

    // Use saved payment method if available
    if (paymentMethodId) {
      paymentIntentData.payment_method = paymentMethodId;
      paymentIntentData.confirm = true; // Automatically confirm the payment
      paymentIntentData.off_session = true; // Charge without customer present
      console.log('✅ Using saved payment method for automatic charge');
    } else {
      // No saved payment method - create unconfirmed payment intent
      paymentIntentData.automatic_payment_methods = {
        enabled: true,
      };
      console.log('⚠️ No saved payment method found - customer will need to provide payment method');
    }

    console.log('🛒 Creating payment intent with data:', paymentIntentData);
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
    console.log('✅ Payment intent created:', paymentIntent.id);

    // Check if payment was automatically confirmed
    if (paymentIntent.status === 'succeeded') {
      // Update the rental with the completed charge information
      const { error: updateError } = await supabaseAdmin
        .from('rentals')
        .update({
          follow_up_charge_amount: amount,
          follow_up_charge_status: 'completed',
          follow_up_charge_intent_id: paymentIntent.id,
          follow_up_charge_date: new Date().toISOString(),
          follow_up_charge_completed_at: new Date().toISOString(),
        })
        .eq('id', rentalId);

      if (updateError) {
        console.error('❌ Error updating rental:', updateError);
        return NextResponse.json(
          { error: 'Failed to update rental with charge information' },
          { status: 500 }
        );
      }

      console.log('✅ Follow-up charge completed successfully');
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        message: 'Follow-up charge processed successfully',
      });
    } else {
      // Payment intent created but not confirmed - customer needs to provide payment method
      console.log('⚠️ Payment intent created but not confirmed - requires customer action');
      
      // Update the rental with the pending charge information
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
        console.error('❌ Error updating rental:', updateError);
        return NextResponse.json(
          { error: 'Failed to update rental record' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: false,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        message: 'Customer needs to provide payment method for follow-up charge',
        requiresCustomerAction: true,
      });
    }

  } catch (error) {
    console.error('❌ Error creating follow-up charge:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Failed to create follow-up charge: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 