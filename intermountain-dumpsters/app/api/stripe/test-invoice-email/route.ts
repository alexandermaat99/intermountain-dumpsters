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
    console.log('🧪 Test invoice email request:', JSON.stringify(body, null, 2));
    
    const { 
      rentalId, 
      testEmail,
      amount = 50.00,
      description = 'Test follow-up charge'
    } = body;

    if (!rentalId) {
      return NextResponse.json(
        { error: 'Missing required field: rentalId' },
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
      console.error('❌ Error fetching rental:', rentalError);
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

    console.log('🧪 Creating test invoice for rental:', rentalId);
    console.log('🧪 Customer email:', rental.customer.email);
    console.log('🧪 Test email override:', testEmail);

    // Create test invoice
    const invoice = await stripe.invoices.create({
      customer: rental.customer.stripe_customer_id,
      collection_method: 'send_invoice',
      days_until_due: 7,
      metadata: {
        rental_id: rentalId.toString(),
        customer_email: rental.customer.email,
        charge_type: 'test_follow_up_charge',
        test_mode: 'true'
      },
      description: description,
      auto_advance: false,
      ...(testEmail && { custom_fields: [{ name: 'Test Email Override', value: testEmail }] }),
    });

    // Add invoice item
    await stripe.invoiceItems.create({
      customer: rental.customer.stripe_customer_id,
      invoice: invoice.id,
      amount: Math.round(amount * 100),
      currency: 'usd',
      description: description,
    });

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id!);
    console.log('🧪 Test invoice finalized:', finalizedInvoice.id);

    // Send the invoice
    console.log('🧪 Attempting to send test invoice email...');
    console.log('🧪 Customer email:', rental.customer.email);
    console.log('🧪 Stripe customer ID:', rental.customer.stripe_customer_id);
    
    let sentInvoice;
    try {
      sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id!);
      console.log('🧪 Test invoice sent successfully:', sentInvoice.id);
      console.log('🧪 Invoice URL:', sentInvoice.hosted_invoice_url);
      console.log('🧪 Invoice status:', sentInvoice.status);
      console.log('🧪 Collection method:', sentInvoice.collection_method);
    } catch (emailError) {
      console.error('❌ Failed to send test invoice email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      throw emailError;
    }

    // Check invoice status after sending
    console.log('🔍 Checking invoice status after sending...');
    const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stripe/check-invoice-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId: sentInvoice.id
      }),
    });

    let statusData = null;
    if (statusResponse.ok) {
      statusData = await statusResponse.json();
      console.log('🔍 Invoice status check result:', statusData);
    }

    return NextResponse.json({
      success: true,
      testInvoiceId: sentInvoice.id,
      invoiceUrl: sentInvoice.hosted_invoice_url,
      customerEmail: rental.customer.email,
      testEmailOverride: testEmail,
      amount: amount,
      message: 'Test invoice created and sent successfully',
      invoiceStatus: statusData,
      instructions: [
        '1. Check your Stripe Dashboard > Invoices to see the test invoice',
        '2. In test mode, emails are only sent to verified team members',
        '3. Check your email (including spam folder)',
        '4. The invoice URL above can be used to view the invoice directly',
        '5. Check the invoiceStatus object below for detailed analysis'
      ]
    });

  } catch (error) {
    console.error('❌ Error creating test invoice:', error);
    return NextResponse.json(
      { error: `Failed to create test invoice: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 