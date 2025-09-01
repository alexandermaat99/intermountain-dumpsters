// Script to check and configure service areas
// Run this with: node scripts/check-service-areas.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acsxwvvvlfajjizqwcia.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjc3h3dnZ2bGZhamppenF3Y2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTQwNzIsImV4cCI6MjA2NTg3MDA3Mn0.BhDCtlva_D8H56mesZZs9z_UgdUnrYokeOUaqVdVzWc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkServiceAreas() {
  console.log('🔍 Checking service areas configuration...\n');

  try {
    // Check admin_info table
    console.log('📋 Checking admin_info table...');
    const { data: adminInfo, error: adminError } = await supabase
      .from('admin_info')
      .select('*')
      .limit(1);

    if (adminError) {
      console.error('❌ Error fetching admin_info:', adminError);
    } else if (!adminInfo || adminInfo.length === 0) {
      console.log('⚠️ No admin_info found. Creating default record...');
      
      const { data: newAdmin, error: insertError } = await supabase
        .from('admin_info')
        .insert({
          service_radius: 6.0,
          surrounding_area_radius: 15.0,
          phone: '(801) 555-0123'
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating admin_info:', insertError);
      } else {
        console.log('✅ Created admin_info with default values');
      }
    } else {
      console.log('✅ Admin info found:', adminInfo[0]);
    }

    // Check service_areas table
    console.log('\n📋 Checking service_areas table...');
    const { data: serviceAreas, error: serviceError } = await supabase
      .from('service_areas')
      .select('*')
      .order('name');

    if (serviceError) {
      console.error('❌ Error fetching service areas:', serviceError);
    } else if (!serviceAreas || serviceAreas.length === 0) {
      console.log('⚠️ No service areas found. Creating default service areas...');
      
      const defaultAreas = [
        {
          name: 'Salt Lake City',
          latitude: 40.7608,
          longitude: -111.8910,
          local_tax_rate: 0.0165
        },
        {
          name: 'Provo',
          latitude: 40.2338,
          longitude: -111.6585,
          local_tax_rate: 0.0165
        },
        {
          name: 'Ogden',
          latitude: 41.2230,
          longitude: -111.9738,
          local_tax_rate: 0.0165
        },
        {
          name: 'Lehi',
          latitude: 40.3916,
          longitude: -111.8505,
          local_tax_rate: 0.0165
        },
        {
          name: 'Sandy',
          latitude: 40.5649,
          longitude: -111.8389,
          local_tax_rate: 0.0165
        }
      ];

      const { data: newAreas, error: insertError } = await supabase
        .from('service_areas')
        .insert(defaultAreas)
        .select();

      if (insertError) {
        console.error('❌ Error creating service areas:', insertError);
      } else {
        console.log('✅ Created default service areas:', newAreas.length);
      }
    } else {
      console.log(`✅ Found ${serviceAreas.length} service areas:`);
      serviceAreas.forEach(area => {
        console.log(`  - ${area.name}: (${area.latitude}, ${area.longitude}) - Tax: ${(area.local_tax_rate * 100).toFixed(2)}%`);
      });
    }

    // Test address validation
    console.log('\n🧪 Testing address validation...');
    const testAddresses = [
      '123 Main St, Salt Lake City, UT 84101',
      '456 Center St, Provo, UT 84601',
      '789 Oak Ave, Lehi, UT 84043',
      '999 Pine St, New York, NY 10001' // Should be outside service area
    ];

    for (const address of testAddresses) {
      console.log(`\nTesting: ${address}`);
      
      // Simulate the validation logic
      const coordinates = await getAddressCoordinates(address);
      if (coordinates) {
        console.log(`  Coordinates: ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`);
        
        // Check distance to each service area
        for (const area of serviceAreas || []) {
          const distance = calculateDistance(
            coordinates.lat,
            coordinates.lng,
            area.latitude,
            area.longitude
          );
          console.log(`  Distance to ${area.name}: ${distance.toFixed(1)} miles`);
        }
      } else {
        console.log('  ❌ Could not geocode address');
      }
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Helper functions (simplified versions)
async function getAddressCoordinates(address) {
  // This is a simplified version - in the real app, this uses Google Maps API
  console.log(`  🔍 Geocoding: ${address}`);
  
  // For testing, return mock coordinates based on city
  const mockCoords = {
    'salt lake city': { lat: 40.7608, lng: -111.8910 },
    'provo': { lat: 40.2338, lng: -111.6585 },
    'lehi': { lat: 40.3916, lng: -111.8505 },
    'new york': { lat: 40.7128, lng: -74.0060 }
  };

  const addressLower = address.toLowerCase();
  for (const [city, coords] of Object.entries(mockCoords)) {
    if (addressLower.includes(city)) {
      return coords;
    }
  }
  
  return null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Run the script
checkServiceAreas().then(() => {
  console.log('\n✅ Script completed');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
}); 