'use client';

import React, { useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

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

  // Trigger entrance animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="w-full bg-background py-16 px-4">
      {structuredData && (
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800 dark:text-green-400">
          Frequently Asked Questions
        </h2>
        <div className="w-full max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`transition-all duration-700 ease-out transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`
              }}
            >
              <div className="group border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-950/50 shadow w-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full cursor-pointer px-6 py-4 text-lg font-semibold text-green-800 dark:text-green-400 flex items-center justify-between transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg"
                >
                  <span className="text-left pr-4">{faq.question}</span>
                  <span className={`ml-2 text-green-600 dark:text-green-500 transition-transform duration-300 flex-shrink-0 ${
                    openItems.has(idx) ? 'rotate-180' : 'rotate-0'
                  }`}>
                    ▼
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openItems.has(idx) 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4 pt-2 text-green-700 dark:text-green-300 text-base bg-green-100 dark:bg-green-900/30 rounded-b-lg transform transition-transform duration-300 hover:translate-x-1">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 