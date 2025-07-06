-- Add unique constraint on email field to prevent duplicate customers
-- This migration ensures that no two customers can have the same email address

-- First, let's clean up any existing duplicate emails by keeping the most recent customer
-- and updating any rentals that reference the older duplicates

-- Create a temporary table to identify duplicates
CREATE TEMP TABLE duplicate_emails AS
SELECT LOWER(TRIM(email)) as normalized_email, COUNT(*) as count
FROM customers
GROUP BY LOWER(TRIM(email))
HAVING COUNT(*) > 1;

-- For each duplicate email, keep the customer with the most recent created_at
-- and update any rentals to reference the kept customer
DO $$
DECLARE
    dup_email RECORD;
    kept_customer_id INTEGER;
    duplicate_customer_ids INTEGER[];
BEGIN
    FOR dup_email IN SELECT normalized_email FROM duplicate_emails LOOP
        -- Get the customer ID to keep (most recent)
        SELECT id INTO kept_customer_id
        FROM customers
        WHERE LOWER(TRIM(email)) = dup_email.normalized_email
        ORDER BY created_at DESC
        LIMIT 1;
        
        -- Get all duplicate customer IDs (excluding the one we're keeping)
        SELECT ARRAY_AGG(id) INTO duplicate_customer_ids
        FROM customers
        WHERE LOWER(TRIM(email)) = dup_email.normalized_email
        AND id != kept_customer_id;
        
        -- Update rentals to reference the kept customer
        UPDATE rentals
        SET customer_id = kept_customer_id
        WHERE customer_id = ANY(duplicate_customer_ids);
        
        -- Delete the duplicate customers
        DELETE FROM customers
        WHERE id = ANY(duplicate_customer_ids);
        
        RAISE NOTICE 'Cleaned up duplicates for email: %, kept customer ID: %, removed: %', 
            dup_email.normalized_email, kept_customer_id, duplicate_customer_ids;
    END LOOP;
END $$;

-- Normalize all email addresses to lowercase and trim whitespace
UPDATE customers
SET email = LOWER(TRIM(email))
WHERE email != LOWER(TRIM(email));

-- Add unique constraint on email field
ALTER TABLE customers 
ADD CONSTRAINT customers_email_unique UNIQUE (email);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);

-- Add a comment to document the constraint
COMMENT ON CONSTRAINT customers_email_unique ON customers IS 'Ensures no duplicate customers based on email address';

-- Verify the constraint is working
SELECT 'Unique constraint added successfully' as status; 