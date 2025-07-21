const fetch = require('node-fetch');

async function testInvoiceEmail() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing Invoice Email Delivery');
  console.log('================================');
  
  // You'll need to replace this with an actual rental ID from your database
  const rentalId = process.argv[2];
  
  if (!rentalId) {
    console.error('❌ Please provide a rental ID as an argument');
    console.log('Usage: node scripts/test-invoice-email.js <rental_id>');
    console.log('');
    console.log('To find a rental ID:');
    console.log('1. Go to your admin dashboard');
    console.log('2. Click on any rental');
    console.log('3. Copy the rental ID from the URL');
    return;
  }

  try {
    console.log(`📋 Testing with rental ID: ${rentalId}`);
    
    const response = await fetch(`${baseUrl}/api/stripe/test-invoice-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rentalId: parseInt(rentalId),
        testEmail: null,
        amount: 25.00,
        description: 'Test follow-up charge email'
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', result.error);
      return;
    }

    console.log('✅ Test invoice created successfully!');
    console.log('');
    console.log('📧 Email Details:');
    console.log(`   Customer Email: ${result.customerEmail}`);
    console.log(`   Test Email Override: ${result.testEmailOverride || 'None (using customer email)'}`);
    console.log(`   Invoice ID: ${result.testInvoiceId}`);
    console.log(`   Invoice URL: ${result.invoiceUrl}`);
    console.log(`   Amount: $${result.amount}`);
    console.log('');
    console.log('🔍 Next Steps:');
    console.log('1. Check your Stripe Dashboard > Invoices');
    console.log('2. Look for the test invoice with ID:', result.testInvoiceId);
    console.log('3. Check your email (including spam folder)');
    console.log('4. Click the invoice URL above to view it directly');
    console.log('');
    console.log('📝 Important Notes:');
    console.log('- In Stripe test mode, emails are only sent to verified team members');
    console.log('- Make sure the customer email is from a verified team member');
    console.log('- Check your Stripe Dashboard > Settings > Team members');
    console.log('- If you don\'t receive the email, check the Stripe Dashboard for delivery status');

  } catch (error) {
    console.error('❌ Error testing invoice email:', error);
  }
}

testInvoiceEmail(); 