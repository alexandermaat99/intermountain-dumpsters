// Script to check and verify follow-up charge functionality
// Run this with: node scripts/check-follow-up-charges.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acsxwvvvlfajjizqwcia.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc3h3dnZ2bGZhamppenF3Y2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTQwNzIsImV4cCI6MjA2NTg3MDA3Mn0.BhDCtlva_D8H56mesZZs9z_UgdUnrYokeOUaqVdVzWc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFollowUpCharges() {
  console.log('🔍 Checking follow-up charge functionality...\n');

  try {
    // Check rentals table for follow-up charge fields
    console.log('📋 Checking rentals table for follow-up charge fields...');
    const { data: rentals, error: rentalsError } = await supabase
      .from('rentals')
      .select('id, follow_up_charge_amount, follow_up_charge_status, follow_up_charge_intent_id, follow_up_charge_date')
      .limit(5);

    if (rentalsError) {
      console.error('❌ Error fetching rentals:', rentalsError);
    } else {
      console.log('✅ Rentals table accessible');
      console.log('Sample rental data:', rentals);
    }

    // Check admin_info table for pricing fields
    console.log('\n📋 Checking admin_info table for pricing fields...');
    const { data: adminInfo, error: adminError } = await supabase
      .from('admin_info')
      .select('price_per_lb, day_rate')
      .limit(1);

    if (adminError) {
      console.error('❌ Error fetching admin_info:', adminError);
    } else {
      console.log('✅ Admin info accessible');
      console.log('Pricing info:', adminInfo);
    }

    // Check customers table for Stripe customer IDs
    console.log('\n📋 Checking customers table for Stripe customer IDs...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, email, stripe_customer_id')
      .limit(3);

    if (customersError) {
      console.error('❌ Error fetching customers:', customersError);
    } else {
      console.log('✅ Customers table accessible');
      console.log('Sample customers:', customers);
    }

    console.log('\n✅ Follow-up charge functionality check complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your Stripe webhook includes "payment_intent.succeeded" event');
    console.log('2. Test the follow-up charge functionality in the admin panel');
    console.log('3. Verify that customers have stripe_customer_id values');

  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

checkFollowUpCharges(); 