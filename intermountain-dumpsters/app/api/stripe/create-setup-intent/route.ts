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
    console.log('📋 Received setup intent request:', JSON.stringify(body, null, 2));
    
    const { customerId, rentalId } = body;

    if (!customerId) {
      console.error('❌ Missing required field: customerId');
      return NextResponse.json(
        { error: 'Missing required field: customerId' },
        { status: 400 }
      );
    }

    // Verify the customer exists in our database
    console.log('🔍 Verifying customer exists:', customerId);
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, email, stripe_customer_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (customerError || !customer) {
      console.error('❌ Customer not found in database:', customerError);
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    console.log('✅ Customer verified:', customer.email);

    // Create a SetupIntent for saving the payment method
    console.log('🛒 Creating SetupIntent for customer:', customerId);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session', // Allow off-session usage for follow-up charges
      metadata: {
        customer_id: customer.id.toString(),
        customer_email: customer.email,
        rental_id: rentalId?.toString() || '',
        setup_type: 'follow_up_charges',
      },
    });

    console.log('✅ SetupIntent created:', setupIntent.id);
    console.log('Client secret:', setupIntent.client_secret);

    return NextResponse.json({
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    });

  } catch (error) {
    console.error('❌ Error creating setup intent:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Failed to create setup intent: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 