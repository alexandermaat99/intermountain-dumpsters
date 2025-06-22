-- Add radius columns to admin_info table
ALTER TABLE admin_info 
ADD COLUMN service_radius DECIMAL(5,2) DEFAULT 6.0,
ADD COLUMN surrounding_area_radius DECIMAL(5,2) DEFAULT 15.0;

-- Update existing records with default values
UPDATE admin_info 
SET 
  service_radius = 6.0,
  surrounding_area_radius = 15.0
WHERE service_radius IS NULL OR surrounding_area_radius IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN admin_info.service_radius IS 'Radius in miles for full service area coverage';
COMMENT ON COLUMN admin_info.surrounding_area_radius IS 'Radius in miles for surrounding area coverage with additional fees'; 