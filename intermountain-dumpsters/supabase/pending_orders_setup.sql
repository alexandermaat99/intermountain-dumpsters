-- Create pending_orders table
CREATE TABLE IF NOT EXISTS pending_orders (
  id BIGSERIAL PRIMARY KEY,
  customer_info JSONB NOT NULL,
  delivery_info JSONB NOT NULL,
  insurance_info JSONB NOT NULL,
  cart_info JSONB,
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pending_orders_created_at ON pending_orders(created_at);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pending_orders_updated_at 
    BEFORE UPDATE ON pending_orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a cleanup function for old pending orders (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_pending_orders()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM pending_orders 
    WHERE created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up a cron job to clean up old pending orders (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-pending-orders', '0 */6 * * *', 'SELECT cleanup_old_pending_orders();'); 