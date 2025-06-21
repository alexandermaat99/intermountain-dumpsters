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