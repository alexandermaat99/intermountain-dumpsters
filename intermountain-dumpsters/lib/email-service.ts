import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export interface PaymentConfirmationData {
  customerEmail: string;
  customerName: string;
  rentalId: number;
  totalAmount: number;
  deliveryDate: string;
  deliveryAddress: string;
  dumpsterType: string;
  stripeCustomerId?: string;
}

export async function sendPaymentConfirmationEmail(data: PaymentConfirmationData): Promise<boolean> {
  try {
    console.log('📧 Sending payment confirmation email to:', data.customerEmail);
    
    // If we have a Stripe customer ID, create an invoice for the confirmation
    if (data.stripeCustomerId) {
      console.log('📧 Creating confirmation invoice for customer:', data.stripeCustomerId);
      
      // Create a confirmation invoice (this will be marked as paid)
      const invoice = await stripe.invoices.create({
        customer: data.stripeCustomerId,
        collection_method: 'send_invoice',
        days_until_due: 0, // Already paid
        metadata: {
          rental_id: data.rentalId.toString(),
          customer_email: data.customerEmail,
          charge_type: 'payment_confirmation',
        },
        description: `Payment Confirmation - Dumpster Rental #${data.rentalId}`,
        auto_advance: false,
      });

      // Add invoice item with the rental details
      await stripe.invoiceItems.create({
        customer: data.stripeCustomerId,
        invoice: invoice.id,
        amount: Math.round(data.totalAmount * 100), // Convert to cents
        currency: 'usd',
        description: `Dumpster Rental - ${data.dumpsterType}`,
      });

      // Add additional line items for delivery details
      await stripe.invoiceItems.create({
        customer: data.stripeCustomerId,
        invoice: invoice.id,
        amount: 0, // Free line item for delivery details
        currency: 'usd',
        description: `Delivery: ${data.deliveryDate} to ${data.deliveryAddress}`,
      });

      // Finalize the invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id!);
      
      // Mark as paid since this is a confirmation
      const paidInvoice = await stripe.invoices.pay(finalizedInvoice.id!);
      
      // Send the confirmation email
      const sentInvoice = await stripe.invoices.sendInvoice(paidInvoice.id!);
      
      console.log('✅ Payment confirmation email sent successfully');
      console.log('📧 Invoice ID:', sentInvoice.id);
      console.log('📧 Invoice URL:', sentInvoice.hosted_invoice_url);
      
      return true;
    } else {
      console.log('⚠️ No Stripe customer ID available, skipping email');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(data: PaymentConfirmationData): Promise<boolean> {
  try {
    console.log('📧 Sending order confirmation email to:', data.customerEmail);
    
    // Create a simple order confirmation invoice
    if (data.stripeCustomerId) {
      const invoice = await stripe.invoices.create({
        customer: data.stripeCustomerId,
        collection_method: 'send_invoice',
        days_until_due: 0,
        metadata: {
          rental_id: data.rentalId.toString(),
          customer_email: data.customerEmail,
          charge_type: 'order_confirmation',
        },
        description: `Order Confirmation - Dumpster Rental #${data.rentalId}`,
        auto_advance: false,
      });

      // Add the main rental item
      await stripe.invoiceItems.create({
        customer: data.stripeCustomerId,
        invoice: invoice.id,
        amount: Math.round(data.totalAmount * 100),
        currency: 'usd',
        description: `Dumpster Rental - ${data.dumpsterType}`,
      });

      // Finalize and send
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id!);
      const paidInvoice = await stripe.invoices.pay(finalizedInvoice.id!);
      const sentInvoice = await stripe.invoices.sendInvoice(paidInvoice.id!);
      
      console.log('✅ Order confirmation email sent successfully');
      console.log('📧 Invoice ID:', sentInvoice.id);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
} 