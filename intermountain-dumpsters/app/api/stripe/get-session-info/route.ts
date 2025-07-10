import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    console.log('🔍 Getting session info for:', sessionId);

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Session retrieved:', session.id);

    if (!session.customer) {
      return NextResponse.json(
        { error: 'No customer found in session' },
        { status: 404 }
      );
    }

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
    console.log('✅ Customer ID from session:', customerId);

    // Get customer info from our database
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, email, stripe_customer_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (customerError || !customer) {
      console.error('❌ Customer not found in database:', customerError);
      return NextResponse.json(
        { error: 'Customer not found in database' },
        { status: 404 }
      );
    }

    // Get the most recent rental for this customer
    const { data: rental, error: rentalError } = await supabaseAdmin
      .from('rentals')
      .select('id')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (rentalError) {
      console.log('⚠️ No rental found for customer:', customerError);
    }

    // Check if customer has saved payment methods
    let hasSavedCard = false;
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      hasSavedCard = paymentMethods.data.length > 0;
      console.log('📊 Payment methods found:', paymentMethods.data.length);
    } catch (error) {
      console.error('❌ Error checking payment methods:', error);
    }

    console.log('✅ Session info retrieved successfully');
    return NextResponse.json({
      success: true,
      customerId,
      rentalId: rental?.id || null,
      hasSavedCard,
      customerEmail: customer.email,
    });

  } catch (error) {
    console.error('❌ Error getting session info:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Failed to get session info: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 