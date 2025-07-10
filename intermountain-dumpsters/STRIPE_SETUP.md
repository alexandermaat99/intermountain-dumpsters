# Stripe Integration Setup

This guide will help you set up Stripe payment processing for your dumpster rental application.

## 1. Stripe Account Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks for payment events

## 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 3. Webhook Setup

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `payment_intent.succeeded`
4. Copy the webhook signing secret to your environment variables

## 4. Testing

### Test Cards
Use these test card numbers for testing:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Mode
- All transactions in test mode are free
- No real charges will be made
- Perfect for development and testing

## 5. Production Deployment

1. Switch to live keys in production
2. Update webhook endpoints to production URLs
3. Test the complete payment flow
4. Monitor webhook events in Stripe Dashboard

## 6. Features Implemented

- ✅ Stripe Checkout Sessions
- ✅ Payment processing with tax calculation
- ✅ Webhook handling for payment status updates
- ✅ Success/failure page handling
- ✅ Database integration for order tracking
- ✅ Customer address handling (billing vs delivery)
- ✅ Follow-up charges for post-rental fees

## 7. API Endpoints

- `POST /api/stripe/create-checkout-session` - Creates Stripe checkout session
- `POST /api/stripe/webhook` - Handles Stripe webhook events
- `POST /api/stripe/post-rental-charge` - Creates follow-up charges for rentals

## 8. Database Updates

The system automatically updates the `rentals` table with:
- Payment status (`pending`, `completed`, `failed`)
- Stripe session ID
- Payment timestamps

## 9. Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Log all payment events for debugging 