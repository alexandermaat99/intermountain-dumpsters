# Pending Orders System Setup

This system prevents rental orders from being created in the database before payment is confirmed, solving the issue of unpaid orders cluttering your database.

## How It Works

### **Before (Problem):**
1. User clicks "Proceed to Payment"
2. Customer and rental records created immediately
3. User redirected to Stripe
4. If payment fails/abandoned → orphaned records in database

### **After (Solution):**
1. User clicks "Proceed to Payment"
2. **Pending order** created (temporary storage)
3. User redirected to Stripe
4. **Only after successful payment** → customer and rental records created
5. Pending order deleted after successful confirmation

## Setup Instructions

### 1. Create the Database Table

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/pending_orders_setup.sql
```

Or execute it via the Supabase CLI:

```bash
supabase db push
```

### 2. Database Schema

The `pending_orders` table contains:

- `id`: Primary key
- `customer_info`: JSON object with customer details
- `delivery_info`: JSON object with delivery details
- `insurance_info`: JSON object with insurance options
- `cart_info`: JSON object with cart items (optional)
- `total_amount`: Total order amount
- `tax_amount`: Tax amount
- `subtotal_amount`: Subtotal before tax
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### 3. New Flow

#### **Step 1: Create Pending Order**
```typescript
const result = await createPendingOrder(checkoutData, totalAmount, customerAddress);
// Returns: { pendingOrderId: number, checkoutUrl: string }
```

#### **Step 2: Redirect to Stripe**
```typescript
window.location.href = result.checkoutUrl;
```

#### **Step 3: Payment Confirmation (Webhook)**
```typescript
// When payment succeeds, webhook calls:
const result = await confirmPendingOrder(pendingOrderId, stripeSessionId);
// Creates customer/rental records and deletes pending order
```

## Benefits

✅ **No orphaned records** - Only paid orders in main tables  
✅ **Clean database** - Pending orders are temporary  
✅ **Better reporting** - All rentals in database are confirmed paid  
✅ **Automatic cleanup** - Expired pending orders are deleted  
✅ **Customer deduplication** - Still works with existing customer lookup  

## Automatic Cleanup

The system includes automatic cleanup of old pending orders:

- **Expired sessions**: Deleted when Stripe session expires
- **Old orders**: Can be cleaned up after 24 hours (optional cron job)
- **Failed payments**: Cleaned up automatically

## Migration from Old System

The old `saveCheckoutToDatabase` function is deprecated but still available for backward compatibility. New orders will use the pending orders system.

## Monitoring

You can monitor pending orders in your Supabase dashboard:

```sql
-- View all pending orders
SELECT * FROM pending_orders ORDER BY created_at DESC;

-- Count pending orders
SELECT COUNT(*) FROM pending_orders;

-- Clean up old pending orders manually
SELECT cleanup_old_pending_orders();
```

## Troubleshooting

### **Pending Order Not Confirmed**
- Check webhook logs in Stripe dashboard
- Verify webhook endpoint is working
- Check database connection

### **Duplicate Customers Still Created**
- Verify email normalization is working
- Check customer lookup logic in `confirmPendingOrder`

### **Performance Issues**
- Ensure indexes are created on `pending_orders` table
- Monitor pending order cleanup frequency 