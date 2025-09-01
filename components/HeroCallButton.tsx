import { getContactInfo } from "@/lib/contact-info";

export default async function HeroCallButton() {
  const contactInfo = await getContactInfo();
  const phone = contactInfo.phone || "(801) 555-0123";
  return (
    <a
      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
      className="w-full sm:min-w-[210px] flex items-center justify-center gap-2 bg-white text-[#2C6B9E] px-6 py-3 rounded-lg font-medium text-base shadow-md border border-[#2C6B9E] hover:bg-[#f3f8fc] active:bg-[#e6f0fa] transition-all focus:outline-none focus:ring-2 focus:ring-[#2C6B9E]/40 whitespace-nowrap"
    >
      <svg className="w-5 h-5 mr-1 opacity-80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13 1.05.37 2.07.72 3.05a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.98.35 2 .59 3.05.72A2 2 0 0122 16.92z"/>
      </svg>
      Call to Book
    </a>
  );
} 