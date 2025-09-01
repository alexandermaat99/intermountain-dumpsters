const fetch = require('node-fetch');

async function debugInvoiceEmail() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  console.log('🔍 Debugging Invoice Email Delivery');
  console.log('===================================');
  console.log('');
  
  // You'll need to replace this with an actual rental ID from your database
  const rentalId = process.argv[2];
  
  if (!rentalId) {
    console.error('❌ Please provide a rental ID as an argument');
    console.log('Usage: node scripts/debug-invoice-email.js <rental_id>');
    console.log('');
    console.log('To find a rental ID:');
    console.log('1. Go to your admin dashboard');
    console.log('2. Click on any rental');
    console.log('3. Copy the rental ID from the URL');
    return;
  }

  try {
    console.log(`📋 Testing with rental ID: ${rentalId}`);
    console.log(`🌐 Base URL: ${baseUrl}`);
    console.log('');
    
    // Step 1: Create test invoice
    console.log('📝 Step 1: Creating test invoice...');
    const testResponse = await fetch(`${baseUrl}/api/stripe/test-invoice-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rentalId: parseInt(rentalId),
        testEmail: null,
        amount: 25.00,
        description: 'Debug test follow-up charge'
      }),
    });

    const testResult = await testResponse.json();

    if (!testResponse.ok) {
      console.error('❌ Error creating test invoice:', testResult.error);
      return;
    }

    console.log('✅ Test invoice created successfully!');
    console.log(`📧 Invoice ID: ${testResult.testInvoiceId}`);
    console.log(`📧 Customer Email: ${testResult.customerEmail}`);
    console.log(`🔗 Invoice URL: ${testResult.invoiceUrl}`);
    console.log('');

    // Step 2: Check invoice status
    console.log('🔍 Step 2: Checking invoice status...');
    const statusResponse = await fetch(`${baseUrl}/api/stripe/check-invoice-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId: testResult.testInvoiceId
      }),
    });

    const statusResult = await statusResponse.json();

    if (!statusResponse.ok) {
      console.error('❌ Error checking invoice status:', statusResult.error);
      return;
    }

    console.log('✅ Invoice status retrieved successfully!');
    console.log('');
    console.log('📊 Invoice Details:');
    console.log(`   Status: ${statusResult.invoice.status}`);
    console.log(`   Collection Method: ${statusResult.invoice.collection_method}`);
    console.log(`   Amount Due: ${statusResult.analysis.totalAmount}`);
    console.log(`   Created: ${statusResult.invoice.created}`);
    console.log(`   Due Date: ${statusResult.invoice.due_date || 'Not set'}`);
    console.log('');

    if (statusResult.customer) {
      console.log('👤 Customer Details:');
      console.log(`   ID: ${statusResult.customer.id}`);
      console.log(`   Email: ${statusResult.customer.email}`);
      console.log(`   Name: ${statusResult.customer.name}`);
      console.log(`   Created: ${statusResult.customer.created}`);
      console.log('');
    }

    console.log('🔍 Analysis:');
    console.log(`   Test Mode: ${statusResult.analysis.isTestMode ? 'Yes' : 'No'}`);
    console.log(`   Email Delivery Status: ${statusResult.analysis.emailDeliveryStatus}`);
    console.log('');

    // Step 3: Provide troubleshooting guidance
    console.log('🛠️  Troubleshooting Guide:');
    console.log('');
    
    if (statusResult.analysis.isTestMode) {
      console.log('✅ You are in Stripe test mode');
      console.log('📧 Test Mode Email Rules:');
      console.log('   - Emails are only sent to verified team members');
      console.log('   - Team members must be added in Stripe Dashboard');
      console.log('   - Customer email must match a verified team member');
      console.log('');
      console.log('🔧 To fix email delivery:');
      console.log('   1. Go to Stripe Dashboard > Settings > Team members');
      console.log('   2. Add your email as a team member');
      console.log('   3. Verify your email address');
      console.log('   4. Make sure the customer email matches your verified email');
      console.log('');
    } else {
      console.log('⚠️  You are in Stripe live mode - be careful!');
      console.log('📧 Live Mode Email Rules:');
      console.log('   - Emails are sent to all customers');
      console.log('   - No team member restrictions');
      console.log('');
    }

    console.log('📋 Next Steps:');
    console.log('   1. Check your email (including spam folder)');
    console.log('   2. Check Stripe Dashboard > Invoices');
    console.log('   3. Look for the invoice with ID:', testResult.testInvoiceId);
    console.log('   4. Click the invoice URL above to view it directly');
    console.log('   5. Check Stripe Dashboard > Settings > Team members (if in test mode)');
    console.log('');

    if (statusResult.invoice.status === 'open') {
      console.log('✅ Invoice status is "open" - this means it was sent successfully!');
      console.log('📧 If you didn\'t receive the email, check:');
      console.log('   - Spam/junk folder');
      console.log('   - Team member verification (test mode)');
      console.log('   - Email address spelling');
    } else {
      console.log(`⚠️  Invoice status is "${statusResult.invoice.status}" - this might indicate an issue`);
    }

  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
}

debugInvoiceEmail(); 