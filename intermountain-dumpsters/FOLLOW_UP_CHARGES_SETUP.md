# Follow-Up Charges Setup Guide

This guide will help you set up the follow-up charge functionality for your dumpster rental application.

## Overview

The follow-up charge system allows admins to charge customers additional fees after the dumpster has been picked up. This is typically used for:
- Weight-based charges (per pound of waste)
- Daily rental fees (per day the dumpster was on site)
- Additional service fees

## Database Schema

The following fields are already present in your `rentals` table:

```sql
-- These fields should already exist in your rentals table
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS follow_up_charge_amount numeric DEFAULT 0.00;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS follow_up_charge_status text CHECK (follow_up_charge_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text]));
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS follow_up_charge_intent_id text;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS follow_up_charge_date timestamp with time zone;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS follow_up_charge_completed_at timestamp with time zone;
```

## Pricing Configuration

Make sure your `admin_info` table has the pricing fields:

```sql
-- These fields should already exist in your admin_info table
ALTER TABLE admin_info ADD COLUMN IF NOT EXISTS price_per_lb numeric DEFAULT 0.03;
ALTER TABLE admin_info ADD COLUMN IF NOT EXISTS day_rate numeric DEFAULT 20.00;
```

## Stripe Webhook Configuration

1. Go to your Stripe Dashboard → Developers → Webhooks
2. Add or update your webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Make sure these events are selected:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `payment_intent.succeeded` ← **NEW EVENT**

## How It Works

### 1. Admin Creates Follow-Up Charge
- Admin goes to rental detail page (`/admin/rentals/[id]`)
- Enters the charge amount in the "Follow-Up Charge" section
- Clicks "Create Follow-Up Charge"
- System creates a Stripe Payment Intent for the customer

### 2. Automatic Payment Processing
- Stripe automatically attempts to charge the customer's saved payment method
- If successful: Webhook updates rental status to "completed"
- If failed: Webhook updates rental status to "failed"

### 3. Status Tracking
- **Pending**: Charge created, payment processing
- **Completed**: Payment successful
- **Failed**: Payment failed

## API Endpoints

### POST `/api/stripe/post-rental-charge`
Creates a follow-up charge for a rental.

**Request Body:**
```json
{
  "rentalId": 123,
  "amount": 150.00,
  "description": "Follow-up charge for rental #123"
}
```

**Response:**
```json
{
  "success": true,
  "paymentIntentId": "pi_1234567890",
  "clientSecret": "pi_1234567890_secret_abc123",
  "amount": 150.00
}
```

## Testing

### 1. Check Database Setup
Run the verification script:
```bash
node scripts/check-follow-up-charges.js
```

### 2. Test in Admin Panel
1. Go to `/admin/rentals`
2. Click on any rental
3. Scroll to the "Follow-Up Charge" section
4. Enter an amount and click "Create Follow-Up Charge"

### 3. Monitor Webhooks
Check your Stripe Dashboard → Developers → Webhooks → Recent deliveries to see webhook events.

## Troubleshooting

### Common Issues

1. **"Customer has no Stripe customer ID"**
   - Make sure customers have `stripe_customer_id` values
   - This is set when they complete their first checkout

2. **Webhook not receiving events**
   - Verify webhook endpoint URL is correct
   - Check that `payment_intent.succeeded` event is selected
   - Ensure webhook secret is correct in environment variables

3. **Payment fails**
   - Check customer's payment method is still valid
   - Verify sufficient funds
   - Check Stripe Dashboard for specific error messages

### Environment Variables

Make sure these are set in your `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Future Enhancements

1. **Automatic Calculation**: Calculate charges based on weight and days automatically
2. **Email Notifications**: Send emails to customers about follow-up charges
3. **Retry Logic**: Automatically retry failed payments
4. **Bulk Operations**: Charge multiple rentals at once
5. **Invoice Generation**: Generate invoices for follow-up charges

## Security Notes

- All charges go through Stripe's secure payment processing
- Webhook signatures are verified to prevent tampering
- Admin authentication is required to create charges
- All payment attempts are logged for audit purposes 