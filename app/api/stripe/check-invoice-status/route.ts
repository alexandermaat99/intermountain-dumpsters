import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Checking invoice status:', JSON.stringify(body, null, 2));
    
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Missing required field: invoiceId' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching invoice details for:', invoiceId);
    
    // Get the invoice details
    const invoice = await stripe.invoices.retrieve(invoiceId);
    
    console.log('🔍 Invoice details:', {
      id: invoice.id,
      status: invoice.status,
      collection_method: invoice.collection_method,
      hosted_invoice_url: invoice.hosted_invoice_url,
      customer_email: invoice.customer_email,
      customer: invoice.customer,
      metadata: invoice.metadata,
      created: new Date(invoice.created * 1000).toISOString(),
      due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
    });

    // Get customer details if available
    let customerDetails = null;
    if (invoice.customer && typeof invoice.customer === 'string') {
      try {
        const customer = await stripe.customers.retrieve(invoice.customer);
        if (customer && 'email' in customer) {
          customerDetails = {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            created: new Date(customer.created * 1000).toISOString(),
          };
        }
      } catch (customerError) {
        console.error('❌ Error fetching customer details:', customerError);
      }
    }

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        status: invoice.status,
        collection_method: invoice.collection_method,
        hosted_invoice_url: invoice.hosted_invoice_url,
        customer_email: invoice.customer_email,
        metadata: invoice.metadata,
        created: new Date(invoice.created * 1000).toISOString(),
        due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
        amount_due: invoice.amount_due,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
      },
      customer: customerDetails,
      analysis: {
        isTestMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false,
        emailDeliveryStatus: invoice.status === 'open' ? 'Invoice sent and awaiting payment' : invoice.status,
        totalAmount: `$${(invoice.amount_due / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`,
      }
    });

  } catch (error) {
    console.error('❌ Error checking invoice status:', error);
    return NextResponse.json(
      { error: `Failed to check invoice status: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 