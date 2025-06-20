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

async function getDumpsters(): Promise<Dumpster[]> {
  const { data, error } = await supabase.from('dumpsters').select('*');
  if (error) {
    console.error('Error fetching dumpsters:', error);
    return [];
  }
  console.log('Fetched dumpsters:', data);
  console.log('Number of dumpsters:', data?.length);
  return data;
}

export default async function BookPage() {
  const dumpsters = await getDumpsters();

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

          {dumpsters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading dumpsters...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dumpsters.map((dumpster) => (
                <Card key={dumpster.id} className="flex flex-col">
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