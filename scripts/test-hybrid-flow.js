// Test script for the hybrid payment method saving flow
// This script helps verify that the SetupIntent flow is working correctly

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acsxwvvvlfajjizqwcia.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc3h3dnZ2bGZhamppenF3Y2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTQwNzIsImV4cCI6MjA2NTg3MDA3Mn0.BhDCtlva_D8H56mesZZs9z_UgdUnrYokeOUaqVdVzWc';
const stripeKey = process.env.STRIPE_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

async function testHybridFlow() {
  console.log('🧪 Testing Hybrid Payment Method Saving Flow');
  console.log('============================================\n');

  try {
    // 1. Check recent customers
    console.log('1️⃣ Checking recent customers...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, email, first_name, last_name, stripe_customer_id')
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(3);

    if (customersError) {
      console.error('❌ Error fetching customers:', customersError);
      return;
    }

    if (!customers || customers.length === 0) {
      console.log('❌ No customers found');
      return;
    }

    console.log('✅ Found customers:');
    customers.forEach((customer, index) => {
      console.log(`  ${index + 1}. ${customer.first_name} ${customer.last_name} (${customer.email})`);
      console.log(`     Stripe ID: ${customer.stripe_customer_id}`);
    });

    // 2. Test SetupIntent creation for the first customer
    const testCustomer = customers[0];
    console.log(`\n2️⃣ Testing SetupIntent creation for: ${testCustomer.first_name} ${testCustomer.last_name}`);

    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/stripe/create-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: testCustomer.stripe_customer_id,
        rentalId: '1', // Test rental ID
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ SetupIntent creation failed:', errorData);
      return;
    }

    const result = await response.json();
    console.log('✅ SetupIntent created successfully:');
    console.log(`   SetupIntent ID: ${result.setupIntentId}`);
    console.log(`   Client Secret: ${result.clientSecret ? '✅ Present' : '❌ Missing'}`);

    // 3. Check current payment methods
    console.log('\n3️⃣ Checking current payment methods...');
    const paymentMethods = await stripe.paymentMethods.list({
      customer: testCustomer.stripe_customer_id,
      type: 'card',
    });

    console.log(`📊 Current payment methods: ${paymentMethods.data.length}`);
    if (paymentMethods.data.length > 0) {
      paymentMethods.data.forEach((pm, index) => {
        console.log(`   ${index + 1}. ${pm.card.brand} ending in ${pm.card.last4}`);
        console.log(`      Expires: ${pm.card.exp_month}/${pm.card.card.exp_year}`);
        console.log(`      ID: ${pm.id}`);
      });
    } else {
      console.log('   No payment methods found');
    }

    // 4. Test session info API
    console.log('\n4️⃣ Testing session info API...');
    console.log('   Note: This requires a valid session ID from a recent checkout');
    console.log('   You can test this manually by:');
    console.log('   1. Completing a checkout');
    console.log('   2. Going to /success?session_id=YOUR_SESSION_ID');
    console.log('   3. Checking the browser console for API calls');

    console.log('\n✅ Hybrid flow test complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Complete a new checkout with a new email');
    console.log('2. On the success page, click "Save Payment Method"');
    console.log('3. Enter card details and submit');
    console.log('4. Check Stripe Dashboard for saved payment methods');
    console.log('5. Test a follow-up charge in the admin panel');

  } catch (error) {
    console.error('❌ Error testing hybrid flow:', error);
  }
}

testHybridFlow(); 