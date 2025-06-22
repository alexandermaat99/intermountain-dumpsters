-- Add delivery_address column to rentals table
-- This stores the complete delivery address for better record keeping

-- Add delivery_address column to rentals table
ALTER TABLE rentals 
ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Add comment for documentation
COMMENT ON COLUMN rentals.delivery_address IS 'Complete delivery address including street, city, state, and ZIP code';

-- Create an index for better performance when querying by address
CREATE INDEX IF NOT EXISTS idx_rentals_delivery_address ON rentals(delivery_address);

-- Update existing records to have empty delivery address (if any exist)
UPDATE rentals 
SET delivery_address = ''
WHERE delivery_address IS NULL; 