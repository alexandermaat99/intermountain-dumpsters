import { supabase } from './supabaseClient';
import { CheckoutData, CustomerInfo } from './types';
import { calculateTaxFromServiceArea } from './tax-calculator-db';

export interface SavedOrder {
  customer_id: number;
  rental_id: number;
  total_amount: number;
  tax_amount: number;
  subtotal_amount: number;
}

export async function saveCheckoutToDatabase(
  checkoutData: CheckoutData, 
  totalAmount: number,
  resolvedCustomerAddress?: CustomerInfo
): Promise<SavedOrder | null> {
  try {
    // Calculate tax information using service areas
    const taxInfo = await calculateTaxFromServiceArea(totalAmount, checkoutData.delivery.delivery_address);
    
    // Use resolved customer address if provided, otherwise use checkoutData.customer
    const customerToSave = resolvedCustomerAddress || checkoutData.customer;
    
    // Log the customer data being sent to Supabase
    console.log('Attempting to save customer:', JSON.stringify(customerToSave, null, 2));

    // 1. Check for existing customer by email
    let customerData = null;
    
    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from('customers')
      .select('*')
      .ilike('email', customerToSave.email.trim())
      .single();

    if (customerLookupError && customerLookupError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking for existing customer:', customerLookupError);
    } else if (existingCustomer) {
      customerData = existingCustomer;
      console.log('Found existing customer by email:', customerData.id);
    }

    // 2. If no existing customer found, create a new one
    if (!customerData) {
      const { data: newCustomerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: customerToSave.first_name,
          last_name: customerToSave.last_name,
          email: customerToSave.email.toLowerCase().trim(),
          phone_number: customerToSave.phone_number,
          address_line_1: customerToSave.address_line_1,
          address_line_2: customerToSave.address_line_2,
          city: customerToSave.city,
          state: customerToSave.state,
          zip: customerToSave.zip,
          business: customerToSave.business
        })
        .select()
        .single();

      if (customerError) {
        console.error('Error saving new customer:', JSON.stringify(customerError, null, 2));
        return null;
      }

      customerData = newCustomerData;
      console.log('Created new customer:', customerData.id);
    }

    // 3. Get dumpster_type_id from the cart (assuming first item for now)
    // TODO: This should come from the actual cart items
    const dumpsterTypeId = 1; // Default, should be dynamic based on cart

    // Extract ZIP code for database storage
    const zipCode = checkoutData.delivery.delivery_address.match(/\b\d{5}\b/)?.[0] || '';

    // 4. Save rental to rentals table with tax information
    const { data: rentalData, error: rentalError } = await supabase
      .from('rentals')
      .insert({
        customer_id: customerData.id,
        dumpster_type_id: dumpsterTypeId,
        delivery_date_requested: checkoutData.delivery.delivery_date,
        delivery_address: checkoutData.delivery.delivery_address,
        cancelation_insurance: checkoutData.insurance.cancelation_insurance,
        driveway_insurance: checkoutData.insurance.driveway_insurance,
        emergency_delivery: checkoutData.insurance.emergency_delivery,
        delivered: false,
        picked_up: false,
        payment_status: 'pending',
        total_amount: taxInfo.total, // Total with tax
        subtotal_amount: taxInfo.subtotal, // Subtotal before tax
        tax_amount: taxInfo.taxAmount, // Tax amount
        tax_rate: taxInfo.taxRate, // Tax rate
        delivery_zip_code: zipCode // ZIP code used for tax calculation
      })
      .select()
      .single();

    if (rentalError) {
      console.error('Error saving rental:', rentalError);
      return null;
    }

    return {
      customer_id: customerData.id,
      rental_id: rentalData.id,
      total_amount: taxInfo.total,
      tax_amount: taxInfo.taxAmount,
      subtotal_amount: taxInfo.subtotal
    };

  } catch (error) {
    console.error('Error saving checkout to database:', error);
    return null;
  }
}

export async function updateRentalWithPayment(rentalId: number, paymentStatus: 'pending' | 'completed' | 'failed', stripeSessionId?: string) {
  try {
    const { error } = await supabase
      .from('rentals')
      .update({
        payment_status: paymentStatus,
        stripe_session_id: stripeSessionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', rentalId);

    if (error) {
      console.error('Error updating rental payment status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating rental payment status:', error);
    return false;
  }
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // Test reading from admin_info table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_info')
      .select('id, phone, email')
      .limit(1);

    if (adminError) {
      console.error('Error reading admin_info:', adminError);
      return false;
    }

    console.log('✅ Database connection successful');
    console.log('✅ admin_info table accessible:', adminData);

    // Test reading from customers table
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id, first_name, last_name')
      .limit(1);

    if (customerError) {
      console.error('Error reading customers:', customerError);
      return false;
    }

    console.log('✅ customers table accessible:', customerData);

    // Test reading from rentals table
    const { data: rentalData, error: rentalError } = await supabase
      .from('rentals')
      .select('id, customer_id, payment_status')
      .limit(1);

    if (rentalError) {
      console.error('Error reading rentals:', rentalError);
      return false;
    }

    console.log('✅ rentals table accessible:', rentalData);

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
} 