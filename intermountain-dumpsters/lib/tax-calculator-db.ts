// Tax calculation utility that uses service_areas table for dynamic tax rates
// This is more flexible than hardcoded tax rates

import { supabase } from './supabaseClient';

export interface TaxInfo {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number;
  taxBreakdown: {
    state: number;
    local: number;
  };
  serviceArea?: {
    id: number;
    name: string;
    localTaxRate: number;
  };
  debug?: {
    extractedZip: string;
    matchedServiceArea: string;
    addressUsed: string;
  };
}

// Utah state sales tax rate (4.85% as of 2024)
const UTAH_STATE_TAX_RATE = 0.0485;

// Default local tax rate if no service area is found
const DEFAULT_LOCAL_TAX_RATE = 0.0165; // 1.65% - Salt Lake City rate

export async function calculateTaxFromServiceArea(subtotal: number, deliveryAddress: string): Promise<TaxInfo> {
  try {
    console.log('🧮 Starting tax calculation for address:', deliveryAddress);
    
    // Find the closest service area based on ZIP code or address
    const { data: serviceAreas, error } = await supabase
      .from('service_areas')
      .select('id, name, local_tax_rate, latitude, longitude')
      .not('local_tax_rate', 'is', null);

    if (error) {
      console.error('Error fetching service areas:', error);
      return calculateTaxWithDefaultRate(subtotal);
    }

    if (!serviceAreas || serviceAreas.length === 0) {
      console.log('⚠️ No service areas found in database');
      return calculateTaxWithDefaultRate(subtotal);
    }

    console.log('📋 Available service areas:', serviceAreas.map(sa => `${sa.name} (${sa.local_tax_rate})`));

    // Try to find service area by ZIP code first, then by address matching
    let serviceArea = null;
    
    serviceArea = findServiceAreaByAddress(deliveryAddress, serviceAreas);
    
    const localTaxRate = serviceArea?.local_tax_rate || DEFAULT_LOCAL_TAX_RATE;
    
    console.log('🎯 Selected service area:', serviceArea?.name || 'Default (Salt Lake City)');
    console.log('💰 Local tax rate:', localTaxRate);
    
    // Calculate total tax rate
    const totalTaxRate = UTAH_STATE_TAX_RATE + localTaxRate;
    
    // Calculate tax amounts
    const stateTax = subtotal * UTAH_STATE_TAX_RATE;
    const localTax = subtotal * localTaxRate;
    const totalTax = stateTax + localTax;
    
    // Calculate final total
    const total = subtotal + totalTax;
    
    const result = {
      subtotal,
      taxAmount: totalTax,
      total,
      taxRate: totalTaxRate,
      taxBreakdown: {
        state: stateTax,
        local: localTax
      },
      serviceArea: serviceArea ? {
        id: serviceArea.id,
        name: serviceArea.name,
        localTaxRate: serviceArea.local_tax_rate
      } : undefined,
      debug: {
        extractedZip: '',
        matchedServiceArea: serviceArea?.name || 'Default (Salt Lake City)',
        addressUsed: deliveryAddress
      }
    };
    
    console.log('📊 Tax calculation result:', result);
    return result;

  } catch (error) {
    console.error('Error calculating tax from service area:', error);
    return calculateTaxWithDefaultRate(subtotal);
  }
}

// Fallback function using default rate
function calculateTaxWithDefaultRate(subtotal: number): TaxInfo {
  const totalTaxRate = UTAH_STATE_TAX_RATE + DEFAULT_LOCAL_TAX_RATE;
  const stateTax = subtotal * UTAH_STATE_TAX_RATE;
  const localTax = subtotal * DEFAULT_LOCAL_TAX_RATE;
  const totalTax = stateTax + localTax;
  const total = subtotal + totalTax;
  
  return {
    subtotal,
    taxAmount: totalTax,
    total,
    taxRate: totalTaxRate,
    taxBreakdown: {
      state: stateTax,
      local: localTax
    }
  };
}

