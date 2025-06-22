export type DumpsterType = {
  id: number;
  name: string;
  descriptor: string;
  length: number;
  width: number;
  height: number;
  uses: string;
  image_path: string;
  price: number;
  long_description: string;
  created_at: string;
  quantity: number; // This will be calculated
};

export type CartItem = Omit<DumpsterType, 'quantity'> & {
    quantity: number; // quantity in cart
    availableQuantity: number;
};

export type CustomerInfo = {
  first_name: string;
  last_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip: string;
  business: boolean;
};

export type DeliveryDetails = {
  delivery_date: string;
  delivery_address: string;
};

export type InsuranceOptions = {
  driveway_insurance: boolean;
  cancelation_insurance: boolean;
  emergency_delivery: boolean;
};

export type CheckoutData = {
  customer: CustomerInfo;
  delivery: DeliveryDetails;
  insurance: InsuranceOptions;
  contract_accepted: boolean;
};

export type CheckoutStep = 'customer' | 'delivery' | 'insurance' | 'contract' | 'payment'; 