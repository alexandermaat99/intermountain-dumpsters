-- Create the contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(10) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  business_hours JSONB NOT NULL,
  emergency_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default contact information
INSERT INTO contact_info (
  phone,
  email,
  address,
  city,
  state,
  zip_code,
  business_hours,
  emergency_phone
) VALUES (
  '(801) 555-0123',
  'info@intermountaindumpsters.com',
  '1234 Business Ave',
  'Salt Lake City',
  'UT',
  '84101',
  '{
    "monday_friday": "7:00 AM - 6:00 PM",
    "saturday": "8:00 AM - 4:00 PM",
    "sunday": "Closed (Emergency service available)"
  }',
  '(801) 555-9999'
) ON CONFLICT (id) DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_contact_info_updated_at 
  BEFORE UPDATE ON contact_info 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access" ON contact_info FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated users to update" ON contact_info FOR UPDATE USING (auth.role() = 'authenticated'); 