import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/contexts/CartContext";
import Footer from "@/components/Footer";
import "./globals.css";
import Script from "next/script";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Intermountain Dumpsters - Residential & Commercial Dumpster Rental Services",
  description: "Reliable residential and commercial dumpster rental services for construction, renovation, and cleanup projects. Fast delivery, competitive pricing, and exceptional customer service.",
  keywords: "dumpster rental, residential dumpster, commercial dumpster, construction waste, renovation cleanup, waste disposal, Intermountain Dumpsters",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <Suspense fallback={
                <footer className="w-full border-t border-transparent bg-brand-green-dark text-white">
                  <div className="max-w-7xl mx-auto px-5 py-12">
                    <div className="animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                </footer>
              }>
                <Footer />
              </Suspense>
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
