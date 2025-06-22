// Address validation utility for checking if delivery addresses are within service areas
// Uses distance calculations to determine if an address is serviceable

import { supabase } from './supabaseClient';

export interface ServiceArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  local_tax_rate: number;
}

export interface AddressValidationResult {
  isValid: boolean;
  serviceArea?: ServiceArea;
  distance?: number; // Distance in miles
  message: string;
  isWithinServiceArea: boolean;
  isWithinSurroundingArea: boolean;
}

// Default radius values (fallback if database values are not available)
const DEFAULT_SERVICE_AREA_RADIUS = 6; // 6 miles from service area center
const DEFAULT_SURROUNDING_AREA_RADIUS = 15; // 15 miles for surrounding areas

// Get radius values from admin_info table
async function getRadiusValues(): Promise<{ serviceRadius: number; surroundingRadius: number; phone: string }> {
  try {
    const { data, error } = await supabase
      .from('admin_info')
      .select('service_radius, surrounding_area_radius, phone')
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.warn('Could not fetch radius values from admin_info, using defaults');
      return {
        serviceRadius: DEFAULT_SERVICE_AREA_RADIUS,
        surroundingRadius: DEFAULT_SURROUNDING_AREA_RADIUS,
        phone: '(801) 555-0123' // Default phone number
      };
    }
    
    const adminInfo = data[0];
    return {
      serviceRadius: adminInfo.service_radius || DEFAULT_SERVICE_AREA_RADIUS,
      surroundingRadius: adminInfo.surrounding_area_radius || DEFAULT_SURROUNDING_AREA_RADIUS,
      phone: adminInfo.phone || '(801) 555-0123'
    };
  } catch (error) {
    console.error('Error fetching radius values:', error);
    return {
      serviceRadius: DEFAULT_SERVICE_AREA_RADIUS,
      surroundingRadius: DEFAULT_SURROUNDING_AREA_RADIUS,
      phone: '(801) 555-0123'
    };
  }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Get coordinates from address using Google Geocoding
async function getAddressCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Don't attempt geocoding for very short or incomplete addresses
    if (!address || address.length < 10) {
      return null;
    }

    // Use the Google Maps Geocoding service with broader bounds
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ 
        address,
        region: 'us', // Restrict to US addresses
        // Remove restrictive bounds to allow more addresses to be geocoded
        // bounds: new google.maps.LatLngBounds(
        //   new google.maps.LatLng(36.5, -114.5), // Southwest Utah
        //   new google.maps.LatLng(42.5, -108.5)  // Northeast Utah
        // )
      }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng()
          };
          resolve(coords);
        } else if (status === 'ZERO_RESULTS') {
          resolve(null);
        } else {
          console.error('Geocoding failed:', status, 'for address:', address);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting address coordinates:', error);
    return null;
  }
}

// Validate if an address is within service areas
export async function validateDeliveryAddress(address: string): Promise<AddressValidationResult> {
  try {
    // Get radius values from admin_info table
    const { serviceRadius, surroundingRadius, phone } = await getRadiusValues();
    
    // Get coordinates for the delivery address first
    const coordinates = await getAddressCoordinates(address);
    
    if (coordinates) {
      // Get all service areas from database
      const { data: serviceAreas, error } = await supabase
        .from('service_areas')
        .select('id, name, latitude, longitude, local_tax_rate')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (error || !serviceAreas || serviceAreas.length === 0) {
        console.error('Error fetching service areas:', error);
        return {
          isValid: false,
          message: `Unable to validate service areas. Please call us at ${phone} for assistance.`,
          isWithinServiceArea: false,
          isWithinSurroundingArea: false
        };
      }
      
      // Check distance to each service area
      let closestServiceArea: ServiceArea | null = null;
      let closestDistance = Infinity;
      let isWithinServiceArea = false;
      let isWithinSurroundingArea = false;
      
      for (const area of serviceAreas) {
        const distance = calculateDistance(
          coordinates.lat,
          coordinates.lng,
          area.latitude,
          area.longitude
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestServiceArea = area;
        }
        
        if (distance <= serviceRadius) {
          isWithinServiceArea = true;
        }
        
        if (distance <= surroundingRadius) {
          isWithinSurroundingArea = true;
        }
      }
      
      // Determine validation result
      let isValid = false;
      let message = '';
      
      if (isWithinServiceArea) {
        isValid = true;
        message = `✅ Address is within our service area (${closestServiceArea?.name}). Distance: ${closestDistance.toFixed(1)} miles.`;
      } else if (isWithinSurroundingArea) {
        isValid = true;
        message = `⚠️ Address is in a surrounding area (${closestServiceArea?.name}). Distance: ${closestDistance.toFixed(1)} miles. Additional delivery fees may apply.`;
      } else {
        isValid = false;
        message = `❌ Address is outside our service area. Closest service area: ${closestServiceArea?.name} (${closestDistance.toFixed(1)} miles away). Please call us at ${phone} for availability.`;
      }
      
      const result: AddressValidationResult = {
        isValid,
        serviceArea: closestServiceArea || undefined,
        distance: closestDistance,
        message,
        isWithinServiceArea,
        isWithinSurroundingArea
      };
      
      return result;
    } else {
      // If geocoding fails, fall back to quick validation
      const quickResult = quickCityValidation(address, phone);
      return {
        ...quickResult,
        distance: quickResult.distance,
        message: quickResult.message
      };
    }
    
  } catch (error) {
    console.error('Error validating delivery address:', error);
    // Fall back to quick validation
    const quickResult = quickCityValidation(address);
    return {
      ...quickResult,
      distance: quickResult.distance,
      message: quickResult.message
    };
  }
}

// Quick validation for common Utah cities (fallback)
export function quickCityValidation(address: string, phone: string = '(801) 555-0123'): AddressValidationResult {
  const addressLower = address.toLowerCase();
  
  // List of serviceable cities - expanded to include more areas
  const serviceableCities = [
    'salt lake city', 'slc', 'west valley city', 'west valley', 'wvc',
    'south jordan', 'west jordan', 'sandy', 'murray', 'draper',
    'riverton', 'herriman', 'bluffdale', 'saratoga springs',
    'lehi', 'orem', 'provo', 'american fork', 'pleasant grove',
    'lindon', 'vineyard', 'springville', 'spanish fork', 'mapleton',
    'payson', 'salem', 'santaquin', 'genola', 'goshen', 'elberta',
    'woodland hills', 'elk ridge', 'spring lake', 'benjamin',
    'lake shore', 'palmyra', 'fairfield', 'cedar fort',
    'layton', 'ogden', 'clearfield', 'syracuse', 'kaysville',
    'farmington', 'centerville', 'bountiful', 'north salt lake',
    'woods cross', 'west bountiful', 'south weber', 'uintah',
    'park city', 'heber', 'midway', 'kamas', 'coalville',
    'eagle mountain', 'cedar hills', 'alpine', 'highland',
    'lone peak', 'timpanogos', 'pleasant grove', 'orem',
    'provo canyon', 'sundance', 'deer valley', 'canyons',
    'brighton', 'solitude', 'alta', 'snowbird'
  ];
  
  // Check if address contains any serviceable city
  for (const city of serviceableCities) {
    if (addressLower.includes(city)) {
      return {
        isValid: true,
        message: `✅ Address appears to be in a serviceable area (${city}).`,
        isWithinServiceArea: true,
        isWithinSurroundingArea: true
      };
    }
  }
  
  return {
    isValid: false,
    message: `❌ Address appears to be outside our service areas. Please call us at ${phone} for availability.`,
    isWithinServiceArea: false,
    isWithinSurroundingArea: false
  };
} 