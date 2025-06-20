'use client';

import { useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

type Dumpster = {
  id: number;
  name: string;
  descriptor: string;
  length: number;
  width: number;
  height: number;
  uses: string;
  quantity: number;
  image_path: string;
  price: number;
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

export default function BookPage() {
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDumpsters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase.from('dumpsters').select('*');
      
      if (supabaseError) {
        console.error('Error fetching dumpsters:', supabaseError);
        setError('Failed to load dumpsters. Please try again.');
        return;
      }
      
      console.log('Fetched dumpsters:', data);
      console.log('Number of dumpsters:', data?.length);
      setDumpsters(data || []);
    } catch (err) {
      console.error('Error fetching dumpsters:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDumpsters();
  }, []);

  const handleRetry = () => {
    fetchDumpsters();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-5 md:gap-10 items-center">
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
          {!loading && !error && dumpsters.length === 0 && (
            <EmptyState />
          )}

          {/* Success State */}
          {!loading && !error && dumpsters.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dumpsters.map((dumpster) => (
                <Card key={dumpster.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{dumpster.name}</CardTitle>
                    <CardDescription>{dumpster.descriptor}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="relative w-full h-48">
                      <Image
                        src={dumpster.image_path}
                        alt={`Image of ${dumpster.name}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                      />
                    </div>
                    <p className="font-semibold text-lg">${dumpster.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Dimensions: {dumpster.length}&apos;L x {dumpster.width}&apos;W x {dumpster.height}&apos;H
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Best for:</span> {dumpster.uses}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Book Online</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 