// Script to help update Stripe webhook configuration
// This script provides instructions for updating your webhook events

console.log('🔧 Stripe Webhook Configuration Update');
console.log('=====================================\n');

console.log('To enable payment method saving for follow-up charges, you need to:');
console.log('');
console.log('1. Go to your Stripe Dashboard → Developers → Webhooks');
console.log('2. Find your webhook endpoint (should be: https://yourdomain.com/api/stripe/webhook)');
console.log('3. Click "Edit" on the webhook');
console.log('4. In the "Events to send" section, make sure these events are selected:');
console.log('');
console.log('   ✅ checkout.session.completed');
console.log('   ✅ checkout.session.expired');
console.log('   ✅ payment_intent.payment_failed');
console.log('   ✅ payment_intent.succeeded');
console.log('   ✅ setup_intent.succeeded    ← ADD THIS');
console.log('   ✅ setup_intent.setup_failed ← ADD THIS');
console.log('');
console.log('5. Click "Save" to update the webhook');
console.log('');
console.log('After updating the webhook:');
console.log('- New customers will have their payment methods saved automatically');
console.log('- Follow-up charges will work automatically for customers with saved payment methods');
console.log('- You can test by creating a new rental and then a follow-up charge');
console.log('');
console.log('Note: Existing customers without saved payment methods will need to provide');
console.log('payment information when follow-up charges are created.'); 