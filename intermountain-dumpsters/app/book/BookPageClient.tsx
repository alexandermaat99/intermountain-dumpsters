'use client';

import { useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useCartContext } from "@/lib/contexts/CartContext";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { DumpsterType } from '@/lib/types';
import HowItWorksSection from "@/components/HowItWorksSection";
import AllowedItemsSection from "@/components/AllowedItemsSection";
import { getContactInfo, ContactInfo } from "@/lib/contact-info";

type DumpsterTypeWithCount = Omit<DumpsterType, 'quantity'> & {
  dumpsters: [{ count: number }];
};

// Loading skeleton component
function DumpsterSkeleton() {
  return (
    <Card className="flex flex-col animate-pulse">
      <CardHeader>
        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="relative w-full h-48 bg-muted rounded-md"></div>
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-muted rounded w-full"></div>
      </CardFooter>
    </Card>
  );
}

// Error component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">Failed to load dumpsters</h3>
      <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">No dumpsters available</h3>
      <p className="text-muted-foreground">Please check back later or contact us for assistance.</p>
    </div>
  );
}

const SUPABASE_IMAGE_URL = "https://acsxwvvvlfajjizqwcia.supabase.co/storage/v1/object/public/dumpster-images/";
const getImageUrl = (image_path: string | undefined) => {
  if (!image_path) return "/placeholder.png";
  if (image_path.startsWith("http")) return image_path;
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(image_path)) return SUPABASE_IMAGE_URL + image_path;
  return "/" + image_path;
};

export default function BookPageClient() {
  const [dumpsterTypes, setDumpsterTypes] = useState<DumpsterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { addToCart, isInCart } = useCartContext();
  const router = useRouter();
  const [addingId, setAddingId] = useState<number | null>(null);

  const fetchDumpsterTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase.from('dumpster_types').select('*, dumpsters(count)');
      
      if (supabaseError) {
        console.error('Error fetching dumpster types:', supabaseError);
        setError('Failed to load dumpsters. Please try again.');
        return;
      }
      
      const formattedData: DumpsterType[] = (data as DumpsterTypeWithCount[]).map(d => ({
        ...d,
        quantity: d.dumpsters[0]?.count ?? 0,
      }));

      console.log('Fetched dumpster types:', formattedData);
      console.log('Number of dumpster types:', formattedData.length);
      setDumpsterTypes(formattedData);
    } catch (err) {
      console.error('Error fetching dumpster types:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const info = await getContactInfo();
      setContactInfo(info);
    } catch (err) {
      console.error('Error fetching contact info:', err);
    }
  };

  useEffect(() => {
    fetchDumpsterTypes();
    fetchContactInfo();
  }, []);

  const handleRetry = () => {
    fetchDumpsterTypes();
  };

  const handleAddToCart = async (dumpsterType: DumpsterType) => {
    setAddingId(dumpsterType.id);
    addToCart(dumpsterType);
    await new Promise(res => setTimeout(res, 600));
    router.push('/cart');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-2 md:gap-4 items-center">
        {/* Navigation */}
        <Navigation currentPage="book" />

        {/* Dumpster Grid */}
        <div className="flex-1 flex flex-col gap-8 max-w-6xl p-5 w-full">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Book Your Dumpster</h1>
            <p className="text-muted-foreground">
              Browse our selection of residential and commercial dumpsters.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <DumpsterSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}

          {/* Empty State */}
          {!loading && !error && dumpsterTypes.length === 0 && (
            <EmptyState />
          )}

          {/* Success State */}
          {!loading && !error && dumpsterTypes.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dumpsterTypes.map((dumpsterType) => {
                const inCart = isInCart(dumpsterType.id);
                const isAvailable = dumpsterType.quantity > 0;
                
                return (
                  <Card key={dumpsterType.id} className={`flex flex-col hover:shadow-lg transition-shadow dark:border dark:border-white/10 ${!isAvailable ? 'opacity-50' : ''}`}>
                    <CardHeader>
                      <CardTitle>{dumpsterType.name}</CardTitle>
                      <CardDescription>{dumpsterType.descriptor}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <div className="relative w-full h-48">
                        <Image
                          src={getImageUrl(dumpsterType.image_path)}
                          alt={`Image of ${dumpsterType.name}`}
                          width={300}
                          height={200}
                          className="rounded-md"
                        />
                      </div>
                      <p className="font-semibold text-lg">${dumpsterType.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Dimensions: {dumpsterType.length}&apos;L x {dumpsterType.width}&apos;W x {dumpsterType.height}&apos;H
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Best for:</span> {dumpsterType.uses}
                      </p>
                      <p className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {isAvailable ? `${dumpsterType.quantity} Available` : 'Out of Stock'}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleAddToCart(dumpsterType)}
                        disabled={inCart || addingId === dumpsterType.id || !isAvailable}
                      >
                        {addingId === dumpsterType.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                            Adding...
                          </span>
                        ) : inCart ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Added to Cart
                          </>
                        ) : !isAvailable ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Allowed Items Section */}
        <AllowedItemsSection phoneNumber={contactInfo?.phone} />
      </div>
    </div>
  );
} 