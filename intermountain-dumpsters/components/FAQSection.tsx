import React from 'react';
import Script from 'next/script';

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  structuredData?: boolean;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs, structuredData }) => {
  // Generate FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="w-full bg-white py-16 px-4">
      {structuredData && (
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Frequently Asked Questions</h2>
      <div className="w-full max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <details key={idx} className="group border border-green-200 rounded-lg bg-green-50 shadow w-full">
            <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-green-800 flex items-center justify-between group-open:bg-green-100 transition rounded-lg">
              {faq.question}
              <span className="ml-2 text-green-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-6 pb-4 pt-2 text-green-700 text-base bg-green-100 rounded-b-lg">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection; 