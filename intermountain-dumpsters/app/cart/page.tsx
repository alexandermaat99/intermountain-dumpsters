'use client';

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartContext } from "@/lib/contexts/CartContext";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemoveItem = async (itemId: number) => {
    setRemovingId(itemId);
    await new Promise(res => setTimeout(res, 300));
    removeFromCart(itemId);
    setRemovingId(null);
  };

  const handleCheckout = () => {
    // TODO: Integrate with Squarespace checkout
    console.log('Proceeding to checkout with items:', cart.items);
    alert('Checkout functionality will be integrated with Squarespace soon!');
  };

  if (cart.items.length === 0) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col gap-5 md:gap-10 items-center">
          <Navigation currentPage="cart" />
          
          <div className="flex-1 flex flex-col gap-8 max-w-4xl p-5 w-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="text-4xl font-bold">Your Cart</h1>
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>

            <div className="text-center space-y-4">
              <Link href="/book">
                <Button className="flex items-center gap-2 mx-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-5 md:gap-10 items-center">
        <Navigation currentPage="cart" />
        
        <div className="flex-1 flex flex-col gap-8 max-w-6xl p-5 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Your Cart</h1>
            <p className="text-muted-foreground">
              Review your dumpster selections before checkout
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Cart Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Items ({cart.itemCount})</h2>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto relative">
                      <Image
                        src={item.image_path}
                        alt={`Image of ${item.name}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-t-md md:rounded-l-md md:rounded-t-none"
                      />
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground">{item.descriptor}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Dimensions: {item.length}&apos;L x {item.width}&apos;W x {item.height}&apos;H
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Best for: {item.uses}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingId === item.id}
                          className="text-destructive hover:text-destructive"
                        >
                          {removingId === item.id ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="flex-1">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleCheckout} 
                      className="w-full mb-3"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <Link href="/book">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    <p>Checkout will be processed through Squarespace</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 