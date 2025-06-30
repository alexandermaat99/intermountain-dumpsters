import { supabase } from './supabaseClient';

export interface ServiceArea {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  local_tax_rate: number;
  created_at: string;
  updated_at: string;
}

export async function getServiceAreas(): Promise<ServiceArea[]> {
  try {
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching service areas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching service areas:', error);
    return [];
  }
}

export async function createServiceArea(serviceArea: Omit<ServiceArea, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceArea | null> {
  try {
    const { data, error } = await supabase
      .from('service_areas')
      .insert({
        ...serviceArea,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service area:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating service area:', error);
    return null;
  }
}

export async function updateServiceArea(id: number, updates: Partial<Omit<ServiceArea, 'id' | 'created_at'>>): Promise<ServiceArea | null> {
  try {
    const { data, error } = await supabase
      .from('service_areas')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service area:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating service area:', error);
    return null;
  }
}

export async function deleteServiceArea(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_areas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service area:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting service area:', error);
    return false;
  }
}

export async function checkServiceAreaNameExists(name: string, excludeId?: number): Promise<boolean> {
  try {
    let query = supabase
      .from('service_areas')
      .select('id')
      .eq('name', name);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking service area name:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking service area name:', error);
    return false;
  }
} 