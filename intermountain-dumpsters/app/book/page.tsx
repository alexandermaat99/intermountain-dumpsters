import { Metadata } from "next";
import BookPageClient from "./BookPageClient";

export const metadata: Metadata = {
  title: "Book Your Dumpster",
  description: "Browse and book residential and commercial dumpsters for your construction, renovation, or cleanup project. Fast delivery and competitive pricing.",
  keywords: [
    "book dumpster",
    "dumpster rental booking",
    "residential dumpster booking",
    "commercial dumpster booking",
    "construction dumpster rental",
    "renovation dumpster rental"
  ],
  openGraph: {
    title: "Book Your Dumpster | Intermountain Dumpsters",
    description: "Browse and book residential and commercial dumpsters for your construction, renovation, or cleanup project. Fast delivery and competitive pricing.",
  },
};

export default function BookPage() {
  return <BookPageClient />;
} 