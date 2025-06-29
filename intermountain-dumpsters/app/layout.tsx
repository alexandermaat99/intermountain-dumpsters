import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/contexts/CartContext";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";
import Script from "next/script";

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Intermountain Dumpsters - Residential & Commercial Dumpster Rental Services",
  description: "Reliable residential and commercial dumpster rental services for construction, renovation, and cleanup projects. Fast delivery, competitive pricing, and exceptional customer service.",
  keywords: "dumpster rental, residential dumpster, commercial dumpster, construction waste, renovation cleanup, waste disposal, Intermountain Dumpsters",
  icons: {
    icon: '/WhiteLogoNoText.svg',
    shortcut: '/WhiteLogoNoText.svg',
    apple: '/WhiteLogoNoText.svg',
  },
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
              <ConditionalFooter />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
