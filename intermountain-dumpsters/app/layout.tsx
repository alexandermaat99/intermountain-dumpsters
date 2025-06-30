import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AdminThemeProvider from "@/components/AdminThemeProvider";
import { CartProvider } from "@/lib/contexts/CartContext";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";
import Script from "next/script";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Intermountain Dumpsters - Residential & Commercial Dumpster Rental Services",
    template: "%s | Intermountain Dumpsters"
  },
  description: "Reliable residential and commercial dumpster rental services for construction, renovation, and cleanup projects. Fast delivery, competitive pricing, and exceptional customer service throughout the Intermountain region.",
  keywords: [
    "dumpster rental",
    "residential dumpster",
    "commercial dumpster", 
    "construction waste",
    "renovation cleanup",
    "waste disposal",
    "Intermountain Dumpsters",
    "dumpster delivery",
    "construction dumpster",
    "home renovation dumpster",
    "waste management",
    "dumpster pickup",
    "local dumpster rental"
  ],
  authors: [{ name: "Intermountain Dumpsters" }],
  creator: "Intermountain Dumpsters",
  publisher: "Intermountain Dumpsters",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "Intermountain Dumpsters - Residential & Commercial Dumpster Rental Services",
    description: "Reliable residential and commercial dumpster rental services for construction, renovation, and cleanup projects. Fast delivery, competitive pricing, and exceptional customer service.",
    siteName: "Intermountain Dumpsters",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Intermountain Dumpsters - Professional Dumpster Rental Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  title: "Intermountain Dumpsters - Residential & Commercial Dumpster Rental Services",
  description: "Reliable residential and commercial dumpster rental services for construction, renovation, and cleanup projects. Fast delivery, competitive pricing, and exceptional customer service.",
    images: ["/twitter-image.png"],
    creator: "@intermountaindumpsters",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: defaultUrl,
  },
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
        {/* Favicons for all platforms - use green logo */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <AdminThemeProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <ConditionalFooter />
            </div>
          </CartProvider>
        </AdminThemeProvider>
      </body>
    </html>
  );
}
