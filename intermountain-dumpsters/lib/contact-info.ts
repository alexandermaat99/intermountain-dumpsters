import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  updated_at: new Date().toISOString()
};

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const { data, error } = await supabase
      .from('contact_info')
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
    const { data, error } = await supabase
      .from('contact_info')
      .upsert({
        ...contactInfo,
        updated_at: new Date().toISOString()
      })
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