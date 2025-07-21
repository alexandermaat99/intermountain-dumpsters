const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.log('Please run this from your project directory with proper env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCustomerEmail() {
  try {
    console.log('🔍 Checking customer emails...');
    
    // Get recent rentals with customer info
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select(`
        id,
        customer:customers(email, first_name, last_name, stripe_customer_id)
      `)
      .not('customer.stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error fetching rentals:', error);
      return;
    }

    console.log(`✅ Found ${rentals.length} rentals with Stripe customers:`);
    console.log('');
    
    rentals.forEach((rental, index) => {
      console.log(`${index + 1}. Rental #${rental.id}`);
      console.log(`   Customer: ${rental.customer.first_name} ${rental.customer.last_name}`);
      console.log(`   Email: ${rental.customer.email}`);
      console.log(`   Stripe ID: ${rental.customer.stripe_customer_id}`);
      console.log('');
    });

    console.log('📧 To test email delivery:');
    console.log('1. Use one of these rental IDs in your test');
    console.log('2. Make sure the email address is valid');
    console.log('3. Check Stripe Dashboard → Invoices for delivery status');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCustomerEmail(); 