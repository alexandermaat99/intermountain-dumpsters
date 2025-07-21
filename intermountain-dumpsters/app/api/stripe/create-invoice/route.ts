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
    console.log('📋 Received invoice creation request:', JSON.stringify(body, null, 2));
    
    const { 
      rentalId, 
      amount, 
      description, 
      dueDate,
      sendEmail = true,
      testEmail = null // Add test email override
    } = body;

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
        customer:customers(stripe_customer_id, email, first_name, last_name, address_line_1, city, state, zip)
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

    console.log('✅ Found rental:', rental.id);
    console.log('Customer data:', rental.customer);

    if (!rental.customer?.stripe_customer_id) {
      console.error('❌ Customer has no Stripe customer ID');
      return NextResponse.json(
        { error: 'Customer has no Stripe customer ID' },
        { status: 400 }
      );
    }

    // Create the invoice
    console.log('🛒 Creating Stripe invoice with data:', {
      customer: rental.customer.stripe_customer_id,
      amount: Math.round(amount * 100),
      description,
      dueDate,
      sendEmail
    });

    const invoice = await stripe.invoices.create({
      customer: rental.customer.stripe_customer_id,
      collection_method: 'send_invoice',
      days_until_due: dueDate ? Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 7,
      metadata: {
        rental_id: rentalId.toString(),
        customer_email: rental.customer.email,
        charge_type: 'follow_up_charge',
      },
      description: description,
      auto_advance: false, // Don't automatically finalize
      ...(testEmail && { custom_fields: [{ name: 'Test Email', value: testEmail }] }),
    });

    console.log('✅ Invoice created:', invoice.id);

    // Add invoice item
    await stripe.invoiceItems.create({
      customer: rental.customer.stripe_customer_id,
      invoice: invoice.id,
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description: description,
    });

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id!);
    console.log('✅ Invoice finalized:', finalizedInvoice.id);

    // Send the invoice if requested
    if (sendEmail) {
      console.log('📧 Attempting to send invoice email to:', rental.customer.email);
      try {
        const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id!);
        console.log('✅ Invoice sent successfully:', sentInvoice.id);
        console.log('📧 Email sent to:', rental.customer.email);
        console.log('📧 Invoice URL:', sentInvoice.hosted_invoice_url);
      } catch (emailError) {
        console.error('❌ Failed to send invoice email:', emailError);
        console.error('Email error details:', JSON.stringify(emailError, null, 2));
        // Don't fail the whole request if email fails
      }
    } else {
      console.log('📧 Email sending skipped (sendEmail = false)');
    }

    // Update the rental with invoice information
    const { error: updateError } = await supabaseAdmin
      .from('rentals')
      .update({
        follow_up_charge_amount: amount,
        follow_up_charge_status: 'pending',
        follow_up_charge_intent_id: finalizedInvoice.id,
        follow_up_charge_date: new Date().toISOString(),
        post_rental_stripe_payment_intent_id: finalizedInvoice.id, // Reuse existing field
      })
      .eq('id', rentalId);

    if (updateError) {
      console.error('❌ Error updating rental:', updateError);
      return NextResponse.json(
        { error: 'Failed to update rental with invoice information' },
        { status: 500 }
      );
    }

    console.log('✅ Follow-up invoice created successfully');
    return NextResponse.json({
      success: true,
      invoiceId: finalizedInvoice.id,
      invoiceUrl: finalizedInvoice.hosted_invoice_url,
      amount: amount,
      message: 'Follow-up invoice created and sent successfully',
    });

  } catch (error) {
    console.error('❌ Error creating follow-up invoice:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: `Failed to create follow-up invoice: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 