// Helper function to find service area by address
// This is a simplified approach - you might want to use geocoding for more accuracy
function findServiceAreaByAddress(address: string, serviceAreas: Array<{id: number; name: string; local_tax_rate: number; latitude: number; longitude: number}>): {id: number; name: string; local_tax_rate: number; latitude: number; longitude: number} | null {
  const addressLower = address.toLowerCase();
  console.log('🔍 Searching for service area in address:', addressLower);
  
  // Try to match by city names in the address
  for (const area of serviceAreas) {
    const areaNameLower = area.name.toLowerCase();
    
    // Check if the service area name appears in the address
    if (addressLower.includes(areaNameLower)) {
      console.log('✅ Found exact match:', area.name);
      return area;
    }
    
    // Check for common variations
    const variations = getCityVariations(areaNameLower);
    for (const variation of variations) {
      if (addressLower.includes(variation)) {
        console.log('✅ Found variation match:', area.name, 'via variation:', variation);
        return area;
      }
    }
  }
  
  // If no match found, return the first service area as default
  console.log('⚠️ No service area match found, using default:', serviceAreas[0]?.name);
  return serviceAreas[0] || null;
}

// Helper function to get common city name variations
function getCityVariations(cityName: string): string[] {
  const variations: { [key: string]: string[] } = {
    'salt lake city': ['slc', 'salt lake'],
    'west valley city': ['west valley', 'wvc'],
    'south jordan': ['south jordan'],
    'west jordan': ['west jordan'],
    'saratoga springs': ['saratoga'],
    'eagle mountain': ['eagle mountain'],
    'cedar hills': ['cedar hills'],
    'american fork': ['american fork', 'af'],
    'pleasant grove': ['pleasant grove', 'pg'],
    'spanish fork': ['spanish fork', 'sf'],
    'mapleton': ['mapleton'],
    'payson': ['payson'],
    'salem': ['salem'],
    'santaquin': ['santaquin'],
    'genola': ['genola'],
    'goshen': ['goshen'],
    'elberta': ['elberta'],
    'woodland hills': ['woodland hills'],
    'elk ridge': ['elk ridge'],
    'spring lake': ['spring lake'],
    'benjamin': ['benjamin'],
    'lake shore': ['lake shore'],
    'palmyra': ['palmyra'],
    'fairfield': ['fairfield'],
    'cedar fort': ['cedar fort']
  };
  
  return variations[cityName] || [cityName];
}

// Helper function to format tax display
export function formatTaxDisplay(taxInfo: TaxInfo): string {
  const totalTaxRate = (taxInfo.taxRate * 100).toFixed(2);
  const localTaxRate = ((taxInfo.taxRate - UTAH_STATE_TAX_RATE) * 100).toFixed(2);
  
  if (taxInfo.serviceArea) {
    return `${totalTaxRate}% (State: ${(UTAH_STATE_TAX_RATE * 100).toFixed(2)}% + ${taxInfo.serviceArea.name}: ${localTaxRate}%)`;
  }
  
  return `${totalTaxRate}% (State: ${(UTAH_STATE_TAX_RATE * 100).toFixed(2)}% + Local: ${localTaxRate}%)`;
}

// Helper function to check if tax should be applied
export function shouldApplyTax(): boolean {
  // In Utah, sales tax applies to most services including dumpster rentals
  // You may want to add business logic here for tax-exempt customers
  return true;
}

// Function to get all service areas with their tax rates (for admin purposes)
export async function getServiceAreasWithTaxRates() {
  try {
    const { data, error } = await supabase
      .from('service_areas')
      .select('id, name, local_tax_rate, latitude, longitude')
      .order('name');
    
    if (error) {
      console.error('Error fetching service areas with tax rates:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching service areas with tax rates:', error);
    return [];
  }
} 