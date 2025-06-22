// Tax calculation utility for Utah sales tax
// Based on Utah's current tax rates (subject to change)

export interface TaxInfo {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number;
  taxBreakdown: {
    state: number;
    local: number;
  };
}

// Utah state sales tax rate (4.85% as of 2024)
const UTAH_STATE_TAX_RATE = 0.0485;

// Local tax rates by zip code (simplified - you may need to expand this)
const LOCAL_TAX_RATES: { [zipCode: string]: number } = {
  '84101': 0.0165, // Salt Lake City
  '84102': 0.0165, // Salt Lake City
  '84103': 0.0165, // Salt Lake City
  '84104': 0.0165, // Salt Lake City
  '84105': 0.0165, // Salt Lake City
  '84106': 0.0165, // Salt Lake City
  '84107': 0.0165, // Salt Lake City
  '84108': 0.0165, // Salt Lake City
  '84109': 0.0165, // Salt Lake City
  '84111': 0.0165, // Salt Lake City
  '84112': 0.0165, // Salt Lake City
  '84113': 0.0165, // Salt Lake City
  '84114': 0.0165, // Salt Lake City
  '84115': 0.0165, // Salt Lake City
  '84116': 0.0165, // Salt Lake City
  '84117': 0.0165, // Salt Lake City
  '84118': 0.0165, // Salt Lake City
  '84119': 0.0165, // Salt Lake City
  '84120': 0.0165, // Salt Lake City
  '84121': 0.0165, // Salt Lake City
  '84122': 0.0165, // Salt Lake City
  '84123': 0.0165, // Salt Lake City
  '84124': 0.0165, // Salt Lake City
  '84125': 0.0165, // Salt Lake City
  '84126': 0.0165, // Salt Lake City
  '84127': 0.0165, // Salt Lake City
  '84128': 0.0165, // Salt Lake City
  '84129': 0.0165, // Salt Lake City
  '84130': 0.0165, // Salt Lake City
  '84131': 0.0165, // Salt Lake City
  '84132': 0.0165, // Salt Lake City
  '84133': 0.0165, // Salt Lake City
  '84134': 0.0165, // Salt Lake City
  '84135': 0.0165, // Salt Lake City
  '84136': 0.0165, // Salt Lake City
  '84137': 0.0165, // Salt Lake City
  '84138': 0.0165, // Salt Lake City
  '84139': 0.0165, // Salt Lake City
  '84140': 0.0165, // Salt Lake City
  '84141': 0.0165, // Salt Lake City
  '84142': 0.0165, // Salt Lake City
  '84143': 0.0165, // Salt Lake City
  '84144': 0.0165, // Salt Lake City
  '84145': 0.0165, // Salt Lake City
  '84146': 0.0165, // Salt Lake City
  '84147': 0.0165, // Salt Lake City
  '84148': 0.0165, // Salt Lake City
  '84149': 0.0165, // Salt Lake City
  '84150': 0.0165, // Salt Lake City
  '84151': 0.0165, // Salt Lake City
  '84152': 0.0165, // Salt Lake City
  '84153': 0.0165, // Salt Lake City
  '84154': 0.0165, // Salt Lake City
  '84155': 0.0165, // Salt Lake City
  '84156': 0.0165, // Salt Lake City
  '84157': 0.0165, // Salt Lake City
  '84158': 0.0165, // Salt Lake City
  '84159': 0.0165, // Salt Lake City
  '84160': 0.0165, // Salt Lake City
  '84161': 0.0165, // Salt Lake City
  '84162': 0.0165, // Salt Lake City
  '84163': 0.0165, // Salt Lake City
  '84164': 0.0165, // Salt Lake City
  '84165': 0.0165, // Salt Lake City
  '84166': 0.0165, // Salt Lake City
  '84167': 0.0165, // Salt Lake City
  '84168': 0.0165, // Salt Lake City
  '84169': 0.0165, // Salt Lake City
  '84170': 0.0165, // Salt Lake City
  '84171': 0.0165, // Salt Lake City
  '84172': 0.0165, // Salt Lake City
  '84173': 0.0165, // Salt Lake City
  '84174': 0.0165, // Salt Lake City
  '84175': 0.0165, // Salt Lake City
  '84176': 0.0165, // Salt Lake City
  '84177': 0.0165, // Salt Lake City
  '84178': 0.0165, // Salt Lake City
  '84179': 0.0165, // Salt Lake City
  '84180': 0.0165, // Salt Lake City
  '84181': 0.0165, // Salt Lake City
  '84182': 0.0165, // Salt Lake City
  '84183': 0.0165, // Salt Lake City
  '84184': 0.0165, // Salt Lake City
  '84185': 0.0165, // Salt Lake City
  '84186': 0.0165, // Salt Lake City
  '84187': 0.0165, // Salt Lake City
  '84188': 0.0165, // Salt Lake City
  '84189': 0.0165, // Salt Lake City
  '84190': 0.0165, // Salt Lake City
  '84191': 0.0165, // Salt Lake City
  '84192': 0.0165, // Salt Lake City
  '84193': 0.0165, // Salt Lake City
  '84194': 0.0165, // Salt Lake City
  '84195': 0.0165, // Salt Lake City
  '84196': 0.0165, // Salt Lake City
  '84197': 0.0165, // Salt Lake City
  '84198': 0.0165, // Salt Lake City
  '84199': 0.0165, // Salt Lake City
  // Add more zip codes as needed
};

// Default local tax rate if zip code not found
const DEFAULT_LOCAL_TAX_RATE = 0.0165; // 1.65% - Salt Lake City rate

export function calculateTax(subtotal: number, zipCode: string): TaxInfo {
  // Get local tax rate for the zip code
  const localTaxRate = LOCAL_TAX_RATES[zipCode] || DEFAULT_LOCAL_TAX_RATE;
  
  // Calculate total tax rate
  const totalTaxRate = UTAH_STATE_TAX_RATE + localTaxRate;
  
  // Calculate tax amounts
  const stateTax = subtotal * UTAH_STATE_TAX_RATE;
  const localTax = subtotal * localTaxRate;
  const totalTax = stateTax + localTax;
  
  // Calculate final total
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

// Helper function to format tax display
export function formatTaxDisplay(taxInfo: TaxInfo): string {
  const totalTaxRate = (taxInfo.taxRate * 100).toFixed(2);
  return `${totalTaxRate}% (State: ${(UTAH_STATE_TAX_RATE * 100).toFixed(2)}% + Local: ${((taxInfo.taxRate - UTAH_STATE_TAX_RATE) * 100).toFixed(2)}%)`;
}

// Helper function to check if tax should be applied
export function shouldApplyTax(_zipCode: string): boolean {
  // In Utah, sales tax applies to most services including dumpster rentals
  // You may want to add business logic here for tax-exempt customers
  return true;
} 