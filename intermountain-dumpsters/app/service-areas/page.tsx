import { Metadata } from "next";
import ServiceAreasPageClient from "./ServiceAreasPageClient";

export const metadata: Metadata = {
  title: "Service Areas",
  description: "View our service areas for dumpster rental throughout the Intermountain region. Check if we serve your location and see our coverage map.",
  keywords: [
    "dumpster rental service areas",
    "Intermountain dumpster rental",
    "local dumpster rental",
    "dumpster delivery areas",
    "construction dumpster service areas"
  ],
  openGraph: {
    title: "Service Areas | Intermountain Dumpsters",
    description: "View our service areas for dumpster rental throughout the Intermountain region. Check if we serve your location and see our coverage map.",
  },
};

export default function ServiceAreasPage() {
  return <ServiceAreasPageClient />;
}