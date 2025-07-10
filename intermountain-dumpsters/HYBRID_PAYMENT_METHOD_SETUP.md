# Hybrid Payment Method Saving Setup

This guide explains the hybrid approach for saving payment methods to enable automatic follow-up charges for one-time payments.

## Overview

Since Stripe Checkout doesn't support `payment_method_collection: 'always'` for one-time payments, we use a hybrid approach:

1. **Stripe Checkout** for the initial rental payment
2. **SetupIntent + Stripe Elements** for saving payment methods after checkout
3. **Off-session charging** using saved payment methods for follow-up charges

## How It Works

### 1. Initial Checkout Flow
```
Customer → Stripe Checkout → Payment Success → Success Page
```

### 2. Save Payment Method Flow
```
Success Page → "Save Payment Method" Button → SetupIntent Modal → Card Saved
```

### 3. Follow-Up Charge Flow
```
Admin → Create Follow-Up Charge → Use Saved Payment Method → Automatic Charge
```

## Implementation Details

### Backend APIs

#### `/api/stripe/create-setup-intent`
- **Purpose**: Creates a SetupIntent for saving payment methods
- **Input**: `{ customerId, rentalId? }`
- **Output**: `{ clientSecret, setupIntentId }`

#### `/api/stripe/get-session-info`
- **Purpose**: Gets customer info from a Stripe session
- **Input**: `?session_id=cs_xxx`
- **Output**: `{ customerId, rentalId, hasSavedCard, customerEmail }`

#### `/api/stripe/post-rental-charge` (Updated)
- **Purpose**: Creates follow-up charges using saved payment methods
- **Behavior**: 
  - If saved payment method exists → Automatic charge
  - If no saved payment method → Create pending payment intent

### Frontend Components

#### `SaveCardModal.tsx`
- Modal component with Stripe Elements for card collection
- Handles SetupIntent confirmation
- Shows success/error states

#### `SuccessContent.tsx` (Updated)
- Shows "Save Payment Method" option if customer has no saved card
- Integrates with SaveCardModal

### Webhook Events

The webhook handles these events:
- `checkout.session.completed` - Process initial payment
- `setup_intent.succeeded` - Confirm payment method saved
- `setup_intent.setup_failed` - Handle setup failures
- `payment_intent.succeeded` - Handle follow-up charge success
- `payment_intent.payment_failed` - Handle follow-up charge failure

## Testing the Flow

### 1. Complete a New Checkout
```bash
# Use a new email address
# Complete checkout process
# Note the session ID from success page
```

### 2. Test Payment Method Saving
```bash
# On success page, click "Save Payment Method"
# Enter test card: 4242 4242 4242 4242
# Submit and verify success message
```

### 3. Verify Payment Method Saved
```bash
# Run the test script
node scripts/test-payment-method-saving.js
```

### 4. Test Follow-Up Charge
```bash
# Go to admin panel → Rentals → [Rental ID]
# Create a follow-up charge
# Should automatically charge if payment method is saved
```

## Database Schema

The system uses these fields in the `rentals` table:
```sql
follow_up_charge_amount numeric DEFAULT 0.00
follow_up_charge_status text CHECK (follow_up_charge_status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text]))
follow_up_charge_intent_id text
follow_up_charge_date timestamp with time zone
follow_up_charge_completed_at timestamp with time zone
```

## Environment Variables

Make sure these are set in `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Webhook Configuration

In your Stripe Dashboard → Developers → Webhooks, make sure these events are selected:
- ✅ `checkout.session.completed`
- ✅ `checkout.session.expired`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.succeeded`
- ✅ `setup_intent.succeeded`
- ✅ `setup_intent.setup_failed`

## Troubleshooting

### Common Issues

1. **"SetupIntent creation failed"**
   - Check that customer has a valid Stripe customer ID
   - Verify API endpoint is accessible

2. **"Payment method not saved"**
   - Check webhook events in Stripe Dashboard
   - Verify `setup_intent.succeeded` event is configured

3. **"Follow-up charge requires customer action"**
   - Customer has no saved payment method
   - They need to save a payment method first

4. **"Stripe Elements not loading"**
   - Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
   - Verify Stripe.js is loading correctly

### Debug Commands

```bash
# Test SetupIntent creation
node scripts/test-hybrid-flow.js

# Check payment methods for a customer
node scripts/test-payment-method-saving.js

# Check webhook events
# Go to Stripe Dashboard → Developers → Webhooks → Recent Deliveries
```

## Security Notes

- All payment method saving goes through Stripe's secure infrastructure
- SetupIntents are created server-side with proper authentication
- Webhook signatures are verified to prevent tampering
- Payment methods are stored securely in Stripe, not in your database

## Future Enhancements

1. **Email Notifications**: Send emails when payment methods are saved
2. **Retry Logic**: Automatically retry failed follow-up charges
3. **Bulk Operations**: Save payment methods for multiple customers
4. **Analytics**: Track payment method saving success rates
5. **Customer Portal**: Allow customers to manage saved payment methods

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the server logs for API errors
3. Verify webhook events in Stripe Dashboard
4. Run the test scripts to verify functionality 