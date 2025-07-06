# Customer Deduplication Solution

## Problem

Customers were being added multiple times to the `customers` table when they made multiple orders, creating duplicate customer records. This happened because:

1. **Inconsistent email normalization**: The lookup and insert operations used different email normalization methods
2. **Race conditions**: Multiple concurrent orders could create duplicate customers before the unique constraint was enforced
3. **No database-level protection**: There was no unique constraint on the email field

## Solution

### 1. Database-Level Protection

**File**: `supabase/customer_email_unique.sql`

This migration script:
- Cleans up existing duplicate customers by keeping the most recent one
- Updates any rentals to reference the kept customer
- Normalizes all email addresses to lowercase and trims whitespace
- Adds a unique constraint on the email field
- Creates an index for faster email lookups

**To apply the migration:**
```bash
# Run in your Supabase SQL editor
# Copy and paste the contents of supabase/customer_email_unique.sql
```

### 2. Application-Level Improvements

**File**: `lib/checkout.ts`

#### Key Improvements:

1. **Consistent Email Normalization**:
   ```typescript
   const normalizedEmail = customerInfo.email.toLowerCase().trim();
   ```

2. **Robust Customer Lookup**:
   ```typescript
   const { data: existingCustomer } = await supabase
     .from('customers')
     .select('*')
     .eq('email', normalizedEmail)
     .single();
   ```

3. **Race Condition Handling**:
   ```typescript
   if (customerError.code === '23505' && customerError.message.includes('email')) {
     // Handle unique constraint violation by fetching existing customer
   }
   ```

4. **Dedicated Utility Function**:
   ```typescript
   async function findOrCreateCustomer(customerInfo: CustomerInfo): Promise<{ id: number; isNew: boolean }>
   ```

### 3. Data Validation

All customer data is now properly trimmed and normalized:
- Email addresses are converted to lowercase and trimmed
- Names, addresses, and phone numbers are trimmed
- Null values are handled properly for optional fields

## Benefits

✅ **Prevents duplicate customers** - Database constraint ensures uniqueness  
✅ **Handles race conditions** - Application logic handles concurrent orders  
✅ **Maintains data integrity** - All rentals reference valid customers  
✅ **Improves performance** - Email index for faster lookups  
✅ **Better logging** - Detailed logs for debugging customer creation  
✅ **Backward compatible** - Existing customers are preserved  

## Monitoring

### Check for Duplicates
```sql
-- View any remaining duplicates (should be 0 after migration)
SELECT email, COUNT(*) as count
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

### Customer Creation Logs
The application now logs:
- Email normalization process
- Customer lookup results
- New customer creation
- Constraint violation handling

### Admin Dashboard
The admin dashboard shows customer information in the rentals view, making it easy to verify that customers are not being duplicated.

## Testing

To test the deduplication:

1. **Create a test order** with an existing customer email
2. **Verify in admin dashboard** that no new customer was created
3. **Check the logs** for deduplication messages
4. **Verify database** that only one customer record exists

## Troubleshooting

### Migration Fails
If the migration fails due to existing data issues:
1. Check for customers with invalid email formats
2. Manually clean up problematic records
3. Re-run the migration

### Constraint Violations
If you see constraint violation errors:
1. Check the application logs for the retry logic
2. Verify the email normalization is working
3. Ensure the database constraint is properly applied

### Performance Issues
If customer lookups are slow:
1. Verify the email index exists: `\d customers`
2. Check query performance in Supabase dashboard
3. Monitor the application logs for lookup times

## Future Improvements

Consider implementing:
- **Phone number deduplication** for additional customer matching
- **Fuzzy matching** for similar email addresses (e.g., typos)
- **Customer merge functionality** in the admin dashboard
- **Audit trail** for customer record changes 