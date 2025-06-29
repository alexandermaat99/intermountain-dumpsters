import { supabase } from './supabaseClient';

export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  business_hours: {
    monday_friday: string;
    saturday: string;
    sunday: string;
  };
  emergency_phone: string;
  created_at: string;
  updated_at: string;
  price_per_lb?: number;
  day_rate?: number;
  cancelation_insurance?: number;
  driveway_insurance?: number;
  rush_fee?: number;
  service_radius?: number;
  surrounding_area_radius?: number;
}

// Default contact information as fallback
export const defaultContactInfo: ContactInfo = {
  id: 1,
  phone: "(801) 555-0123",
  email: "info@intermountaindumpsters.com",
  address: "1234 Business Ave",
  city: "Salt Lake City",
  state: "UT",
  zip_code: "84101",
  business_hours: {
    monday_friday: "7:00 AM - 6:00 PM",
    saturday: "8:00 AM - 4:00 PM",
    sunday: "Closed (Emergency service available)"
  },
  emergency_phone: "(801) 555-9999",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  price_per_lb: 0.03,
  day_rate: 20,
  cancelation_insurance: 40,
  driveway_insurance: 40,
  rush_fee: 60,
  service_radius: 50,
  surrounding_area_radius: 100
};

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const { data, error } = await supabase
      .from('admin_info')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching contact info:', error);
      return defaultContactInfo;
    }

    return data || defaultContactInfo;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return defaultContactInfo;
  }
}

// Client-side version of getContactInfo
export async function getContactInfoClient(): Promise<ContactInfo> {
  try {
    const { data, error } = await supabase
      .from('admin_info')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching contact info:', error);
      return defaultContactInfo;
    }

    return data || defaultContactInfo;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return defaultContactInfo;
  }
}

export async function updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<ContactInfo | null> {
  try {
    // Ensure we have an ID to update
    if (!contactInfo.id) {
      console.error('Error updating contact info: No ID provided');
      return null;
    }

    // Prepare the update data, excluding the id field
    const { id, ...updateData } = contactInfo;
    
    const { data, error } = await supabase
      .from('admin_info')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact info:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating contact info:', error);
    return null;
  }
} 