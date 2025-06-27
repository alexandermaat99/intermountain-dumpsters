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

export interface PendingOrder {
  id: number;
  customer_info: CustomerInfo;
  delivery_info: {
    delivery_date: string;
    delivery_address: string;
  };
  insurance_info: {
    driveway_insurance: boolean;
    cancelation_insurance: boolean;
    emergency_delivery: boolean;
  };
  cart_info: any; // You can type this more specifically
  total_amount: number;
  tax_amount: number;
  subtotal_amount: number;
  created_at: string;
}

export async function createPendingOrder(
  checkoutData: CheckoutData, 
  totalAmount: number,
  resolvedCustomerAddress?: CustomerInfo
): Promise<{ pendingOrderId: number; checkoutUrl: string } | null> {
  try {
    // Calculate tax information using service areas
    const taxInfo = await calculateTaxFromServiceArea(totalAmount, checkoutData.delivery.delivery_address);
    
    // Use resolved customer address if provided, otherwise use checkoutData.customer
    const customerToSave = resolvedCustomerAddress || checkoutData.customer;
    
    // Log the pending order data
    console.log('Creating pending order:', JSON.stringify(customerToSave, null, 2));

    // Create pending order
    const { data: pendingOrderData, error: pendingOrderError } = await supabase
      .from('pending_orders')
      .insert({
        customer_info: customerToSave,
        delivery_info: {
          delivery_date: checkoutData.delivery.delivery_date,
          delivery_address: checkoutData.delivery.delivery_address,
        },
        insurance_info: checkoutData.insurance,
        cart_info: {}, // You can add cart data here if needed
        total_amount: taxInfo.total,
        tax_amount: taxInfo.taxAmount,
        subtotal_amount: taxInfo.subtotal,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (pendingOrderError) {
      console.error('Error creating pending order:', JSON.stringify(pendingOrderError, null, 2));
      return null;
    }

    console.log('Created pending order:', pendingOrderData.id);

    // Create Stripe checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pendingOrderId: pendingOrderData.id,
        amount: taxInfo.total,
        customerEmail: customerToSave.email,
        customerName: customerToSave.business 
          ? customerToSave.first_name 
          : `${customerToSave.first_name} ${customerToSave.last_name}`,
        deliveryAddress: checkoutData.delivery.delivery_address,
        deliveryDate: checkoutData.delivery.delivery_date,
      }),
    });

    const { url, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    if (!url) {
      throw new Error('No checkout URL received');
    }

    return {
      pendingOrderId: pendingOrderData.id,
      checkoutUrl: url
    };

  } catch (error) {
    console.error('Error creating pending order:', error);
    return null;
  }
}

export async function confirmPendingOrder(pendingOrderId: number, stripeSessionId: string): Promise<SavedOrder | null> {
  try {
    // Get the pending order
    const { data: pendingOrder, error: fetchError } = await supabase
      .from('pending_orders')
      .select('*')
      .eq('id', pendingOrderId)
      .single();

    if (fetchError || !pendingOrder) {
      console.error('Error fetching pending order:', fetchError);
      return null;
    }

    const customerToSave = pendingOrder.customer_info;

    // Check for existing customer by email
    let customerData = null;
    
    const { data: existingCustomer, error: customerLookupError } = await supabase
      .from('customers')
      .select('*')
      .ilike('email', customerToSave.email.trim())
      .single();

    if (customerLookupError && customerLookupError.code !== 'PGRST116') {
      console.error('Error checking for existing customer:', customerLookupError);
    } else if (existingCustomer) {
      customerData = existingCustomer;
      console.log('Found existing customer by email:', customerData.id);
    }

    // If no existing customer found, create a new one
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

    // Extract ZIP code for database storage
    const zipCode = pendingOrder.delivery_info.delivery_address.match(/\b\d{5}\b/)?.[0] || '';

    // Create the actual rental record
    const { data: rentalResult, error: rentalError } = await supabase
      .from('rentals')
      .insert({
        customer_id: customerData.id,
        dumpster_type_id: 1, // Default, should be dynamic based on cart
        delivery_date_requested: pendingOrder.delivery_info.delivery_date,
        delivery_address: pendingOrder.delivery_info.delivery_address,
        cancelation_insurance: pendingOrder.insurance_info.cancelation_insurance,
        driveway_insurance: pendingOrder.insurance_info.driveway_insurance,
        emergency_delivery: pendingOrder.insurance_info.emergency_delivery,
        delivered: false,
        picked_up: false,
        payment_status: 'completed',
        total_amount: pendingOrder.total_amount,
        subtotal_amount: pendingOrder.subtotal_amount,
        tax_amount: pendingOrder.tax_amount,
        tax_rate: pendingOrder.tax_amount / pendingOrder.subtotal_amount,
        delivery_zip_code: zipCode,
        stripe_session_id: stripeSessionId
      })
      .select()
      .single();

    if (rentalError) {
      console.error('Error saving rental:', rentalError);
      return null;
    }

    console.log('Successfully created rental:', rentalResult.id);

    // Delete the pending order
    const { error: deleteError } = await supabase
      .from('pending_orders')
      .delete()
      .eq('id', pendingOrderId);

    if (deleteError) {
      console.error('Error deleting pending order:', deleteError);
      // Don't return null here as the rental was created successfully
    } else {
      console.log('Successfully deleted pending order');
    }

    console.log('Successfully confirmed pending order:', pendingOrderId);

    return {
      customer_id: customerData.id,
      rental_id: rentalResult.id,
      total_amount: pendingOrder.total_amount,
      tax_amount: pendingOrder.tax_amount,
      subtotal_amount: pendingOrder.subtotal_amount
    };

  } catch (error) {
    console.error('Error confirming pending order:', error);
    return null;
  }
}

// Keep the old function for backward compatibility but mark as deprecated
export async function saveCheckoutToDatabase(
  checkoutData: CheckoutData, 
  totalAmount: number,
  resolvedCustomerAddress?: CustomerInfo
): Promise<SavedOrder | null> {
  console.warn('saveCheckoutToDatabase is deprecated. Use createPendingOrder instead.');
  return null;
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