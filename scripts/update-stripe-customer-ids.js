// Script to update existing customers with their Stripe customer IDs
// Run this with: node scripts/update-stripe-customer-ids.js

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

async function updateStripeCustomerIds() {
  console.log('🔍 Updating customers with Stripe customer IDs...\n');

  if (!stripeKey) {
    console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
    return;
  }

  try {
    // Get all customers without stripe_customer_id
    console.log('📋 Fetching customers without Stripe customer IDs...');
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, email, first_name, last_name, stripe_customer_id')
      .is('stripe_customer_id', null);

    if (customersError) {
      console.error('❌ Error fetching customers:', customersError);
      return;
    }

    console.log(`Found ${customers.length} customers without Stripe customer IDs`);

    if (customers.length === 0) {
      console.log('✅ All customers already have Stripe customer IDs!');
      return;
    }

    let updatedCount = 0;
    let errorCount = 0;

    for (const customer of customers) {
      try {
        console.log(`\n🔍 Looking up customer: ${customer.email} (${customer.first_name} ${customer.last_name})`);
        
        // Search for customer in Stripe by email
        const stripeCustomers = await stripe.customers.list({
          email: customer.email,
          limit: 1,
        });

        if (stripeCustomers.data.length > 0) {
          const stripeCustomer = stripeCustomers.data[0];
          console.log(`✅ Found Stripe customer: ${stripeCustomer.id}`);

          // Update the customer in the database
          const { error: updateError } = await supabase
            .from('customers')
            .update({ stripe_customer_id: stripeCustomer.id })
            .eq('id', customer.id);

          if (updateError) {
            console.error(`❌ Error updating customer ${customer.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`✅ Updated customer ${customer.id} with Stripe ID: ${stripeCustomer.id}`);
            updatedCount++;
          }
        } else {
          console.log(`⚠️ No Stripe customer found for email: ${customer.email}`);
          errorCount++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing customer ${customer.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully updated: ${updatedCount} customers`);
    console.log(`❌ Errors: ${errorCount} customers`);
    console.log(`📋 Total processed: ${customers.length} customers`);

  } catch (error) {
    console.error('❌ Error during update process:', error);
  }
}

updateStripeCustomerIds(); 