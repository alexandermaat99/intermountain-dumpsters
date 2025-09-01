// Script to test payment method saving functionality
// Run this after a customer completes a checkout to verify payment method was saved

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// You'll need to set these environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acsxwvvvlfajjizqwcia.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc3h3dnZ2bGZhamppenF3Y2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTQwNzIsImV4cCI6MjA2NTg3MDA3Mn0.BhDCtlva_D8H56mesZZs9z_UgdUnrYokeOUaqVdVzWc';
const stripeKey = process.env.STRIPE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

async function testPaymentMethodSaving() {
  console.log('🔍 Testing Payment Method Saving...\n');

  try {
    // Get the most recent customer with a Stripe customer ID
    console.log('📋 Finding recent customers with Stripe IDs...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, email, first_name, last_name, stripe_customer_id')
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5);

    if (customersError) {
      console.error('❌ Error fetching customers:', customersError);
      return;
    }

    if (!customers || customers.length === 0) {
      console.log('❌ No customers with Stripe IDs found');
      return;
    }

    console.log('✅ Found customers with Stripe IDs:');
    customers.forEach(customer => {
      console.log(`  - ${customer.first_name} ${customer.last_name} (${customer.email})`);
      console.log(`    Stripe ID: ${customer.stripe_customer_id}`);
    });

    // Test the first customer
    const testCustomer = customers[0];
    console.log(`\n🔍 Testing customer: ${testCustomer.first_name} ${testCustomer.last_name}`);

    // Retrieve customer from Stripe
    const stripeCustomer = await stripe.customers.retrieve(testCustomer.stripe_customer_id);
    console.log('✅ Stripe customer retrieved:', stripeCustomer.id);

    // Check for saved payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: testCustomer.stripe_customer_id,
      type: 'card',
    });

    console.log(`📊 Payment methods found: ${paymentMethods.data.length}`);

    if (paymentMethods.data.length > 0) {
      console.log('✅ Customer has saved payment methods:');
      paymentMethods.data.forEach((pm, index) => {
        console.log(`  ${index + 1}. ${pm.card.brand} ending in ${pm.card.last4}`);
        console.log(`     Expires: ${pm.card.exp_month}/${pm.card.exp_year}`);
        console.log(`     ID: ${pm.id}`);
      });

      // Check if there's a default payment method
      if (stripeCustomer.invoice_settings?.default_payment_method) {
        console.log(`✅ Default payment method: ${stripeCustomer.invoice_settings.default_payment_method}`);
      } else {
        console.log('⚠️ No default payment method set');
      }
    } else {
      console.log('❌ No saved payment methods found');
      console.log('');
      console.log('Possible reasons:');
      console.log('1. Customer completed checkout before payment_method_collection was added');
      console.log('2. Customer unchecked the "save payment method" option');
      console.log('3. Payment method saving failed during checkout');
      console.log('');
      console.log('To fix this:');
      console.log('1. Make sure webhook includes setup_intent events');
      console.log('2. Test with a new customer checkout');
      console.log('3. Verify the consent checkbox is working in checkout');
    }

    console.log('\n✅ Payment method saving test complete!');

  } catch (error) {
    console.error('❌ Error testing payment method saving:', error);
  }
}

testPaymentMethodSaving(); 